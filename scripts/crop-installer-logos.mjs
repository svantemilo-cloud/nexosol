/**
 * Klipper ut 8 logotyper från public/installers/source.png (4x2 grid).
 * Kör: node scripts/crop-installer-logos.mjs
 */
import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "public/installers/source.png");
const OUT_DIR = join(ROOT, "public/installers");

const NAMES = [
  "nordsol",
  "aura-solar",
  "ljuskraft",
  "helio-install",
  "takenergi",
  "nova-panels",
  "green-current",
  "svenska-solceller",
];

const meta = await sharp(SRC).metadata();
const w = meta.width;
const h = meta.height;
const cellW = Math.floor(w / 4);
const cellH = Math.floor(h / 2);

for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 4; col++) {
    const i = row * 4 + col;
    const left = col * cellW;
    const top = row * cellH;
    await sharp(SRC)
      .extract({ left, top, width: cellW, height: cellH })
      .toFile(join(OUT_DIR, `${NAMES[i]}.png`));
    console.log(`Skapade ${NAMES[i]}.png`);
  }
}
console.log("Klart. 8 logotyper sparade i public/installers/");
