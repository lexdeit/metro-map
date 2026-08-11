import type { MetroLine } from "@/types/metro";

export const lines: MetroLine[] = [
  { id: "ring", name: "The Ring", color: "#d19a45", path: "M 260 220 C 360 120 560 100 760 170 C 930 230 990 420 900 560 C 780 680 500 690 310 560 C 190 470 160 310 260 220" },
  { id: "red", name: "Red Line", color: "#d45252", path: "M 110 550 C 270 500 350 430 440 350 C 530 265 620 205 735 170 C 830 140 920 125 1060 105" },
  { id: "green", name: "Emerald Line", color: "#62a879", path: "M 260 220 C 310 300 350 375 440 350 C 560 315 620 390 690 475 C 750 550 850 575 1020 535" },
  { id: "blue", name: "Blue Line", color: "#5d91c7", path: "M 205 155 C 350 210 430 275 440 350 C 455 455 525 535 625 575 C 745 625 835 610 900 560" },
];
