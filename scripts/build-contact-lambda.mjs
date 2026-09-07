#!/usr/bin/env node
/**
 * Package the contact inquiry Lambda for upload (zip contents under dist-lambda/contact/).
 * Does not create AWS resources or upload.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist-lambda", "contact");
const handlerSrc = path.join(root, "lambda", "contact", "handler.mjs");
const ssmSrc = path.join(root, "lambda", "contact", "ssmMailConfig.mjs");
const sendMailSrc = path.join(root, "api", "_lib", "sendMail.js");
const rootPkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const awsSsmVersion = rootPkg.dependencies["@aws-sdk/client-ssm"];
if (!awsSsmVersion) {
  console.error("package.json missing dependency @aws-sdk/client-ssm");
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, "_lib"), { recursive: true });

let handlerCode = fs.readFileSync(handlerSrc, "utf8");
handlerCode = handlerCode.replace(
  'from "../../api/_lib/sendMail.js"',
  'from "./_lib/sendMail.js"',
);
fs.writeFileSync(path.join(outDir, "handler.mjs"), handlerCode);
fs.copyFileSync(ssmSrc, path.join(outDir, "ssmMailConfig.mjs"));
fs.copyFileSync(sendMailSrc, path.join(outDir, "_lib", "sendMail.js"));

const packagedPkg = {
  name: "zerotica-contact-lambda",
  private: true,
  version: rootPkg.version || "1.0.0",
  type: "module",
  dependencies: {
    nodemailer: rootPkg.dependencies.nodemailer,
    "@aws-sdk/client-ssm": awsSsmVersion,
  },
};
fs.writeFileSync(path.join(outDir, "package.json"), `${JSON.stringify(packagedPkg, null, 2)}\n`);

const install = spawnSync("npm", ["install", "--omit=dev", "--no-fund", "--no-audit"], {
  cwd: outDir,
  encoding: "utf8",
  stdio: "inherit",
});
if (install.status !== 0) {
  console.error("npm install failed in dist-lambda/contact");
  process.exit(install.status ?? 1);
}

const required = [
  "handler.mjs",
  "ssmMailConfig.mjs",
  "_lib/sendMail.js",
  "package.json",
  "node_modules/nodemailer/package.json",
  "node_modules/@aws-sdk/client-ssm/package.json",
];
for (const rel of required) {
  const full = path.join(outDir, rel);
  if (!fs.existsSync(full)) {
    console.error(`missing packaged file: ${rel}`);
    process.exit(1);
  }
}

console.log(`Contact Lambda package ready: ${path.relative(root, outDir)}`);
console.log("Handler: handler.handler (file handler.mjs)");
console.log("SMTP config: SSM Parameter Store (see ssmMailConfig.mjs)");
