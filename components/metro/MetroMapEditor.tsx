"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { connections as defaultConnections } from "@/data/metro/connections";
import { lines as defaultLines } from "@/data/metro/lines";
import { stations as defaultStations } from "@/data/metro/stations";
import type { Connection, LocalizedText, MetroLine, Station, StationStatus } from "@/types/metro";

type EditorMode = "select" | "place" | "connect";
type MapDraft = { stations: Station[]; lines: MetroLine[]; connections: Connection[] };

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 760;
const statusOptions: StationStatus[] = ["active", "abandoned", "independent", "captured", "destroyed"];
const labelPositions: Station["labelPosition"][] = ["top", "bottom", "left", "right"];
const makeText = (es: string, en: string): LocalizedText => ({ es, en });
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "station";

export function MetroMapEditor() {
  const svgRef = useRef<SVGSVGElement>(null);
  const viewportRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | undefined>(undefined);
  const transformRef = useRef(d3.zoomIdentity);
  const [draft, setDraft] = useState<MapDraft>({ stations: defaultStations, lines: defaultLines, connections: defaultConnections });
  const [mode, setMode] = useState<EditorMode>("select");
  const [selectedStationId, setSelectedStationId] = useState<string>();
  const [pendingConnectionId, setPendingConnectionId] = useState<string>();
  const [selectedLineId, setSelectedLineId] = useState(defaultLines[0]?.id ?? "");
  const [newStationName, setNewStationName] = useState({ es: "", en: "" });
  const [newLine, setNewLine] = useState({ es: "", en: "", color: "#d19a45" });
  const [showLineForm, setShowLineForm] = useState(false);
  const [savedNotice, setSavedNotice] = useState("");

  const selectedStation = draft.stations.find((station) => station.id === selectedStationId);
  const selectedConnections = selectedStation ? draft.connections.filter((connection) => connection.from === selectedStation.id || connection.to === selectedStation.id) : [];

  useEffect(() => {
    if (!svgRef.current || !viewportRef.current) return;
    const svg = d3.select(svgRef.current);
    const viewport = d3.select(viewportRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.5, 4]).on("zoom", (event) => { transformRef.current = event.transform; viewport.attr("transform", event.transform.toString()); });
    zoomRef.current = zoom;
    svg.call(zoom);
    return () => { svg.on(".zoom", null); };
  }, []);

  useEffect(() => {
    const savedDraft = window.localStorage.getItem("metro-map-editor-draft");
    if (!savedDraft) return;
    window.setTimeout(() => {
      try { setDraft(JSON.parse(savedDraft) as MapDraft); setSavedNotice("Borrador local restaurado"); } catch { window.localStorage.removeItem("metro-map-editor-draft"); }
    }, 0);
  }, []);

  function mapPointFromPointer(event: React.MouseEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const rawPoint: [number, number] = [(event.clientX - bounds.left) * VIEWBOX_WIDTH / bounds.width, (event.clientY - bounds.top) * VIEWBOX_HEIGHT / bounds.height];
    return transformRef.current.invert(rawPoint);
  }

  function handleMapClick(event: React.MouseEvent<SVGSVGElement>) {
    if (mode !== "place" || !newStationName.es.trim() || !newStationName.en.trim()) return;
    const [x, y] = mapPointFromPointer(event);
    const id = `${slugify(newStationName.es)}-${Date.now()}`;
    const newStation: Station = { id, name: makeText(newStationName.es.trim(), newStationName.en.trim()), x: Math.round(x), y: Math.round(y), lineIds: selectedLineId ? [selectedLineId] : [], status: "active", labelPosition: "right" };
    setDraft((current) => ({ ...current, stations: [...current.stations, newStation] }));
    setSelectedStationId(id);
    setNewStationName({ es: "", en: "" });
    setMode("select");
  }

  function handleStationClick(event: React.MouseEvent, station: Station) {
    event.stopPropagation();
    if (mode === "connect") {
      if (!pendingConnectionId) { setPendingConnectionId(station.id); return; }
      if (pendingConnectionId === station.id || !selectedLineId) { setPendingConnectionId(undefined); return; }
      const exists = draft.connections.some((connection) => connection.lineId === selectedLineId && ((connection.from === pendingConnectionId && connection.to === station.id) || (connection.from === station.id && connection.to === pendingConnectionId)));
      if (!exists) {
        const connection: Connection = { id: `${selectedLineId}-${pendingConnectionId}-${station.id}`, from: pendingConnectionId, to: station.id, lineId: selectedLineId, type: "metro" };
        setDraft((current) => ({ ...current, connections: [...current.connections, connection], stations: current.stations.map((item) => item.id === pendingConnectionId || item.id === station.id ? { ...item, lineIds: item.lineIds.includes(selectedLineId) ? item.lineIds : [...item.lineIds, selectedLineId] } : item) }));
      }
      setPendingConnectionId(undefined);
      return;
    }
    setSelectedStationId(station.id);
    setMode("select");
  }

  function updateSelectedStation(patch: Partial<Station>) {
    if (!selectedStationId) return;
    setDraft((current) => ({ ...current, stations: current.stations.map((station) => station.id === selectedStationId ? { ...station, ...patch } : station) }));
  }

  function deleteSelectedStation() {
    if (!selectedStationId) return;
    setDraft((current) => ({ stations: current.stations.filter((station) => station.id !== selectedStationId), lines: current.lines, connections: current.connections.filter((connection) => connection.from !== selectedStationId && connection.to !== selectedStationId) }));
    setSelectedStationId(undefined);
  }

  function addLine() {
    if (!newLine.es.trim() || !newLine.en.trim()) return;
    const id = slugify(newLine.en);
    if (draft.lines.some((line) => line.id === id)) return;
    const line: MetroLine = { id, name: makeText(newLine.es.trim(), newLine.en.trim()), color: newLine.color, path: "" };
    setDraft((current) => ({ ...current, lines: [...current.lines, line] }));
    setSelectedLineId(id);
    setNewLine({ es: "", en: "", color: "#d19a45" });
    setShowLineForm(false);
  }

  function saveDraft() {
    window.localStorage.setItem("metro-map-editor-draft", JSON.stringify(draft));
    setSavedNotice("Guardado localmente");
    window.setTimeout(() => setSavedNotice(""), 2200);
  }

  function exportDraft() {
    const file = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a"); link.href = url; link.download = "moscow-metro-map.json"; link.click(); URL.revokeObjectURL(url);
  }

  function importDraft(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try { const imported = JSON.parse(String(reader.result)) as MapDraft; if (Array.isArray(imported.stations) && Array.isArray(imported.lines) && Array.isArray(imported.connections)) { setDraft(imported); setSavedNotice("Mapa importado"); } } catch { setSavedNotice("JSON no válido"); } };
    reader.readAsText(file);
    event.target.value = "";
  }

  function resetToCurrentMap() { setDraft({ stations: defaultStations, lines: defaultLines, connections: defaultConnections }); setSelectedStationId(undefined); setSavedNotice("Mapa base restaurado"); }
  function resetView() {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(400).call(zoomRef.current.transform, d3.zoomIdentity);
  }

  return <main className="metro-shell editor-shell">
    <header className="metro-header"><div className="brand"><div className="brand-mark">M<span>:</span></div><div><div className="brand-title">METRO // 2033</div><div className="brand-subtitle">CREADOR DE MAPAS</div></div></div><div className="editor-header-actions"><span className="editor-save-status">{savedNotice}</span><button className="editor-small-button" onClick={saveDraft}>GUARDAR</button><button className="editor-small-button" onClick={exportDraft}>EXPORTAR JSON</button><label className="editor-small-button file-button">IMPORTAR JSON<input type="file" accept="application/json" onChange={importDraft} /></label><button className="editor-small-button" onClick={resetToCurrentMap}>RESTAURAR BASE</button><a className="editor-small-button" href="/metro">← VISOR</a></div></header>
    <div className="editor-layout">
      <aside className="editor-sidebar"><div className="editor-intro"><span className="eyebrow">HERRAMIENTA DE EDICIÓN</span><h1>Construye tu mapa</h1><p>Coloca estaciones, define líneas y conecta cada tramo directamente sobre el esquema.</p></div><div className="editor-step"><span>01</span><div><strong>Selecciona una herramienta</strong><div className="editor-mode-buttons"><button className={mode === "select" ? "selected" : ""} onClick={() => { setMode("select"); setPendingConnectionId(undefined); }}>↖ Seleccionar</button><button className={mode === "place" ? "selected" : ""} onClick={() => setMode("place")}>＋ Colocar estación</button><button className={mode === "connect" ? "selected" : ""} onClick={() => setMode("connect")}>⌁ Conectar estaciones</button></div></div></div><div className="editor-step"><span>02</span><div className="editor-form"><strong>Datos de la nueva estación</strong><input value={newStationName.es} onChange={(event) => setNewStationName((current) => ({ ...current, es: event.target.value }))} placeholder="Nombre en español" /><input value={newStationName.en} onChange={(event) => setNewStationName((current) => ({ ...current, en: event.target.value }))} placeholder="Name in English" /><select value={selectedLineId} onChange={(event) => setSelectedLineId(event.target.value)}><option value="">Sin línea</option>{draft.lines.map((line) => <option key={line.id} value={line.id}>{line.name.es}</option>)}</select>{mode === "place" && <small className="editor-hint">Haz clic en el mapa para colocarla</small>}</div></div><div className="editor-step"><span>03</span><div className="editor-form"><div className="editor-section-heading"><strong>Líneas</strong><button onClick={() => setShowLineForm((value) => !value)}>＋ Añadir</button></div>{draft.lines.map((line) => <button className={`editor-line-option ${line.id === selectedLineId ? "selected" : ""}`} key={line.id} onClick={() => setSelectedLineId(line.id)}><i style={{ backgroundColor: line.color }} />{line.name.es}<small>{draft.stations.filter((station) => station.lineIds.includes(line.id)).length}</small></button>)}{showLineForm && <div className="new-line-form"><input value={newLine.es} onChange={(event) => setNewLine((current) => ({ ...current, es: event.target.value }))} placeholder="Nombre en español" /><input value={newLine.en} onChange={(event) => setNewLine((current) => ({ ...current, en: event.target.value }))} placeholder="Name in English" /><input type="color" value={newLine.color} onChange={(event) => setNewLine((current) => ({ ...current, color: event.target.value }))} /><button onClick={addLine}>CREAR LÍNEA</button></div>}</div></div><div className="editor-stats"><span>{draft.stations.length} ESTACIONES</span><span>{draft.connections.length} CONEXIONES</span></div></aside>
      <section className="editor-map-stage"><div className="editor-instruction">{mode === "place" ? "HAZ CLIC EN EL MAPA PARA COLOCAR LA ESTACIÓN" : mode === "connect" ? pendingConnectionId ? "SELECCIONA LA ESTACIÓN DE DESTINO" : "SELECCIONA LA ESTACIÓN DE ORIGEN" : "SELECCIONA UNA ESTACIÓN PARA EDITARLA"}</div><svg ref={svgRef} className="metro-svg editor-svg" viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} onClick={handleMapClick} aria-label="Editor visual del mapa del metro"><defs><pattern id="editor-grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M 42 0 L 0 0 0 42" fill="none" stroke="#263139" strokeWidth="1" opacity=".45" /></pattern></defs><g ref={viewportRef}><rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#editor-grid)" />{draft.connections.map((connection) => { const from = draft.stations.find((station) => station.id === connection.from); const to = draft.stations.find((station) => station.id === connection.to); const line = draft.lines.find((item) => item.id === connection.lineId); if (!from || !to) return null; return <line key={connection.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={line?.color ?? "#829095"} className="editor-connection" />; })}{draft.stations.map((station) => { const isSelected = selectedStationId === station.id; const isPending = pendingConnectionId === station.id; const color = draft.lines.find((line) => line.id === station.lineIds[0])?.color ?? "#9aa0a8"; return <g key={station.id} transform={`translate(${station.x} ${station.y})`} className={`editor-station ${isSelected ? "selected" : ""} ${isPending ? "pending" : ""}`} onClick={(event) => handleStationClick(event, station)} role="button" tabIndex={0} aria-label={`Editar ${station.name.es}`} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") handleStationClick(event as unknown as React.MouseEvent, station); }}><circle r="13" fill="#172124" stroke={color} strokeWidth="3" /><circle r="5" fill="#e8ebe6" /><text x="18" y="4" className="editor-station-label">{station.name.es}</text></g>; })}</g></svg><div className="editor-map-controls"><button onClick={() => svgRef.current && zoomRef.current && d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.25)}>+</button><button onClick={() => svgRef.current && zoomRef.current && d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, .8)}>−</button><button onClick={resetView}>CENTRAR</button></div></section>
      <aside className="editor-inspector"><div className="panel-kicker"><span>INSPECTOR</span><span>{selectedStation ? "ESTACIÓN" : "MAPA"}</span></div>{selectedStation ? <div className="editor-inspector-content"><h2>{selectedStation.name.es}</h2><p className="editor-id">ID: {selectedStation.id}</p><label>ESPAÑOL<input value={selectedStation.name.es} onChange={(event) => updateSelectedStation({ name: { ...selectedStation.name, es: event.target.value } })} /></label><label>ENGLISH<input value={selectedStation.name.en} onChange={(event) => updateSelectedStation({ name: { ...selectedStation.name, en: event.target.value } })} /></label><label>ESTADO<select value={selectedStation.status} onChange={(event) => updateSelectedStation({ status: event.target.value as StationStatus })}>{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></label><label>POSICIÓN DE ETIQUETA<select value={selectedStation.labelPosition} onChange={(event) => updateSelectedStation({ labelPosition: event.target.value as Station["labelPosition"] })}>{labelPositions.map((position) => <option key={position} value={position}>{position}</option>)}</select></label><div className="inspector-lines"><span>LÍNEAS</span>{selectedStation.lineIds.length ? selectedStation.lineIds.map((lineId) => <small key={lineId}>{draft.lines.find((line) => line.id === lineId)?.name.es ?? lineId}</small>) : <small>Sin líneas</small>}</div><div className="inspector-connections"><span>CONEXIONES ({selectedConnections.length})</span>{selectedConnections.map((connection) => { const otherId = connection.from === selectedStation.id ? connection.to : connection.from; return <small key={connection.id}>{draft.stations.find((station) => station.id === otherId)?.name.es}</small>; })}</div><button className="editor-delete" onClick={deleteSelectedStation}>ELIMINAR ESTACIÓN</button></div> : <div className="editor-empty"><div className="editor-empty-icon">⌖</div><h2>Selecciona una estación</h2><p>Haz clic sobre cualquier nodo del mapa para editar nombres, estado y posición de etiqueta.</p><div className="editor-help"><strong>Consejo</strong><span>Para conectar dos estaciones, selecciona una línea, activa “Conectar estaciones” y haz clic en los dos nodos.</span></div></div>}</aside>
    </div>
  </main>;
}
