import type { Faction } from "@/types/metro";

const text = (es: string, en: string) => ({ es, en });

export const factions: Faction[] = [
  { id: "hanza", name: text("Hanza", "Hanza"), color: "#d19a45", description: text("Comunidad mercantil y guardiana del anillo.", "The ring's merchants and self-appointed guardians.") },
  { id: "red-line", name: text("Línea Roja", "Red Line"), color: "#d45252", description: text("Un estado disciplinado construido sobre la vieja ideología.", "A disciplined state built around the old ideology.") },
  { id: "polis", name: text("Polis", "Polis"), color: "#78a7a0", description: text("Archivistas y estudiosos que protegen las estaciones centrales.", "Archivists and scholars holding the central stations.") },
  { id: "rangers", name: text("Rangers", "Rangers"), color: "#9caaa5", description: text("Exploradores independientes de los túneles profundos.", "Independent scouts of the deep tunnels.") },
  { id: "fourth-reich", name: text("Cuarto Reich", "Fourth Reich"), color: "#8c6b87", description: text("Un enclave hostil en los túneles del norte.", "A hostile enclave in the northern tunnels.") },
  { id: "independent", name: text("Independientes", "Independent"), color: "#9aa0a8", description: text("Estaciones que no responden a una sola autoridad.", "Stations that answer to no single power.") },
];
