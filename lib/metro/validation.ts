import type { Connection, Faction, Hazard, MetroLine, Station } from "@/types/metro";

export interface MetroDataValidationResult {
  valid: boolean;
  issues: string[];
}

export function validateMetroData(stations: Station[], lines: MetroLine[], connections: Connection[], factions: Faction[], hazards: Hazard[]): MetroDataValidationResult {
  const issues: string[] = [];
  const stationIds = new Set<string>();
  const lineIds = new Set(lines.map((line) => line.id));
  const factionIds = new Set(factions.map((faction) => faction.id));

  stations.forEach((station) => {
    if (stationIds.has(station.id)) issues.push(`Duplicate station id: ${station.id}`);
    stationIds.add(station.id);
    station.lineIds.forEach((lineId) => { if (!lineIds.has(lineId)) issues.push(`Unknown line ${lineId} on station ${station.id}`); });
    if (station.factionId && !factionIds.has(station.factionId)) issues.push(`Unknown faction ${station.factionId} on station ${station.id}`);
    if (!station.name.es || !station.name.en) issues.push(`Missing station translation: ${station.id}`);
  });

  lines.forEach((line) => {
    if (!line.name.es || !line.name.en) issues.push(`Missing line translation: ${line.id}`);
  });
  connections.forEach((connection) => {
    if (!stationIds.has(connection.from) || !stationIds.has(connection.to)) issues.push(`Invalid connection endpoints: ${connection.id}`);
    if (!lineIds.has(connection.lineId)) issues.push(`Unknown line on connection: ${connection.id}`);
  });
  hazards.forEach((hazard) => { if (!hazard.title.es || !hazard.title.en) issues.push(`Missing hazard translation: ${hazard.id}`); });

  return { valid: issues.length === 0, issues };
}
