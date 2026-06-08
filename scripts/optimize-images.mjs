#!/usr/bin/env node

import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

import {
  defaultOutputDir,
  images as configuredImages,
  profiles,
  scanDefaultProfile,
  scanDirs,
  sourcesRoot,
} from "./optimize-images.config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const scan = args.has("--scan");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function slugify(name) {
  return name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fileSize(filePath) {
  const info = await stat(filePath);
  return info.size;
}

async function isUpToDate(sourcePath, outputPath) {
  if (force) return false;

  try {
    const [sourceStat, outputStat] = await Promise.all([
      stat(sourcePath),
      stat(outputPath),
    ]);
    return outputStat.mtimeMs >= sourceStat.mtimeMs;
  } catch {
    return false;
  }
}

async function optimizeOne(entry) {
  const sourcePath = path.resolve(ROOT, entry.src);
  const outDir = path.resolve(ROOT, entry.outDir ?? defaultOutputDir);
  const outName = entry.out ?? `${slugify(path.basename(entry.src))}.jpg`;
  const outputPath = path.join(outDir, outName);
  const profile = profiles[entry.profile ?? scanDefaultProfile];

  if (!profile) {
    throw new Error(`Perfil desconhecido: ${entry.profile}`);
  }

  try {
    await stat(sourcePath);
  } catch {
    console.warn(`  ⊘ origem não encontrada: ${entry.src}`);
    return null;
  }

  if (await isUpToDate(sourcePath, outputPath)) {
    const size = await fileSize(outputPath);
    console.log(`  ↷ ${entry.src} → ${path.relative(ROOT, outputPath)} (${formatBytes(size)}, sem alterações)`);
    return {
      src: entry.src,
      out: path.relative(ROOT, outputPath),
      profile: entry.profile ?? scanDefaultProfile,
      skipped: true,
      bytes: size,
    };
  }

  await mkdir(path.dirname(outputPath), { recursive: true });

  const before = await fileSize(sourcePath);
  const meta = await sharp(sourcePath).metadata();

  await sharp(sourcePath)
    .rotate()
    .resize({
      width: profile.maxWidth,
      withoutEnlargement: true,
      fit: "inside",
    })
    .jpeg({
      quality: profile.quality,
      mozjpeg: true,
      chromaSubsampling: "4:4:4",
    })
    .toFile(outputPath);

  const after = await fileSize(outputPath);
  const saved = before - after;
  const pct = before > 0 ? ((saved / before) * 100).toFixed(0) : 0;

  console.log(
    `  ✓ ${entry.src} → ${path.relative(ROOT, outputPath)} (${formatBytes(before)} → ${formatBytes(after)}, -${pct}%, ${meta.width}×${meta.height})`,
  );

  return {
    src: entry.src,
    out: path.relative(ROOT, outputPath),
    profile: entry.profile ?? scanDefaultProfile,
    skipped: false,
    bytesBefore: before,
    bytesAfter: after,
    width: meta.width,
    height: meta.height,
  };
}

async function walkSourceFiles(relDir, files = []) {
  const absDir = path.resolve(ROOT, relDir);

  let entries;
  try {
    entries = await readdir(absDir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const relPath = path.join(relDir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "opt" || entry.name.startsWith(".")) continue;
      await walkSourceFiles(relPath, files);
      continue;
    }

    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    if (entry.name.includes("-hero.") || entry.name.startsWith(".")) continue;

    files.push(relPath);
  }

  return files;
}

async function collectScanEntries(existingSources) {
  const discovered = [];

  for (const dir of scanDirs) {
    const relFiles = await walkSourceFiles(dir);

    for (const relSrc of relFiles) {
      if (existingSources.has(relSrc)) continue;

      const relFromRoot = path.relative(sourcesRoot, relSrc);
      const category = path.dirname(relFromRoot);
      const outName =
        category === "."
          ? `${slugify(path.basename(relSrc))}.jpg`
          : `${category}/${slugify(path.basename(relSrc))}.jpg`;

      discovered.push({
        src: relSrc,
        profile: scanDefaultProfile,
        out: outName,
      });
    }
  }

  return discovered;
}

async function main() {
  console.log("Otimizando imagens…\n");

  const queue = [...configuredImages];
  const configuredSources = new Set(configuredImages.map((item) => item.src));

  if (scan) {
    const extra = await collectScanEntries(configuredSources);
    if (extra.length > 0) {
      console.log(`Modo --scan: ${extra.length} arquivo(s) novo(s)\n`);
      queue.push(...extra);
    }
  }

  const results = [];

  for (const entry of queue) {
    const result = await optimizeOne(entry);
    if (result) results.push(result);
  }

  const manifestPath = path.resolve(ROOT, defaultOutputDir, "manifest.json");
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(
    manifestPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        profiles,
        results,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  const processed = results.filter((item) => !item.skipped);
  const totalBefore = processed.reduce((sum, item) => sum + (item.bytesBefore ?? 0), 0);
  const totalAfter = results.reduce((sum, item) => sum + (item.bytesAfter ?? item.bytes ?? 0), 0);

  console.log("\nResumo");
  console.log(`  Processadas: ${processed.length}`);
  console.log(`  Ignoradas (já atualizadas): ${results.length - processed.length}`);
  if (processed.length > 0) {
    console.log(`  Economia nesta execução: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)}`);
  }
  console.log(`  Manifest: ${path.relative(ROOT, manifestPath)}`);
  console.log("\nUso:");
  console.log("  npm run optimize:images");
  console.log("  npm run optimize:images -- --force");
  console.log("  npm run optimize:images -- --scan");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
