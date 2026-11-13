#!/usr/bin/env node
/** Wrapper — Node 22 strip-types로 sync-hosting.ts 실행 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(root, "scripts/sync-hosting.ts");
const result = spawnSync(
  process.execPath,
  ["--experimental-strip-types", "--no-warnings", script],
  { stdio: "inherit", cwd: root },
);
process.exit(result.status ?? 1);
