export type StationStatus = "active" | "abandoned" | "independent" | "captured" | "destroyed";
export type ConnectionType = "metro" | "tunnel" | "bridge" | "surface";
export type HazardType = "radiation" | "biohazard" | "mental" | "collapse" | "mutants" | "cult" | "other";

export interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
  lineIds: string[];
  factionId?: string;
  status: StationStatus;
  description?: string;
  population?: number;
  labelPosition?: "top" | "bottom" | "left" | "right";
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  path: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  lineId: string;
  dangerous?: boolean;
  type?: ConnectionType;
}

export interface Faction {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Hazard {
  id: string;
  type: HazardType;
  x: number;
  y: number;
  title: string;
  description?: string;
}
