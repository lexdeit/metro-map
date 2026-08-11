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
import { findRoute } from "@/lib/metro/routing";
import type { Hazard, Station } from "@/types/metro";

type MapActions = { zoomIn: () => void; zoomOut: () => void; reset: () => void; focus: (station: Station) => void };

export default function MetroPage() {
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

  const results = useMemo(() => query.trim() ? stations.filter((station) => station.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [], [query]);
  const selectedFaction = factions.find((faction) => faction.id === selected?.factionId);
  const connectedStations = selected ? connections.filter((connection) => connection.from === selected.id || connection.to === selected.id).map((connection) => stations.find((station) => station.id === (connection.from === selected.id ? connection.to : connection.from))).filter((station): station is Station => Boolean(station)) : [];
  const routeIds = new Set(route.map((station) => station.id));

  const handleZoomReady = useCallback((zoomIn: () => void, zoomOut: () => void, reset: () => void, focus: (station: Station) => void) => {
    setMapActions({ zoomIn: () => { zoomIn(); setZoom((value) => Math.min(3.2, value * 1.25)); }, zoomOut: () => { zoomOut(); setZoom((value) => Math.max(.65, value * .8)); }, reset: () => { reset(); setZoom(1); }, focus });
  }, []);

  function focusStation(station: Station) {
    setSelected(station);
    setQuery("");
    mapActions.focus(station);
  }

  function toggleFaction(id: string) {
    setVisibleFactions((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  function calculateRoute() {
    if (!fromId || !toId) return;
    setRoute(findRoute(fromId, toId, stations, connections));
  }

  return <main className="metro-shell">
    <header className="metro-header"><div className="brand"><div className="brand-mark">M<span>:</span></div><div><div className="brand-title">METRO // 2033</div><div className="brand-subtitle">UNDERGROUND CARTOGRAPHY UNIT</div></div></div><div className="header-status"><span className="live-dot" /> NETWORK STATUS <strong>PARTIAL</strong><span className="header-divider" /> <span className="header-date">15.08.2033 / 23:41</span></div></header>
    <section className="map-toolbar"><div className="map-title"><span className="eyebrow">SCHEMATIC TRANSIT MAP</span><h1>Moscow Metro <em>after dark</em></h1></div><div className="search-wrap"><span className="search-icon">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search station..." aria-label="Search station" />{query && <button className="clear-search" onClick={() => setQuery("")} aria-label="Clear search">×</button>}{results.length > 0 && <div className="search-results">{results.map((station) => <button key={station.id} onClick={() => focusStation(station)}><span className="result-dot" style={{ backgroundColor: factions.find((faction) => faction.id === station.factionId)?.color }} /><span>{station.name}</span><small>{station.status}</small></button>)}</div>}</div><div className="map-meta"><span>18 STATIONS</span><span className="meta-slash">/</span><span>04 LINES</span></div></section>
    <div className="workspace">
      <aside className="filter-panel"><div className="panel-kicker"><span>FILTERS</span><span className="filter-count">{visibleFactions.size}/6</span></div><div className="filter-section"><div className="section-title">FACTIONS <span>⌄</span></div>{factions.map((faction) => <label className="filter-option" key={faction.id}><input type="checkbox" checked={visibleFactions.has(faction.id)} onChange={() => toggleFaction(faction.id)} /><span className="checkbox" style={{ borderColor: faction.color, backgroundColor: visibleFactions.has(faction.id) ? faction.color : "transparent" }}>✓</span><span>{faction.name}</span></label>)}</div><div className="filter-section"><label className="hazard-toggle"><span><span className="hazard-symbol">☢</span> SHOW HAZARDS</span><input type="checkbox" checked={showHazards} onChange={(event) => setShowHazards(event.target.checked)} /><span className="toggle" /></label></div><div className="legend"><div className="section-title">MAP KEY</div><div className="legend-row"><i className="legend-station" /> Station</div><div className="legend-row"><i className="legend-hazard">☢</i> Hazard zone</div><div className="legend-row"><i className="legend-danger" /> Dangerous tunnel</div></div><div className="coordinates">GRID REF<br /><strong>MSK-07 / SECTOR 4</strong><br /><span>DATA UPDATED 04:18 AGO</span></div></aside>
      <section className="map-stage"><div className="map-annotation top-left">NORTH // SURFACE UNRELIABLE</div><MetroMap stations={stations} lines={lines} connections={connections} factions={factions} hazards={hazards} visibleFactions={visibleFactions} showHazards={showHazards} selectedId={selected?.id} route={route} onSelectStation={(station) => { setSelectedHazard(undefined); setSelected(station); }} onSelectHazard={(hazard) => { setSelected(undefined); setSelectedHazard(hazard); }} onZoomReady={handleZoomReady} /><div className="map-annotation bottom-right">N 55°45′ / E 37°37′<br /><span>NO SURFACE CONTACT</span></div><MetroControls onZoomIn={mapActions.zoomIn} onZoomOut={mapActions.zoomOut} onReset={mapActions.reset} zoom={zoom} /></section>
      {selected && <StationPanel station={selected} faction={selectedFaction} connections={connectedStations} onClose={() => setSelected(undefined)} onRoute={() => { setFromId(selected.id); setSelected(undefined); }} />}
      {selectedHazard && <aside className="station-panel hazard-panel"><div className="panel-kicker"><span>HAZARD REPORT</span><button className="icon-button" onClick={() => setSelectedHazard(undefined)} aria-label="Close hazard panel">×</button></div><div className="hazard-detail-icon">☢</div><h2>{selectedHazard.title}</h2><p className="hazard-type">{selectedHazard.type.toUpperCase()} ZONE</p><div className="panel-rule" /><p className="station-description">{selectedHazard.description}</p></aside>}
    </div>
    <section className="route-dock"><div className="route-header"><div><span className="eyebrow">NAVIGATION ASSIST</span><h2>Plot a safe passage</h2></div>{route.length > 0 && <button className="route-clear" onClick={() => setRoute([])}>CLEAR ROUTE ×</button>}</div><div className="route-fields"><label>FROM<select value={fromId} onChange={(event) => setFromId(event.target.value)}><option value="">Select station</option>{stations.map((station) => <option key={station.id} value={station.id}>{station.name}</option>)}</select></label><span className="route-arrow">→</span><label>TO<select value={toId} onChange={(event) => setToId(event.target.value)}><option value="">Select station</option>{stations.map((station) => <option key={station.id} value={station.id}>{station.name}</option>)}</select></label><button className="find-route" onClick={calculateRoute} disabled={!fromId || !toId}>FIND ROUTE <span>↗</span></button></div>{route.length > 0 && <div className="route-result"><span className="route-pulse" /> ROUTE FOUND <strong>{route.length} STATIONS</strong><div className="route-path">{route.map((station, index) => <span key={station.id} className={routeIds.has(station.id) ? "" : ""}>{station.name}{index < route.length - 1 && <b> → </b>}</span>)}</div></div>}</section>
  </main>;
}
