import sharp from "sharp";
import { writeFile, access } from "node:fs/promises";
import path from "node:path";

async function buildSquareLogo({ src, out, canvas, innerPct = 0.86 }) {
  try {
    await access(src);
  } catch {
    console.log(`Skipping ${src} (not found).`);
    return;
  }

  const trimmed = await sharp(src)
    .trim({ background: { r: 240, g: 234, b: 220 }, threshold: 12 })
    .toBuffer();

  const trimmedMeta = await sharp(trimmed).metadata();
  const innerSize = Math.round(canvas * innerPct);

  const resized = await sharp(trimmed)
    .resize({
      width: trimmedMeta.width >= trimmedMeta.height ? innerSize : undefined,
      height: trimmedMeta.height > trimmedMeta.width ? innerSize : undefined,
      fit: "contain",
      kernel: "lanczos3",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  const resizedMeta = await sharp(resized).metadata();
  const padX = Math.max(0, Math.floor((canvas - resizedMeta.width) / 2));
  const padY = Math.max(0, Math.floor((canvas - resizedMeta.height) / 2));

  const final = await sharp(resized)
    .extend({
      top: padY,
      bottom: canvas - resizedMeta.height - padY,
      left: padX,
      right: canvas - resizedMeta.width - padX,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  await writeFile(out, final);
  console.log(`Wrote ${out} (${canvas}x${canvas}, trimmed from ${trimmedMeta.width}x${trimmedMeta.height}, ${final.length} bytes)`);
}

await buildSquareLogo({
  src: path.resolve("shield logo.png"),
  out: path.resolve("public/logo.png"),
  canvas: 1024,
  innerPct: 0.86
});

await buildSquareLogo({
  src: path.resolve("logo.favicon.png"),
  out: path.resolve("public/favicon.png"),
  canvas: 256,
  innerPct: 0.94
});
