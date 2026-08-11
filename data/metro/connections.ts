import type { Connection } from "@/types/metro";

const sequences: Record<string, string[]> = {
  sokolnicheskaya: ["sokolniki", "krasnoselskaya", "komsomolskaya", "krasnye-vorota", "chistye-prudy", "lubyanka", "okhotny-ryad", "biblioteka", "kropotkinskaya", "park-kultury"],
  zamoskvoretskaya: ["belorusskaya", "dinamo", "mayakovskaya", "tverskaya", "teatralnaya", "novokuznetskaya", "paveletskaya", "avtozavodskaya"],
  "arbatsko-pokrovskaya": ["kievskaya", "smolenskaya", "arbatskaya", "ploshchad-revolyutsii", "kurskaya", "baumanskaya", "elektrozavodskaya"],
  koltsevaya: ["park-kultury", "krasnopresnenskaya", "belorusskaya", "novoslobodskaya", "prospekt-mira", "komsomolskaya", "kurskaya", "taganskaya", "paveletskaya", "dobryninskaya", "oktyabrskaya"],
  "tagansko-krasnopresnenskaya": ["barrikadnaya", "pushkinskaya", "kuznetsky-most", "kitay-gorod", "taganskaya", "proletarskaya", "volgogradsky"],
  "kaluzhsko-rizhskaya": ["vdnh", "alekseevskaya", "rizhskaya", "prospekt-mira", "sukharevskaya", "turgenevskaya", "kitay-gorod", "tretyakovskaya", "oktyabrskaya", "novye-cheryomushki", "kaluzhskaya"],
};

const connection = (from: string, to: string, lineId: string, index: number): Connection => ({ id: `${lineId}-${index}`, from, to, lineId, type: "metro", dangerous: lineId === "tagansko-krasnopresnenskaya" && index === 5 });

export const connections: Connection[] = Object.entries(sequences).flatMap(([lineId, stationIds]) => {
  const sequentialConnections = stationIds.slice(0, -1).map((stationId, index) => connection(stationId, stationIds[index + 1], lineId, index));
  return lineId === "koltsevaya" ? [...sequentialConnections, connection(stationIds[stationIds.length - 1], stationIds[0], lineId, stationIds.length - 1)] : sequentialConnections;
});

export const lineStationSequences = sequences;
