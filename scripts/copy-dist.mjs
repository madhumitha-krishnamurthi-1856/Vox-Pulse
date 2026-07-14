import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const src = resolve(".output");
const dest = resolve("dist");

if (!existsSync(src)) {
  console.error("ERROR: .output directory not found. Run vite build first.");
  process.exit(1);
}

if (existsSync(dest)) {
  rmSync(dest, { recursive: true, force: true });
}

cpSync(src, dest, { recursive: true });
console.log("✓ Copied .output → dist");
