#!/usr/bin/env node

import { mkdir, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import ffmpegStatic from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const INPUT = path.resolve(ROOT, "public/videos/clinic-hero-loop.mp4");
const OUTPUT = path.resolve(ROOT, "public/videos/clinic-hero-loop.web.mp4");
const BACKUP = path.resolve(ROOT, "public/videos/clinic-hero-loop.source.mp4");

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function fileSize(filePath) {
  const info = await stat(filePath);
  return info.size;
}

async function main() {
  if (!ffmpegStatic) {
    throw new Error("ffmpeg-static não disponível.");
  }

  try {
    await stat(INPUT);
  } catch {
    console.error(`Arquivo não encontrado: ${INPUT}`);
    process.exit(1);
  }

  await mkdir(path.dirname(OUTPUT), { recursive: true });

  const before = await fileSize(INPUT);
  console.log(`Otimizando vídeo da hero (${formatBytes(before)})…`);

  const args = [
    "-y",
    "-i",
    INPUT,
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "27",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-vf",
    "scale='min(1280,iw)':-2",
    OUTPUT,
  ];

  const result = spawnSync(ffmpegStatic, args, { stdio: "inherit" });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  const after = await fileSize(OUTPUT);
  const saved = before - after;
  const pct = before > 0 ? ((saved / before) * 100).toFixed(0) : 0;

  console.log(`\n✓ ${path.relative(ROOT, OUTPUT)} (${formatBytes(before)} → ${formatBytes(after)}, -${pct}%)`);

  try {
    await stat(BACKUP);
  } catch {
    await rename(INPUT, BACKUP);
    await rename(OUTPUT, INPUT);
    console.log(`Original arquivado em ${path.relative(ROOT, BACKUP)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
