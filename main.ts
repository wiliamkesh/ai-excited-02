import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const MAX_BYTES = 1024 * 1024;

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) {
    return resolve(fromEnv);
  }
  return resolve(process.cwd(), "output");
}

function main(): void {
  const source = resolve(process.cwd(), "entry.png");

  if (!existsSync(source)) {
    throw new Error(`Missing input file: ${source}`);
  }

  const outputDir = resolveOutputDir();
  mkdirSync(outputDir, { recursive: true });

  const destination = join(outputDir, "entry.png");
  copyFileSync(source, destination);

  const copiedSize = statSync(destination).size;
  if (copiedSize > MAX_BYTES) {
    throw new Error(
      `Copied entry.png is ${copiedSize} bytes, over the 1 MiB limit (${MAX_BYTES} bytes).`
    );
  }

  console.log(`Wrote ${destination} (${copiedSize} bytes)`);
}

main();
