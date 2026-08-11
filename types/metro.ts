export type StationStatus = "active" | "abandoned" | "independent" | "captured" | "destroyed";
export type ConnectionType = "metro" | "tunnel" | "bridge" | "surface";
export type HazardType = "radiation" | "biohazard" | "mental" | "collapse" | "mutants" | "cult" | "other";
export type SupportedLanguage = "es" | "en";

export interface LocalizedText {
  es: string;
  en: string;
}

export interface Station {
  id: string;
  name: LocalizedText;
  x: number;
  y: number;
  lineIds: string[];
  factionId?: string;
  status: StationStatus;
  description?: LocalizedText;
  population?: number;
  labelPosition?: "top" | "bottom" | "left" | "right";
}

export interface MetroLine {
  id: string;
  name: LocalizedText;
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
  name: LocalizedText;
  color: string;
  description?: LocalizedText;
}

export interface Hazard {
  id: string;
  type: HazardType;
  x: number;
  y: number;
  title: LocalizedText;
  description?: LocalizedText;
}
