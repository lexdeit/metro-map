"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Connection, Faction, Hazard, MetroLine, Station, SupportedLanguage } from "@/types/metro";
import { localizedText } from "@/lib/metro/i18n";

type MetroMapProps = {
  stations: Station[];
  lines: MetroLine[];
  connections: Connection[];
  factions: Faction[];
  hazards: Hazard[];
  visibleFactions: Set<string>;
  showHazards: boolean;
  selectedId?: string;
  route: Station[];
  onSelectStation: (station: Station) => void;
  onSelectHazard: (hazard: Hazard) => void;
  onZoomReady: (zoomIn: () => void, zoomOut: () => void, reset: () => void, focus: (station: Station) => void) => void;
  language: SupportedLanguage;
};

const hazardGlyph: Record<Hazard["type"], string> = { radiation: "☢", biohazard: "✣", mental: "◉", collapse: "⌁", mutants: "♠", cult: "✦", other: "!" };

export function MetroMap({ stations, lines, connections, factions, hazards, visibleFactions, showHazards, selectedId, route, onSelectStation, onSelectHazard, onZoomReady, language }: MetroMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const viewportRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !viewportRef.current) return;
    const svg = d3.select(svgRef.current);
    const viewport = d3.select(viewportRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.65, 3.2]).on("zoom", (event) => viewport.attr("transform", event.transform.toString()));
    svg.call(zoom);
    const reset = () => svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    const zoomIn = () => svg.transition().duration(250).call(zoom.scaleBy, 1.25);
    const zoomOut = () => svg.transition().duration(250).call(zoom.scaleBy, 0.8);
    const focus = (station: Station) => {
      const element = svgRef.current;
      if (!element) return;
      const box = element.getBoundingClientRect();
      const scale = 1.45;
      const transform = d3.zoomIdentity.translate(box.width / 2 - station.x * scale, box.height / 2 - station.y * scale).scale(scale);
      svg.transition().duration(650).call(zoom.transform, transform);
    };
    onZoomReady(zoomIn, zoomOut, reset, focus);
    return () => { svg.on(".zoom", null); };
  }, [onZoomReady]);

  const factionColor = (id?: string) => factions.find((faction) => faction.id === id)?.color ?? "#9aa0a8";
  const routeIds = new Set(route.map((station) => station.id));
  const routeConnectionIds = new Set(route.slice(1).map((station, index) => `${route[index].id}-${station.id}`));
  const stationMap = new Map(stations.map((station) => [station.id, station]));

  return (
    <svg ref={svgRef} className="metro-svg" viewBox="0 0 1200 760" role="img" aria-label="Interactive schematic map of the Moscow Metro">
      <defs>
        <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M 42 0 L 0 0 0 42" fill="none" stroke="#263139" strokeWidth="1" opacity=".45" /></pattern>
        <filter id="glow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <g ref={viewportRef} className="viewport">
        <rect width="1200" height="760" fill="url(#grid)" />
        <path d="M 55 80 L 1135 80 L 1135 685 L 55 685 Z" fill="none" stroke="#34414a" strokeDasharray="3 12" />
        <g className="tunnels-layer">
          {connections.map((connection) => { const from = stationMap.get(connection.from); const to = stationMap.get(connection.to); if (!from || !to) return null; return <line key={`tunnel-${connection.id}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="tunnel-line" />; })}
        </g>
        <g className="lines-layer">
          {lines.map((line) => <path key={line.id} d={line.path} fill="none" stroke={line.color} className="metro-line" />)}
        </g>
        <g className="connections-layer">
          {connections.map((connection) => { const from = stationMap.get(connection.from); const to = stationMap.get(connection.to); if (!from || !to) return null; const routeActive = routeConnectionIds.has(connection.id) || routeConnectionIds.has(`${connection.to}-${connection.from}`); return <line key={connection.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={lines.find((line) => line.id === connection.lineId)?.color} className={`connection-line ${connection.dangerous ? "dangerous" : ""} ${route.length && !routeActive ? "route-muted" : ""} ${routeActive ? "route-active" : ""}`} />; })}
        </g>
        {showHazards && <g className="hazards-layer">{hazards.map((hazard) => <g key={hazard.id} className="hazard-mark" transform={`translate(${hazard.x} ${hazard.y})`} onClick={() => onSelectHazard(hazard)} role="button" tabIndex={0} aria-label={`${language === "es" ? "Peligro" : "Hazard"}: ${localizedText(hazard.title, language)}`} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelectHazard(hazard); }}><circle r="17" /><text textAnchor="middle" dy="6">{hazardGlyph[hazard.type]}</text><title>{localizedText(hazard.title, language)}</title></g>)}</g>}
        <g className="stations-layer">
          {stations.map((station) => { const visible = !station.factionId || visibleFactions.has(station.factionId); const isRoute = routeIds.has(station.id); const isSelected = selectedId === station.id; const stationName = localizedText(station.name, language); return <g key={station.id} className={`station ${visible ? "" : "faction-muted"} ${isSelected ? "selected" : ""} ${isRoute ? "route-station" : ""}`} transform={`translate(${station.x} ${station.y})`} onClick={() => onSelectStation(station)} role="button" tabIndex={0} aria-label={`${language === "es" ? "Estación" : "Station"} ${stationName}`} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelectStation(station); }}><circle className="station-halo" r={isSelected || isRoute ? 15 : 11} fill={factionColor(station.factionId)} /><circle className="station-core" r="5" /><title>{`${stationName} · ${station.status}`}</title><text className={`station-label label-${station.labelPosition ?? "bottom"}`} x={station.labelPosition === "left" ? -17 : station.labelPosition === "right" ? 17 : 0} y={station.labelPosition === "top" ? -17 : station.labelPosition === "bottom" ? 25 : 5} textAnchor={station.labelPosition === "left" ? "end" : station.labelPosition === "right" ? "start" : "middle"}>{stationName}</text></g>; })}
        </g>
        <g className="labels-layer"><text x="70" y="110" className="map-caption">MOSCOW // UNDERGROUND NETWORK</text><text x="1130" y="665" className="map-coordinates">55°45′N · 37°37′E</text></g>
      </g>
    </svg>
  );
}
