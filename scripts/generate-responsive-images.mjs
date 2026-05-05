/**
 * Builds AVIF + WebP next to PNGs under public/.
 * Run: npm run images:responsive
 */

import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

/** Resize to fit width ≤ target; never upscale. Output descriptor = actual pixel width (w descriptor). */
async function writeResponsiveVariants(relPng, targetWidths, capInfinity = Infinity) {
  const absIn = path.join(publicDir, relPng);
  const stem = path.join(publicDir, relPng.replace(/\.png$/i, ""));
  const meta = await sharp(absIn).metadata();
  const iw = meta.width ?? 1;
  const cap = Math.min(iw, capInfinity);

  const seenOutW = new Set();
  for (const tw of targetWidths) {
    const outW = Math.min(Math.max(1, tw), cap);
    if (seenOutW.has(outW)) continue;
    seenOutW.add(outW);

    const base = `${stem}-${outW}`;
    const resized = sharp(absIn).resize({
      width: outW,
      withoutEnlargement: true,
      fit: "inside",
    });
    await resized
      .clone()
      .avif({ quality: 65, effort: 4 })
      .toFile(`${base}.avif`);
    await resized.clone().webp({ quality: 82 }).toFile(`${base}.webp`);
    console.warn(`✓ ${relPng} → ${outW}px (avif + webp)`);
  }
}

async function encodeOnly(relPng) {
  const absIn = path.join(publicDir, relPng);
  const stem = path.join(publicDir, relPng.replace(/\.png$/i, ""));
  const pipeline = sharp(absIn);
  await pipeline.clone().avif({ quality: 65, effort: 4 }).toFile(`${stem}.avif`);
  await pipeline.clone().webp({ quality: 82 }).toFile(`${stem}.webp`);
  console.warn(`✓ ${relPng} → .avif + .webp`);
}

async function main() {
  await writeResponsiveVariants("hero-solar.png", [640, 828, 1024], 1024);
  await writeResponsiveVariants("compare-hero.png", [640, 828, 1024], 1024);

  await encodeOnly("sweden-lan-map.png");

  const products = [
    {
      input: "products/solceller.png",
      widths: [480, 640, 828, 1024],
      cap: 1024,
    },
    {
      input: "products/solcellsbatteri.png",
      widths: [480, 640, 828, 1024],
      cap: 1024,
    },
    {
      input: "products/laddbox.png",
      widths: [360, 480, 640, 768],
      cap: 768,
    },
  ];
  for (const p of products) {
    await writeResponsiveVariants(p.input, p.widths, p.cap);
  }

  const installersDir = path.join(publicDir, "installers");
  const installers = await fs.readdir(installersDir);
  for (const f of installers) {
    if (!f.endsWith(".png") || f.startsWith(".")) continue;
    if (f === "source.png") continue;
    await writeResponsiveVariants(`installers/${f}`, [128, 176, 256], 256);
  }

  console.warn("\nDone. Commit new .avif / .webp files with git.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
