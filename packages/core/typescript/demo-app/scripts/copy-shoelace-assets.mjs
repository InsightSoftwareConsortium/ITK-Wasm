import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the package root regardless of pnpm/npm layout
// Use import.meta.resolve on a known exported subpath, then walk up to find package.json
const shoelaceEntryUrl = await import.meta.resolve("@shoelace-style/shoelace/dist/shoelace.js");
const shoelaceEntryPath = fileURLToPath(shoelaceEntryUrl);
// shoelaceEntryPath is .../shoelace/dist/shoelace.js — go up until we find package.json
let pkgRoot = path.dirname(shoelaceEntryPath);
while (pkgRoot !== path.dirname(pkgRoot)) {
  if (fs.existsSync(path.join(pkgRoot, "package.json"))) break;
  pkgRoot = path.dirname(pkgRoot);
}

// Try common asset locations across Shoelace versions
const candidates = [
  path.join(pkgRoot, "dist", "assets"),
  path.join(pkgRoot, "cdn", "assets"),
  path.join(pkgRoot, "assets")
];

const src = candidates.find(p => fs.existsSync(p));
if (!src) {
  console.error("Could not find Shoelace assets. Looked in:\n" + candidates.join("\n"));
  process.exit(1);
}

const dest = path.join(process.cwd(), "dist", "assets");
fs.mkdirSync(dest, { recursive: true });

// Node >=16: fs.cpSync exists
fs.cpSync(src, dest, { recursive: true });
console.log(`Copied Shoelace assets from ${src} -> ${dest}`);