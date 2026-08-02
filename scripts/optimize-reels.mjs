#!/usr/bin/env node

import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import ffmpegStatic from "ffmpeg-static";

import {
  coversDir,
  encode,
  outputDir,
  posterEncode,
  postersDir,
  reels,
  sourcesDir,
} from "./optimize-reels.config.mjs";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const force = process.argv.includes("--force");

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function fileSize(filePath) {
  const info = await stat(filePath);
  return info.size;
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
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

async function posterFromCover(coverPath, posterPath) {
  try {
    await sharp(coverPath)
      .rotate()
      .resize({
        width: posterEncode.maxWidth,
        withoutEnlargement: true,
      })
      .webp({ quality: posterEncode.quality, effort: 5, smartSubsample: true })
      .toFile(posterPath);
  } catch (error) {
    throw new Error(`${coverPath}: ${error.message}`);
  }
}


function runFfmpeg(args) {
  const result = spawnSync(ffmpegStatic, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`ffmpeg falhou: ${args.join(" ")}`);
  }
}

function probeInput(filePath) {
  const result = spawnSync(
    ffmpegStatic,
    ["-v", "error", "-i", filePath, "-f", "null", "-"],
    { stdio: "pipe" },
  );
  return result.status === 0;
}

async function resolveEncodeInput(primary, fallback) {
  if (probeInput(primary)) return primary;
  if (fallback && (await exists(fallback)) && probeInput(fallback)) {
    console.warn(`  ⚠ origem inválida — recompactando ${path.relative(ROOT, fallback)}`);
    return fallback;
  }
  throw new Error(`origem inválida: ${path.relative(ROOT, primary)}`);
}

async function main() {
  if (!ffmpegStatic) {
    throw new Error("ffmpeg-static não disponível.");
  }

  await mkdir(path.resolve(ROOT, outputDir), { recursive: true });
  await mkdir(path.resolve(ROOT, postersDir), { recursive: true });

  for (const reel of reels) {
    const input = path.resolve(ROOT, sourcesDir, reel.source);
    const output = path.resolve(ROOT, outputDir, reel.out);
    const poster = path.resolve(ROOT, postersDir, reel.poster);

    try {
      await stat(input);
    } catch {
      console.error(`Arquivo não encontrado: ${path.relative(ROOT, input)}`);
      process.exit(1);
    }

    const hasVideo = !force && (await exists(output));
    const hasPoster = !force && (await exists(poster));

    if (!hasVideo) {
      const encodeInput = await resolveEncodeInput(input, output);
      const before = await fileSize(encodeInput);
      console.log(`\n▶ ${reel.title} — encode (${formatBytes(before)})`);

      try {
        runFfmpeg([
          "-y",
          "-i",
          encodeInput,
          "-c:v",
          "libx264",
          "-preset",
          encode.preset,
          "-crf",
          String(encode.crf),
          "-maxrate",
          encode.maxRate,
          "-bufsize",
          encode.bufsize,
          "-pix_fmt",
          "yuv420p",
          "-movflags",
          "+faststart",
          "-vf",
          `scale='min(${encode.maxWidth},iw)':-2`,
          "-c:a",
          "aac",
          "-b:a",
          encode.audioBitrate,
          output,
        ]);

        const after = await fileSize(output);
        console.log(
          `  ✓ ${path.relative(ROOT, output)} (${formatBytes(before)} → ${formatBytes(after)})`,
        );
      } catch (error) {
        if (await exists(output)) {
          console.warn(`  ⚠ encode falhou — mantendo ${path.relative(ROOT, output)} existente`);
        } else {
          throw error;
        }
      }
    } else {
      console.log(`\n⊘ ${reel.title} — vídeo já existe (use --force para reprocessar)`);
    }

    if (reel.cover) {
      const coverInput = path.resolve(ROOT, coversDir, reel.cover);

      try {
        await stat(coverInput);
      } catch {
        console.error(`Capa não encontrada: ${path.relative(ROOT, coverInput)}`);
        process.exit(1);
      }

      if (await isUpToDate(coverInput, poster)) {
        console.log(`  ⊘ poster ${path.relative(ROOT, poster)} (capa já processada)`);
      } else {
        try {
          const before = await fileSize(coverInput);
          await posterFromCover(coverInput, poster);
          const after = await fileSize(poster);
          console.log(
            `  ✓ poster ${path.relative(ROOT, poster)} (${formatBytes(before)} → ${formatBytes(after)})`,
          );
        } catch (error) {
          console.warn(`  ⚠ poster via capa falhou (${error.message}) — extraindo frame do vídeo`);
          runFfmpeg([
            "-y",
            "-ss",
            "00:00:00.800",
            "-i",
            output,
            "-vframes",
            "1",
            "-q:v",
            "2",
            poster,
          ]);
          console.log(`  ✓ poster ${path.relative(ROOT, poster)} (frame do vídeo)`);
        }
      }
    } else if (!hasPoster) {
      runFfmpeg([
        "-y",
        "-ss",
        "00:00:00.800",
        "-i",
        output,
        "-vframes",
        "1",
        "-q:v",
        "2",
        poster,
      ]);
      console.log(`  ✓ poster ${path.relative(ROOT, poster)}`);
    }
  }

  console.log("\nConcluído.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
