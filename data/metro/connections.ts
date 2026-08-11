import type { Connection } from "@/types/metro";

const link = (from: string, to: string, lineId: string, options: Omit<Connection, "id" | "from" | "to" | "lineId"> = {}): Connection => ({ id: `${from}-${to}`, from, to, lineId, ...options });

export const connections: Connection[] = [
  link("river-port", "kurskaya", "red"), link("kurskaya", "chkalovskaya", "red"), link("chkalovskaya", "sukharevskaya", "red", { dangerous: true, type: "tunnel" }), link("sukharevskaya", "polis", "red"), link("polis", "rechnoy", "red", { dangerous: true }),
  link("kievskaya", "taganskaya", "ring"), link("taganskaya", "prospekt-mira", "ring"), link("prospekt-mira", "polis", "ring"), link("polis", "bauman", "ring"), link("bauman", "partizanskaya", "ring", { dangerous: true }), link("partizanskaya", "vdnh", "ring"), link("vdnh", "kievskaya", "ring"),
  link("kievskaya", "kurskaya", "green"), link("kurskaya", "theatre", "green"), link("theatre", "vdnh", "green", { dangerous: true, type: "tunnel" }), link("vdnh", "botanichesky", "green", { dangerous: true, type: "surface" }),
  link("tverskaya", "smolenskaya", "blue", { type: "bridge" }), link("smolenskaya", "kurskaya", "blue"), link("kurskaya", "park-kultury", "blue"), link("park-kultury", "d6", "blue", { dangerous: true, type: "tunnel" }), link("d6", "vdnh", "blue"),
];
