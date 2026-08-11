import type { Hazard } from "@/types/metro";

const text = (es: string, en: string) => ({ es, en });

export const hazards: Hazard[] = [
  { id: "red-static", type: "mental", x: 525, y: 215, title: text("Estática roja", "Red static"), description: text("Los operadores reportan voces bajo la señal.", "Radio operators report voices beneath the signal.") },
  { id: "black-mold", type: "biohazard", x: 785, y: 385, title: text("Moho negro", "Black mold"), description: text("Sella la máscara antes de entrar al corredor.", "Seal masks before entering this corridor.") },
  { id: "surface-breach", type: "radiation", x: 915, y: 300, title: text("Brecha de superficie", "Surface breach"), description: text("La radiación aumenta después de cada tormenta.", "Radiation rises after every storm.") },
  { id: "nest", type: "mutants", x: 960, y: 585, title: text("Actividad de nido", "Nest activity"), description: text("No viajes solo más allá de la última lámpara.", "Do not travel alone beyond the last lamp.") },
  { id: "collapse", type: "collapse", x: 560, y: 620, title: text("Túnel inestable", "Unstable tunnel"), description: text("El acceso sur se ha desplazado otra vez.", "The southern access has shifted again.") },
  { id: "choir", type: "cult", x: 290, y: 510, title: text("El Coro", "The Choir"), description: text("Un himno prohibido resuena por los conductos.", "A forbidden hymn echoes through the service shafts.") },
];
