"use client";

import { useCallback, useMemo, useState } from "react";
import { MetroControls } from "@/components/metro/MetroControls";
import { MetroMap } from "@/components/metro/MetroMap";
import { StationPanel } from "@/components/metro/StationPanel";
import { connections } from "@/data/metro/connections";
import { factions } from "@/data/metro/factions";
import { hazards } from "@/data/metro/hazards";
import { lines } from "@/data/metro/lines";
import { stations } from "@/data/metro/stations";
import { defaultLanguage, interfaceCopy, localizedText } from "@/lib/metro/i18n";
import { findRoute } from "@/lib/metro/routing";
import type { Hazard, Station, SupportedLanguage } from "@/types/metro";

type MapActions = { zoomIn: () => void; zoomOut: () => void; reset: () => void; focus: (station: Station) => void };

const stationStatusLabels = {
  active: { es: "activa", en: "active" }, abandoned: { es: "abandonada", en: "abandoned" }, independent: { es: "independiente", en: "independent" }, captured: { es: "capturada", en: "captured" }, destroyed: { es: "destruida", en: "destroyed" },
};
const hazardTypeLabels = {
  radiation: { es: "zona de radiación", en: "radiation zone" }, biohazard: { es: "zona biológica", en: "biohazard zone" }, mental: { es: "peligro mental", en: "mental hazard" }, collapse: { es: "colapso de túnel", en: "tunnel collapse" }, mutants: { es: "mutantes", en: "mutants" }, cult: { es: "culto", en: "cult" }, other: { es: "otro peligro", en: "other hazard" },
};

export default function MetroPage() {
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [selected, setSelected] = useState<Station>();
  const [selectedHazard, setSelectedHazard] = useState<Hazard>();
  const [visibleFactions, setVisibleFactions] = useState(() => new Set(factions.map((faction) => faction.id)));
  const [showHazards, setShowHazards] = useState(true);
  const [query, setQuery] = useState("");
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [route, setRoute] = useState<Station[]>([]);
  const [zoom, setZoom] = useState(1);
  const [mapActions, setMapActions] = useState<MapActions>({ zoomIn: () => {}, zoomOut: () => {}, reset: () => {}, focus: () => {} });
  const copy = (key: string) => localizedText(interfaceCopy[key], language);
  const results = useMemo(() => query.trim() ? stations.filter((station) => localizedText(station.name, language).toLowerCase().includes(query.toLowerCase())).slice(0, 6) : [], [language, query]);
  const selectedFaction = factions.find((faction) => faction.id === selected?.factionId);
  const connectedStations = selected ? connections.filter((connection) => connection.from === selected.id || connection.to === selected.id).map((connection) => stations.find((station) => station.id === (connection.from === selected.id ? connection.to : connection.from))).filter((station): station is Station => Boolean(station)) : [];

  const handleZoomReady = useCallback((zoomIn: () => void, zoomOut: () => void, reset: () => void, focus: (station: Station) => void) => {
    setMapActions({ zoomIn: () => { zoomIn(); setZoom((value) => Math.min(3.2, value * 1.25)); }, zoomOut: () => { zoomOut(); setZoom((value) => Math.max(.65, value * .8)); }, reset: () => { reset(); setZoom(1); }, focus });
  }, []);
  const focusStation = (station: Station) => { setSelectedHazard(undefined); setSelected(station); setQuery(""); mapActions.focus(station); };
  const toggleFaction = (id: string) => setVisibleFactions((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const calculateRoute = () => { if (fromId && toId) setRoute(findRoute(fromId, toId, stations, connections)); };

  return <main className="metro-shell">
    <header className="metro-header"><div className="brand"><div className="brand-mark">M<span>:</span></div><div><div className="brand-title">METRO // 2033</div><div className="brand-subtitle">{copy("brandSubtitle")}</div></div></div><div className="header-status"><a className="editor-small-button viewer-editor-link" href="/metro/editor">{language === "es" ? "CREAR MAPA" : "MAP CREATOR"}</a><span className="live-dot" /> {copy("networkStatus")} <strong>{copy("partial")}</strong><span className="header-divider" /><span className="header-date">15.08.2033 / 23:41</span><div className="language-switcher" aria-label={language === "es" ? "Selector de idioma" : "Language selector"}><button className={language === "es" ? "active" : ""} onClick={() => setLanguage("es")}>ES</button><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button></div></div></header>
    <section className="map-toolbar"><div className="map-title"><span className="eyebrow">{copy("schematicMap")}</span><h1>{copy("title")} <em>{copy("afterDark")}</em></h1></div><div className="search-wrap"><span className="search-icon">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy("search")} aria-label={copy("search")} />{query && <button className="clear-search" onClick={() => setQuery("")} aria-label={language === "es" ? "Limpiar búsqueda" : "Clear search"}>×</button>}{results.length > 0 && <div className="search-results">{results.map((station) => <button key={station.id} onClick={() => focusStation(station)}><span className="result-dot" style={{ backgroundColor: factions.find((faction) => faction.id === station.factionId)?.color }} /><span>{localizedText(station.name, language)}</span><small>{localizedText(stationStatusLabels[station.status], language)}</small></button>)}</div>}</div><div className="map-meta"><span>{stations.length} {copy("stations")}</span><span className="meta-slash">/</span><span>{lines.length} {copy("lines")}</span></div></section>
    <div className="workspace">
      <aside className="filter-panel"><div className="panel-kicker"><span>{copy("filters")}</span><span className="filter-count">{visibleFactions.size}/{factions.length}</span></div><div className="filter-section"><div className="section-title">{copy("factions")} <span>⌄</span></div>{factions.map((faction) => <label className="filter-option" key={faction.id}><input type="checkbox" checked={visibleFactions.has(faction.id)} onChange={() => toggleFaction(faction.id)} /><span className="checkbox" style={{ borderColor: faction.color, backgroundColor: visibleFactions.has(faction.id) ? faction.color : "transparent" }}>✓</span><span>{localizedText(faction.name, language)}</span></label>)}</div><div className="filter-section"><label className="hazard-toggle"><span><span className="hazard-symbol">☢</span> {copy("showHazards")}</span><input type="checkbox" checked={showHazards} onChange={(event) => setShowHazards(event.target.checked)} /><span className="toggle" /></label></div><div className="legend"><div className="section-title">{copy("mapKey")}</div><div className="legend-row"><i className="legend-station" /> {copy("station")}</div><div className="legend-row"><i className="legend-hazard">☢</i> {copy("hazardZone")}</div><div className="legend-row"><i className="legend-danger" /> {copy("dangerousTunnel")}</div></div><div className="coordinates">REF. DE CUADRÍCULA<br /><strong>MSK-07 / SECTOR 4</strong><br /><span>DATOS ACTUALIZADOS HACE 04:18</span></div></aside>
      <section className="map-stage"><div className="map-annotation top-left">{language === "es" ? "NORTE // SUPERFICIE INESTABLE" : "NORTH // SURFACE UNRELIABLE"}</div><MetroMap stations={stations} lines={lines} connections={connections} factions={factions} hazards={hazards} visibleFactions={visibleFactions} showHazards={showHazards} selectedId={selected?.id} route={route} language={language} onSelectStation={(station) => { setSelectedHazard(undefined); setSelected(station); }} onSelectHazard={(hazard) => { setSelected(undefined); setSelectedHazard(hazard); }} onZoomReady={handleZoomReady} /><div className="map-annotation bottom-right">N 55°45′ / E 37°37′<br /><span>{language === "es" ? "SIN CONTACTO DE SUPERFICIE" : "NO SURFACE CONTACT"}</span></div><MetroControls onZoomIn={mapActions.zoomIn} onZoomOut={mapActions.zoomOut} onReset={mapActions.reset} zoom={zoom} /></section>
      {selected && <StationPanel station={selected} faction={selectedFaction} connections={connectedStations} lines={lines} language={language} onClose={() => setSelected(undefined)} onRoute={() => { setFromId(selected.id); setSelected(undefined); }} />}
      {selectedHazard && <aside className="station-panel hazard-panel"><div className="panel-kicker"><span>{copy("hazardReport")}</span><button className="icon-button" onClick={() => setSelectedHazard(undefined)} aria-label={language === "es" ? "Cerrar informe" : "Close report"}>×</button></div><div className="hazard-detail-icon">☢</div><h2>{localizedText(selectedHazard.title, language)}</h2><p className="hazard-type">{localizedText(hazardTypeLabels[selectedHazard.type], language).toUpperCase()}</p><div className="panel-rule" /><p className="station-description">{localizedText(selectedHazard.description, language)}</p></aside>}
    </div>
    <section className="route-dock"><div className="route-header"><div><span className="eyebrow">{copy("navigation")}</span><h2>{copy("routeTitle")}</h2></div>{route.length > 0 && <button className="route-clear" onClick={() => setRoute([])}>{copy("clearRoute")}</button>}</div><div className="route-fields"><label>{copy("from")}<select value={fromId} onChange={(event) => setFromId(event.target.value)}><option value="">{copy("selectStation")}</option>{stations.map((station) => <option key={station.id} value={station.id}>{localizedText(station.name, language)}</option>)}</select></label><span className="route-arrow">→</span><label>{copy("to")}<select value={toId} onChange={(event) => setToId(event.target.value)}><option value="">{copy("selectStation")}</option>{stations.map((station) => <option key={station.id} value={station.id}>{localizedText(station.name, language)}</option>)}</select></label><button className="find-route" onClick={calculateRoute} disabled={!fromId || !toId}>{copy("findRoute")} <span>↗</span></button></div>{route.length > 0 && <div className="route-result"><span className="route-pulse" /> {copy("routeFound")} <strong>{route.length} {copy("stations").toLowerCase()}</strong><div className="route-path">{route.map((station, index) => <span key={station.id}>{localizedText(station.name, language)}{index < route.length - 1 && <b> → </b>}</span>)}</div></div>}</section>
  </main>;
}
