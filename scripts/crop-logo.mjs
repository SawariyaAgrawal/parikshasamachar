import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("shield logo.png");
const OUT = path.resolve("public/logo.png");
const CANVAS = 512;

const trimmed = await sharp(SRC)
  .trim({ background: { r: 240, g: 234, b: 220 }, threshold: 12 })
  .toBuffer();

const trimmedMeta = await sharp(trimmed).metadata();
const longest = Math.max(trimmedMeta.width, trimmedMeta.height);
const innerSize = Math.round(CANVAS * 0.86);

const resized = await sharp(trimmed)
  .resize({
    width: trimmedMeta.width >= trimmedMeta.height ? innerSize : undefined,
    height: trimmedMeta.height > trimmedMeta.width ? innerSize : undefined,
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
  .toBuffer();

const resizedMeta = await sharp(resized).metadata();
const padX = Math.max(0, Math.floor((CANVAS - resizedMeta.width) / 2));
const padY = Math.max(0, Math.floor((CANVAS - resizedMeta.height) / 2));

const final = await sharp(resized)
  .extend({
    top: padY,
    bottom: CANVAS - resizedMeta.height - padY,
    left: padX,
    right: CANVAS - resizedMeta.width - padX,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
  .png({ compressionLevel: 9, palette: true })
  .toBuffer();

await writeFile(OUT, final);

const meta = await sharp(final).metadata();
console.log(`Wrote ${OUT} (${meta.width}x${meta.height}, trimmed from ${trimmedMeta.width}x${trimmedMeta.height}, ${final.length} bytes, longest=${longest})`);
