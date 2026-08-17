import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const imageRoot = path.resolve("public/images");

async function findImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const filePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findImages(filePath);
      return /\.(jpe?g|png)$/i.test(entry.name) ? [filePath] : [];
    }),
  );
  return nested.flat();
}

const images = await findImages(imageRoot);

for (const inputPath of images) {
  const relativePath = path.relative(imageRoot, inputPath);
  const outputPath = inputPath.replace(/\.(jpe?g|png)$/i, ".webp");
  const isLogo = relativePath.includes(`branding${path.sep}`);
  const isBanner = relativePath.includes(`banners${path.sep}`);
  const maxWidth = isLogo ? 512 : isBanner ? 1920 : 900;
  const quality = isLogo ? 88 : isBanner ? 82 : 80;

  await sharp(inputPath)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(outputPath);

  process.stdout.write(`Optimized ${relativePath}\n`);
}
