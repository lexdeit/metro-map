import type { LocalizedText, SupportedLanguage } from "@/types/metro";

export const defaultLanguage: SupportedLanguage = "es";

export const interfaceCopy: Record<string, LocalizedText> = {
  brandSubtitle: { es: "UNIDAD DE CARTOGRAFÍA SUBTERRÁNEA", en: "UNDERGROUND CARTOGRAPHY UNIT" },
  networkStatus: { es: "ESTADO DE RED", en: "NETWORK STATUS" },
  partial: { es: "PARCIAL", en: "PARTIAL" },
  schematicMap: { es: "MAPA ESQUEMÁTICO DE TRÁNSITO", en: "SCHEMATIC TRANSIT MAP" },
  title: { es: "Metro de Moscú", en: "Moscow Metro" },
  afterDark: { es: "después del anochecer", en: "after dark" },
  search: { es: "Buscar estación...", en: "Search station..." },
  filters: { es: "FILTROS", en: "FILTERS" },
  factions: { es: "FACCIONES", en: "FACTIONS" },
  showHazards: { es: "MOSTRAR PELIGROS", en: "SHOW HAZARDS" },
  mapKey: { es: "LEYENDA", en: "MAP KEY" },
  station: { es: "Estación", en: "Station" },
  hazardZone: { es: "Zona peligrosa", en: "Hazard zone" },
  dangerousTunnel: { es: "Túnel peligroso", en: "Dangerous tunnel" },
  navigation: { es: "ASISTENCIA DE NAVEGACIÓN", en: "NAVIGATION ASSIST" },
  routeTitle: { es: "Trazar un paso seguro", en: "Plot a safe passage" },
  from: { es: "ORIGEN", en: "FROM" },
  to: { es: "DESTINO", en: "TO" },
  selectStation: { es: "Seleccionar estación", en: "Select station" },
  findRoute: { es: "CALCULAR RUTA", en: "FIND ROUTE" },
  routeFound: { es: "RUTA ENCONTRADA", en: "ROUTE FOUND" },
  stations: { es: "ESTACIONES", en: "STATIONS" },
  lines: { es: "LÍNEAS", en: "LINES" },
  fieldRecord: { es: "REGISTRO DE CAMPO // 07", en: "FIELD RECORD // 07" },
  status: { es: "ESTADO", en: "STATUS" },
  population: { es: "POBLACIÓN", en: "POPULATION" },
  connectedStations: { es: "ESTACIONES CONECTADAS", en: "CONNECTED STATIONS" },
  setOrigin: { es: "FIJAR COMO ORIGEN →", en: "SET AS ROUTE ORIGIN →" },
  hazardReport: { es: "INFORME DE PELIGRO", en: "HAZARD REPORT" },
  clearRoute: { es: "LIMPIAR RUTA ×", en: "CLEAR ROUTE ×" },
};

export function localizedText(text: LocalizedText | undefined, language: SupportedLanguage): string {
  return text?.[language] ?? text?.es ?? "";
}
