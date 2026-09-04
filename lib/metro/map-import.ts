import type { Connection, LocalizedText, MetroLine, Station } from "@/types/metro";

export interface EditableMapDraft {
  stations: Station[];
  lines: MetroLine[];
  connections: Connection[];
  backgroundImage?: string;
  backgroundOpacity?: number;
  backgroundNaturalWidth?: number;
  backgroundNaturalHeight?: number;
  backgroundScale?: number;
}

interface SourceMapRecord {
  lines?: unknown;
  stations?: unknown;
  links?: unknown;
  factions?: unknown;
  transfers?: unknown;
}

const record = (value: unknown): Record<string, unknown> => typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
const text = (value: unknown): LocalizedText => { const stringValue = typeof value === "string" ? value : ""; return { es: stringValue, en: stringValue }; };
const id = (value: unknown): string => typeof value === "string" ? value : "";
const number = (value: unknown): number => typeof value === "number" && Number.isFinite(value) ? value : 0;

export function isSourceMapPayload(value: unknown): value is SourceMapRecord {
  const data = record(value);
  return Array.isArray(data.lines) && Array.isArray(data.stations) && Array.isArray(data.links);
}

export function normalizeSourceMapPayload(payload: SourceMapRecord): EditableMapDraft {
  const rawLines = Array.isArray(payload.lines) ? payload.lines : [];
  const rawStations = Array.isArray(payload.stations) ? payload.stations : [];
  const rawLinks = Array.isArray(payload.links) ? payload.links : [];
  const rawFactions = Array.isArray(payload.factions) ? payload.factions : [];
  const rawTransfers = Array.isArray(payload.transfers) ? payload.transfers : [];
  const factionStationIds = new Map<string, string>();
  rawFactions.forEach((value) => { const faction = record(value); const factionId = id(faction.id); const stationIds = Array.isArray(faction.station_ids) ? faction.station_ids : []; stationIds.forEach((stationId) => factionStationIds.set(id(stationId), factionId)); });
  const lines: MetroLine[] = rawLines.map((value) => { const line = record(value); return { id: id(line.id), number: number(line.number), name: text(line.name), color: id(line.color) || "#829095", path: "", isRing: line.is_ring === true }; });
  const stations: Station[] = rawStations.map((value) => { const station = record(value); const stationId = id(station.id); const lineId = id(station.line_id); const factionId = id(station.faction) || factionStationIds.get(stationId); return { id: stationId, name: text(station.name), x: number(station.x), y: number(station.y), lineIds: lineId ? [lineId] : [], factionId: factionId || undefined, status: "active", labelPosition: "right", isTransfer: station.is_transfer === true }; });
  const stationById = new Map(stations.map((station) => [station.id, station]));
  const connections: Connection[] = rawLinks.map((value, index) => { const link = record(value); return { id: `link-${index}`, from: id(link.source), to: id(link.target), lineId: id(link.line_id), type: "metro" }; });
  rawTransfers.forEach((value, transferIndex) => { const transfer = record(value); const transferStations = Array.isArray(transfer.stations) ? transfer.stations.map(id).filter((stationId) => stationById.has(stationId)) : []; transferStations.slice(0, -1).forEach((from, index) => { const to = transferStations[index + 1]; const lineId = stationById.get(from)?.lineIds[0] ?? stationById.get(to)?.lineIds[0] ?? ""; if (lineId) connections.push({ id: `transfer-${transferIndex}-${index}`, from, to, lineId, type: "tunnel" }); }); });
  const ringLine = lines.find((line) => line.isRing);
  if (ringLine) {
    const ringLinks = connections.filter((connection) => connection.lineId === ringLine.id);
    const ringStationIds = [...new Set(ringLinks.length ? [ringLinks[0].from, ...ringLinks.map((connection) => connection.to)] : [])];
    const ringStations = ringStationIds.map((stationId) => stationById.get(stationId)).filter((station): station is Station => Boolean(station));
    const centerX = ringStations.reduce((total, station) => total + station.x, 0) / ringStations.length;
    const centerY = ringStations.reduce((total, station) => total + station.y, 0) / ringStations.length;
    const radius = ringStations.reduce((total, station) => total + Math.hypot(station.x - centerX, station.y - centerY), 0) / ringStations.length;
    const startAngle = ringStations.length ? Math.atan2(ringStations[0].y - centerY, ringStations[0].x - centerX) : 0;
    ringStations.forEach((station, index) => { const angle = startAngle + (Math.PI * 2 * index) / ringStations.length; station.x = Math.round(centerX + radius * Math.cos(angle)); station.y = Math.round(centerY + radius * Math.sin(angle)); });
    ringLine.path = `M ${Math.round(centerX)} ${Math.round(centerY - radius)} A ${Math.round(radius)} ${Math.round(radius)} 0 1 1 ${Math.round(centerX)} ${Math.round(centerY + radius)} A ${Math.round(radius)} ${Math.round(radius)} 0 1 1 ${Math.round(centerX)} ${Math.round(centerY - radius)}`;
  }
  return { stations, lines, connections };
}

export function normalizeEditableDraft(value: unknown): EditableMapDraft {
  if (isSourceMapPayload(value)) return normalizeSourceMapPayload(value);
  const data = record(value);
  if (Array.isArray(data.stations) && Array.isArray(data.lines) && Array.isArray(data.connections)) return value as EditableMapDraft;
  throw new Error("Formato de mapa no reconocido");
}
