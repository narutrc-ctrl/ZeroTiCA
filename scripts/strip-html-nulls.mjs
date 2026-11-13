#!/usr/bin/env node
/**
 * Astro + @astrojs/react SSR HTML can insert NUL bytes inside Korean text.
 * Strip NUL from all HTML files under dist after build.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (ent.name.endsWith(".html")) out.push(full);
  }
  return out;
}

let files = 0;
let cleaned = 0;
for (const file of walk(dist)) {
  files += 1;
  const buf = fs.readFileSync(file);
  if (!buf.includes(0)) continue;
  const next = Buffer.from(buf.filter((b) => b !== 0));
  fs.writeFileSync(file, next);
  cleaned += 1;
  console.log(`stripped NUL: ${path.relative(dist, file)} (${buf.length - next.length} bytes)`);
}

console.log(`strip-html-nulls: cleaned ${cleaned}/${files} html files`);
