import type { Station } from "@/types/metro";

const text = (es: string, en: string) => ({ es, en });
const station = (id: string, es: string, en: string, x: number, y: number, lineIds: string[], options: Partial<Station> = {}): Station => ({ id, name: text(es, en), x, y, lineIds, status: "active", labelPosition: "right", ...options });

export const stations: Station[] = [
  station("park-kultury", "Park Kultury", "Park Kultury", 390, 490, ["sokolnicheskaya", "koltsevaya"], { factionId: "polis", population: 4300, labelPosition: "left", description: text("Intercambio histórico del centro y archivo protegido.", "Historic central interchange and protected archive.") }),
  station("kropotkinskaya", "Kropotkinskaya", "Kropotkinskaya", 425, 425, ["sokolnicheskaya"], { labelPosition: "left" }),
  station("biblioteka", "Biblioteka imeni Lenina", "Biblioteka Imeni Lenina", 460, 365, ["sokolnicheskaya"], { factionId: "polis", labelPosition: "left" }),
  station("okhotny-ryad", "Okhotny Ryad", "Okhotny Ryad", 500, 305, ["sokolnicheskaya"], { labelPosition: "left" }),
  station("lubyanka", "Lubyanka", "Lubyanka", 540, 245, ["sokolnicheskaya"], { factionId: "red-line", labelPosition: "left" }),
  station("chistye-prudy", "Chistye Prudy", "Chistye Prudy", 580, 190, ["sokolnicheskaya"], { labelPosition: "left" }),
  station("krasnye-vorota", "Krasnye Vorota", "Krasnye Vorota", 600, 135, ["sokolnicheskaya"], { labelPosition: "left" }),
  station("komsomolskaya", "Komsomolskaya", "Komsomolskaya", 610, 85, ["sokolnicheskaya", "koltsevaya"], { factionId: "hanza", population: 8800, labelPosition: "left" }),
  station("krasnoselskaya", "Krasnoselskaya", "Krasnoselskaya", 595, 48, ["sokolnicheskaya"], { labelPosition: "left" }),
  station("sokolniki", "Sokolniki", "Sokolniki", 575, 20, ["sokolnicheskaya"], { labelPosition: "left" }),

  station("belorusskaya", "Belorusskaya", "Belorusskaya", 305, 220, ["zamoskvoretskaya", "koltsevaya"], { factionId: "hanza", population: 9800, labelPosition: "left" }),
  station("dinamo", "Dinamo", "Dinamo", 220, 205, ["zamoskvoretskaya"], { labelPosition: "left" }),
  station("mayakovskaya", "Mayakovskaya", "Mayakovskaya", 350, 245, ["zamoskvoretskaya"], { labelPosition: "left" }),
  station("tverskaya", "Tverskaya", "Tverskaya", 445, 275, ["zamoskvoretskaya"], { labelPosition: "top" }),
  station("teatralnaya", "Teatralnaya", "Teatralnaya", 520, 330, ["zamoskvoretskaya"], { labelPosition: "right" }),
  station("novokuznetskaya", "Novokuznetskaya", "Novokuznetskaya", 590, 360, ["zamoskvoretskaya"], { labelPosition: "right" }),
  station("paveletskaya", "Paveletskaya", "Paveletskaya", 680, 390, ["zamoskvoretskaya", "koltsevaya"], { factionId: "hanza", labelPosition: "bottom" }),
  station("avtozavodskaya", "Avtozavodskaya", "Avtozavodskaya", 820, 445, ["zamoskvoretskaya"], { labelPosition: "bottom" }),

  station("kievskaya", "Kievskaya", "Kiyevskaya", 170, 325, ["arbatsko-pokrovskaya", "koltsevaya"], { factionId: "hanza", population: 11400, labelPosition: "left" }),
  station("smolenskaya", "Smolenskaya", "Smolenskaya", 250, 285, ["arbatsko-pokrovskaya"], { labelPosition: "left" }),
  station("arbatskaya", "Arbatskaya", "Arbatskaya", 375, 300, ["arbatsko-pokrovskaya"], { factionId: "polis", labelPosition: "top" }),
  station("ploshchad-revolyutsii", "Ploshchad Revolyutsii", "Ploshchad Revolyutsii", 490, 350, ["arbatsko-pokrovskaya"], { labelPosition: "top" }),
  station("kurskaya", "Kurskaya", "Kurskaya", 660, 270, ["arbatsko-pokrovskaya", "koltsevaya"], { factionId: "red-line", population: 6800, labelPosition: "top", description: text("Cruce estratégico disputado por patrullas y comerciantes.", "A strategic junction contested by patrols and traders.") }),
  station("baumanskaya", "Baumanskaya", "Baumanskaya", 740, 225, ["arbatsko-pokrovskaya"], { labelPosition: "top" }),
  station("elektrozavodskaya", "Elektrozavodskaya", "Elektrozavodskaya", 815, 175, ["arbatsko-pokrovskaya"], { labelPosition: "top" }),

  station("krasnopresnenskaya", "Krasnopresnenskaya", "Krasnopresnenskaya", 285, 405, ["koltsevaya"], { factionId: "hanza", labelPosition: "left" }),
  station("novoslobodskaya", "Novoslobodskaya", "Novoslobodskaya", 420, 170, ["koltsevaya"], { labelPosition: "top" }),
  station("prospekt-mira", "Prospekt Mira", "Prospekt Mira", 510, 135, ["koltsevaya", "kaluzhsko-rizhskaya"], { factionId: "hanza", labelPosition: "right" }),
  station("taganskaya", "Taganskaya", "Taganskaya", 760, 430, ["koltsevaya", "tagansko-krasnopresnenskaya"], { factionId: "hanza", labelPosition: "bottom" }),
  station("dobryninskaya", "Dobryninskaya", "Dobryninskaya", 600, 560, ["koltsevaya"], { labelPosition: "bottom" }),
  station("oktyabrskaya", "Oktyabrskaya", "Oktyabrskaya", 500, 550, ["koltsevaya", "kaluzhsko-rizhskaya"], { labelPosition: "bottom" }),

  station("barrikadnaya", "Barrikadnaya", "Barrikadnaya", 210, 450, ["tagansko-krasnopresnenskaya"], { labelPosition: "left" }),
  station("pushkinskaya", "Pushkinskaya", "Pushkinskaya", 360, 380, ["tagansko-krasnopresnenskaya"], { labelPosition: "left" }),
  station("kuznetsky-most", "Kuznetsky Most", "Kuznetsky Most", 525, 385, ["tagansko-krasnopresnenskaya"], { labelPosition: "right" }),
  station("kitay-gorod", "Kitay-gorod", "Kitay-gorod", 650, 420, ["tagansko-krasnopresnenskaya", "kaluzhsko-rizhskaya"], { labelPosition: "right" }),
  station("proletarskaya", "Proletarskaya", "Proletarskaya", 850, 525, ["tagansko-krasnopresnenskaya"], { labelPosition: "right" }),
  station("volgogradsky", "Volgogradsky Prospekt", "Volgogradsky Prospekt", 1010, 600, ["tagansko-krasnopresnenskaya"], { labelPosition: "right" }),

  station("vdnh", "VDNKh", "VDNKh", 575, 90, ["kaluzhsko-rizhskaya"], { factionId: "rangers", labelPosition: "right" }),
  station("alekseevskaya", "Alekseevskaya", "Alekseevskaya", 625, 185, ["kaluzhsko-rizhskaya"], { labelPosition: "right" }),
  station("rizhskaya", "Rizhskaya", "Rizhskaya", 680, 270, ["kaluzhsko-rizhskaya"], { labelPosition: "right" }),
  station("sukharevskaya", "Sukharevskaya", "Sukharevskaya", 715, 335, ["kaluzhsko-rizhskaya"], { labelPosition: "right" }),
  station("turgenevskaya", "Turgenevskaya", "Turgenevskaya", 700, 390, ["kaluzhsko-rizhskaya"], { labelPosition: "right" }),
  station("tretyakovskaya", "Tretyakovskaya", "Tretyakovskaya", 650, 485, ["kaluzhsko-rizhskaya"], { factionId: "polis", labelPosition: "right" }),
  station("novye-cheryomushki", "Novye Cheryomushki", "Novye Cheryomushki", 660, 650, ["kaluzhsko-rizhskaya"], { labelPosition: "right" }),
  station("kaluzhskaya", "Kaluzhskaya", "Kaluzhskaya", 690, 700, ["kaluzhsko-rizhskaya"], { labelPosition: "right" }),
];
