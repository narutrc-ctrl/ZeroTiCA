#!/usr/bin/env node
/**
 * After Vite build, generate hosting artifacts from src/seo/pages.ts:
 * - dist/*.html with per-route title/description/canonical
 * - dist/sitemap.xml from indexable pages
 * - infra/cloudfront/spa-router.js allowlist
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const indexPath = path.join(dist, "index.html");
const pagesEntry = path.join(root, "src/seo/pages.ts");

async function loadPages() {
  const result = await esbuild.build({
    entryPoints: [pagesEntry],
    bundle: true,
    write: false,
    platform: "node",
    format: "esm",
    logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  const tmp = path.join(root, "scripts/.pages.tmp.mjs");
  fs.writeFileSync(tmp, code);
  try {
    return await import(pathToFileURL(tmp).href + `?t=${Date.now()}`);
  } finally {
    fs.unlinkSync(tmp);
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"));
  return match ? match[1] : null;
}

function applySeo(html, page, canonicalUrl) {
  const canonical = canonicalUrl(page.canonicalPath);
  const ogTitle = page.ogTitle ?? page.title;
  const ogDescription = page.ogDescription ?? page.description;
  const twitterTitle = page.twitterTitle ?? page.title;

  let next = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  next = next.replace(/<meta\b[\s\S]*?>/gi, (tag) => {
    const name = attr(tag, "name");
    const property = attr(tag, "property");
    if (name === "description") return `<meta name="description" content="${escapeHtml(page.description)}" />`;
    if (name === "robots") return `<meta name="robots" content="${escapeHtml(page.robots)}" />`;
    if (name === "twitter:title") return `<meta name="twitter:title" content="${escapeHtml(twitterTitle)}" />`;
    if (name === "twitter:description") return `<meta name="twitter:description" content="${escapeHtml(ogDescription)}" />`;
    if (property === "og:title") return `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`;
    if (property === "og:description") return `<meta property="og:description" content="${escapeHtml(ogDescription)}" />`;
    if (property === "og:url") return `<meta property="og:url" content="${escapeHtml(canonical)}" />`;
    return tag;
  });
  next = next.replace(/<link\b[\s\S]*?>/gi, (tag) => {
    const rel = attr(tag, "rel");
    if (rel === "canonical") return `<link rel="canonical" href="${escapeHtml(canonical)}" />`;
    if (rel === "alternate") {
      const lang = attr(tag, "hreflang");
      if (lang === "ko-KR" || lang === "x-default") {
        return `<link rel="alternate" hreflang="${lang}" href="${escapeHtml(canonical)}" />`;
      }
    }
    return tag;
  });
  return next;
}

function writeSpaRouter(spaPaths) {
  const keys = [...spaPaths].sort().map((p) => `    '${p}': true`).join(",\n");
  const source = `// Generated from src/seo/pages.ts — run: node scripts/build-hosting.mjs
// CloudFront Function (viewer-request)
// Known SPA routes -> {path}.html with HTTP 200
// Trailing slash on known routes -> 301 to slashless URL
// Unknown extensionless URLs -> 404 (avoid Soft 404)

function hasFileExtension(uri) {
  var i = uri.lastIndexOf('/');
  var last = i === -1 ? uri : uri.substring(i + 1);
  return last.indexOf('.') !== -1;
}

function toQueryString(qs) {
  var parts = [];
  for (var key in qs) {
    if (!Object.prototype.hasOwnProperty.call(qs, key)) continue;
    var item = qs[key];
    if (item.multiValue) {
      for (var i = 0; i < item.multiValue.length; i++) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(item.multiValue[i].value));
      }
    } else if (item.value) {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(item.value));
    } else {
      parts.push(encodeURIComponent(key));
    }
  }
  return parts.length ? '?' + parts.join('&') : '';
}

function redirect301(request, path) {
  var host = request.headers.host.value;
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: 'https://' + host + path + toQueryString(request.querystring) }
    }
  };
}

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var SPA = {
${keys}
  };

  if (uri === '/') {
    return request;
  }

  if (hasFileExtension(uri)) {
    if (uri.length > 5 && uri.substring(uri.length - 5) === '.html') {
      var pretty = uri.substring(0, uri.length - 5);
      if (SPA[pretty]) {
        return redirect301(request, pretty);
      }
    }
    return request;
  }

  var hadSlash = uri.length > 1 && uri.charAt(uri.length - 1) === '/';
  var normalized = hadSlash ? uri.substring(0, uri.length - 1) : uri;

  if (SPA[normalized]) {
    if (hadSlash) {
      return redirect301(request, normalized);
    }
    request.uri = normalized + '.html';
    return request;
  }

  return {
    statusCode: 404,
    statusDescription: 'Not Found',
    headers: {
      'content-type': { value: 'text/html; charset=utf-8' },
      'cache-control': { value: 'no-store' },
      'x-robots-tag': { value: 'noindex' }
    },
    body: '<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>404 | ZeroTiCA</title><meta name="robots" content="noindex"></head><body><h1>페이지를 찾을 수 없습니다</h1><p><a href="/">홈으로</a></p></body></html>'
  };
}
`;
  const out = path.join(root, "infra/cloudfront/spa-router.js");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, source);
  return out;
}

function writeSitemap(indexablePages, canonicalUrl) {
  const urls = indexablePages
    .map((page) => `  <url>\n    <loc>${canonicalUrl(page.canonicalPath)}</loc>\n  </url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  const out = path.join(dist, "sitemap.xml");
  fs.writeFileSync(out, xml);
  return out;
}

const pages = await loadPages();
if (!fs.existsSync(indexPath)) {
  console.error("dist/index.html missing — run vite build first");
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, "utf8");
fs.writeFileSync(indexPath, applySeo(indexHtml, pages.HOME, pages.canonicalUrl));

let htmlCount = 0;
for (const page of pages.PAGES) {
  if (page.path === "/") continue;
  const html = applySeo(indexHtml, page, pages.canonicalUrl);
  const outFile = path.join(dist, `${page.path.slice(1)}.html`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  htmlCount += 1;
}

const routerOut = writeSpaRouter(pages.SPA_PATHS);
writeSitemap(pages.INDEXABLE_PAGES, pages.canonicalUrl);

console.log(
  `Hosting artifacts: ${htmlCount} HTML files, sitemap.xml (${pages.INDEXABLE_PAGES.length} URLs), ${path.relative(root, routerOut)}`,
);
