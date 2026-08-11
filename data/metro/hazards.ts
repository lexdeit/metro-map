import type { Hazard } from "@/types/metro";

export const hazards: Hazard[] = [
  { id: "red-static", type: "mental", x: 510, y: 220, title: "Red static", description: "Radio operators report voices beneath the signal." },
  { id: "black-mold", type: "biohazard", x: 780, y: 385, title: "Black mold", description: "Seal masks before entering this maintenance corridor." },
  { id: "surface-breach", type: "radiation", x: 960, y: 285, title: "Surface breach", description: "Radiation rises after every storm." },
  { id: "nest", type: "mutants", x: 970, y: 610, title: "Nest activity", description: "Do not travel alone beyond the last lamp." },
  { id: "collapse", type: "collapse", x: 410, y: 610, title: "Unstable tunnel", description: "The southern access has shifted again." },
  { id: "choir", type: "cult", x: 180, y: 360, title: "The Choir", description: "A forbidden hymn echoes through the service shafts." },
];
