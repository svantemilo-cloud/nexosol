/**
 * SVG-path för varje län.
 * viewBox: 0 0 100 300 (bredd 100, höjd 300).
 * Bakgrundsbilden (sweden-lan-map.png) används med samma viewBox.
 */
export const LAN_PATHS: Record<string, string> = {
  Norrbotten: "M 25 0 L 75 0 L 78 22 L 72 35 L 30 32 L 22 18 Z",
  Västerbotten: "M 15 25 L 45 28 L 48 55 L 42 72 L 18 68 L 12 48 Z",
  Jämtland: "M 18 65 L 42 70 L 38 95 L 22 98 L 15 82 Z",
  Västernorrland: "M 42 72 L 72 68 L 78 95 L 72 115 L 45 112 L 40 88 Z",
  Gävleborg: "M 55 108 L 82 102 L 88 128 L 82 145 L 58 142 L 52 122 Z",
  Dalarna: "M 35 115 L 55 112 L 58 138 L 48 152 L 32 148 L 28 128 Z",
  Värmland: "M 12 135 L 38 132 L 42 158 L 35 172 L 15 168 L 10 148 Z",
  Västmanland: "M 42 142 L 62 138 L 65 158 L 58 168 L 45 165 Z",
  Örebro: "M 38 162 L 58 158 L 62 178 L 52 185 L 40 182 Z",
  Uppsala: "M 55 138 L 75 132 L 78 152 L 72 162 L 58 158 Z",
  Stockholm: "M 58 152 L 78 148 L 82 168 L 75 178 L 62 175 Z",
  Södermanland: "M 55 168 L 75 165 L 78 182 L 68 192 L 55 188 Z",
  Östergötland: "M 58 178 L 82 172 L 88 192 L 78 205 L 62 198 Z",
  Jönköping: "M 35 182 L 58 178 L 62 198 L 48 208 L 38 198 Z",
  Kronoberg: "M 32 195 L 52 192 L 48 212 L 35 218 L 28 205 Z",
  Kalmar: "M 55 192 L 82 188 L 88 218 L 72 228 L 58 218 Z",
  Gotland: "M 82 165 L 95 162 L 98 182 L 92 195 L 82 192 Z",
  Blekinge: "M 52 212 L 72 208 L 75 228 L 62 238 L 52 232 Z",
  Skåne: "M 28 218 L 58 212 L 62 238 L 45 258 L 32 248 L 25 232 Z",
  Halland: "M 8 195 L 35 192 L 38 218 L 28 228 L 12 222 Z",
  "Västra Götaland": "M 10 165 L 42 162 L 48 198 L 38 218 L 18 228 L 5 212 L 5 178 Z",
};

export const LAN_CENTERS: Record<string, [number, number]> = {
  Norrbotten: [50, 15],
  Västerbotten: [30, 50],
  Jämtland: [30, 82],
  Västernorrland: [58, 88],
  Gävleborg: [70, 122],
  Dalarna: [45, 132],
  Värmland: [25, 152],
  Västmanland: [52, 152],
  Örebro: [50, 170],
  Uppsala: [68, 148],
  Stockholm: [70, 162],
  Södermanland: [65, 178],
  Östergötland: [72, 192],
  Jönköping: [48, 192],
  Kronoberg: [40, 205],
  Kalmar: [72, 208],
  Gotland: [88, 178],
  Blekinge: [62, 222],
  Skåne: [42, 232],
  Halland: [22, 208],
  "Västra Götaland": [25, 192],
};
