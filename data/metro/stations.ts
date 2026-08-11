import type { Station } from "@/types/metro";

export const stations: Station[] = [
  { id: "river-port", name: "River Port", x: 110, y: 550, lineIds: ["red"], factionId: "independent", status: "active", population: 3200, description: "A flooded terminal where surface traders barter for filtered water.", labelPosition: "bottom" },
  { id: "tverskaya", name: "Tverskaya", x: 205, y: 155, lineIds: ["blue"], factionId: "hanza", status: "active", population: 8700, description: "A crowded checkpoint on the western approach.", labelPosition: "top" },
  { id: "kievskaya", name: "Kievskaya", x: 260, y: 220, lineIds: ["ring", "green"], factionId: "hanza", status: "active", population: 11400, description: "A bright market station protected by old ring patrols.", labelPosition: "left" },
  { id: "smolenskaya", name: "Smolenskaya", x: 310, y: 300, lineIds: ["blue"], factionId: "rangers", status: "abandoned", description: "The last radio signal from a lost caravan was heard here.", labelPosition: "left" },
  { id: "taganskaya", name: "Taganskaya", x: 350, y: 375, lineIds: ["ring"], factionId: "hanza", status: "active", population: 9200, description: "A fortified interchange and the safest eastern crossing.", labelPosition: "left" },
  { id: "kurskaya", name: "Kurskaya", x: 440, y: 350, lineIds: ["red", "green", "blue"], factionId: "red-line", status: "captured", population: 6800, description: "A strategic junction contested by Red Line patrols and smugglers.", labelPosition: "top" },
  { id: "chkalovskaya", name: "Chkalovskaya", x: 530, y: 265, lineIds: ["red"], factionId: "red-line", status: "active", population: 5400, description: "Barracks, ration halls and a heavily watched platform.", labelPosition: "top" },
  { id: "prospekt-mira", name: "Prospekt Mira", x: 560, y: 315, lineIds: ["ring"], factionId: "hanza", status: "active", population: 7600, description: "A narrow ring station known for its mushroom farms.", labelPosition: "bottom" },
  { id: "sukharevskaya", name: "Sukharevskaya", x: 620, y: 205, lineIds: ["red"], factionId: "independent", status: "independent", population: 2100, description: "An independent outpost beneath a collapsed surface district.", labelPosition: "top" },
  { id: "park-kultury", name: "Park Kultury", x: 625, y: 575, lineIds: ["blue"], factionId: "polis", status: "active", population: 4300, description: "A quiet southern station with a surviving archive vault.", labelPosition: "bottom" },
  { id: "polis", name: "Polis", x: 735, y: 170, lineIds: ["ring", "red"], factionId: "polis", status: "active", population: 18800, description: "The last great library and diplomatic heart of the metro.", labelPosition: "top" },
  { id: "theatre", name: "Theatre", x: 690, y: 475, lineIds: ["green"], factionId: "red-line", status: "captured", population: 2900, description: "A silent stage turned into a listening post.", labelPosition: "right" },
  { id: "vdnh", name: "VDNKh", x: 900, y: 560, lineIds: ["ring", "blue"], factionId: "rangers", status: "active", population: 6100, description: "A northern refuge at the edge of the known tunnels.", labelPosition: "right" },
  { id: "botanichesky", name: "Botanichesky Sad", x: 1020, y: 535, lineIds: ["green"], factionId: "independent", status: "abandoned", description: "Overgrown platforms where something still moves in the dark.", labelPosition: "right" },
  { id: "bauman", name: "Baumanskaya", x: 760, y: 170, lineIds: ["ring"], factionId: "hanza", status: "active", population: 3900, description: "A maintenance station with sealed engineering tunnels.", labelPosition: "top" },
  { id: "partizanskaya", name: "Partizanskaya", x: 990, y: 420, lineIds: ["ring"], factionId: "fourth-reich", status: "captured", population: 4700, description: "A tense border platform beyond the ring's patrols.", labelPosition: "right" },
  { id: "rechnoy", name: "Rechnoy Vokzal", x: 1060, y: 105, lineIds: ["red"], factionId: "fourth-reich", status: "active", population: 1900, description: "A remote north-western station with intermittent contact.", labelPosition: "top" },
  { id: "d6", name: "D6 Access", x: 500, y: 650, lineIds: ["blue"], factionId: "rangers", status: "independent", description: "Restricted access to a military bunker beneath the city.", labelPosition: "bottom" },
];
