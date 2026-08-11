import type { MetroLine } from "@/types/metro";

const text = (es: string, en: string) => ({ es, en });

export const lines: MetroLine[] = [
  { id: "sokolnicheskaya", name: text("Sokolnicheskaya", "Sokolnicheskaya"), color: "#d45252", path: "M 470 650 C 480 560 505 470 545 395 C 585 320 620 250 620 175 C 620 125 600 90 575 58" },
  { id: "zamoskvoretskaya", name: text("Zamoskvoretskaya", "Zamoskvoretskaya"), color: "#62a879", path: "M 140 200 C 250 210 365 245 465 300 C 550 345 640 375 755 405 C 815 420 860 440 910 465" },
  { id: "arbatsko-pokrovskaya", name: text("Arbatsko-Pokrovskaya", "Arbatsko-Pokrovskaya"), color: "#5d91c7", path: "M 150 120 C 270 180 390 250 510 330 C 590 385 675 420 780 480" },
  { id: "koltsevaya", name: text("Kol'tsevaya", "Circle Line"), color: "#8a706b", path: "M 350 285 C 405 205 505 165 610 170 C 730 175 820 225 850 330 C 880 440 820 530 715 565 C 595 600 465 570 390 490 C 330 425 315 350 350 285" },
  { id: "tagansko-krasnopresnenskaya", name: text("Tagansko-Krasnopresnenskaya", "Tagansko-Krasnopresnenskaya"), color: "#9a6b9a", path: "M 95 450 C 220 425 335 400 450 385 C 555 370 665 430 770 505 C 845 555 940 600 1050 625" },
  { id: "kaluzhsko-rizhskaya", name: text("Kaluzhsko-Rizhskaya", "Kaluzhsko-Rizhskaya"), color: "#d49745", path: "M 575 58 C 660 105 715 175 720 255 C 725 340 690 420 665 500 C 640 575 640 660 700 720" },
];
