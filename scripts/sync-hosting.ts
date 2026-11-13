#!/usr/bin/env node
/**
 * Astro 빌드 후 호스팅 산출물 동기화:
 * - dist/sitemap.xml (indexable)
 * - infra/cloudfront/spa-router.js (allowlist + 호환 리다이렉트)
 *
 * 실행: node --experimental-strip-types --no-warnings scripts/sync-hosting.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  INDEXABLE_PAGES,
  SPA_PATHS,
  COMPAT_REDIRECTS,
  canonicalUrl,
} from "../src/seo/pages.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

function writeSitemap() {
  const urls = INDEXABLE_PAGES.map(
    (page) => `  <url>\n    <loc>${canonicalUrl(page.canonicalPath)}</loc>\n  </url>`,
  ).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  fs.mkdirSync(dist, { recursive: true });
  const out = path.join(dist, "sitemap.xml");
  fs.writeFileSync(out, xml);
  return out;
}

function writeSpaRouter() {
  const keys = [...SPA_PATHS].sort().map((p) => `    '${p}': true`).join(",\n");
  const redirectEntries = Object.keys(COMPAT_REDIRECTS)
    .sort()
    .map((from) => `    '${from}': '${COMPAT_REDIRECTS[from]}'`)
    .join(",\n");

  const source = `// Generated from src/seo/pages.ts — run: npm run build (scripts/sync-hosting.ts)
// CloudFront Function (viewer-request)
// Known routes -> {path}.html with HTTP 200
// Compat redirects (legacy paths, /demo/report) -> 301
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

function redirect301(request, targetPath) {
  var host = request.headers.host.value;
  var location;
  // 고정 목적지( ? / # 포함)는 요청 쿼리를 붙이지 않는다
  if (targetPath.indexOf('?') !== -1 || targetPath.indexOf('#') !== -1) {
    location = 'https://' + host + targetPath;
  } else {
    location = 'https://' + host + targetPath + toQueryString(request.querystring);
  }
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: location }
    }
  };
}

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var SPA = {
${keys}
  };
  var REDIRECTS = {
${redirectEntries}
  };

  if (uri === '/') {
    return request;
  }

  if (hasFileExtension(uri)) {
    if (uri.length > 5 && uri.substring(uri.length - 5) === '.html') {
      var pretty = uri.substring(0, uri.length - 5);
      if (REDIRECTS[pretty]) {
        return redirect301(request, REDIRECTS[pretty]);
      }
      if (SPA[pretty]) {
        return redirect301(request, pretty);
      }
    }
    return request;
  }

  var hadSlash = uri.length > 1 && uri.charAt(uri.length - 1) === '/';
  var normalized = hadSlash ? uri.substring(0, uri.length - 1) : uri;

  if (REDIRECTS[normalized]) {
    return redirect301(request, REDIRECTS[normalized]);
  }

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

const sitemapOut = writeSitemap();
const routerOut = writeSpaRouter();

console.log(
  `sync-hosting: sitemap.xml (${INDEXABLE_PAGES.length} URLs) → ${path.relative(root, sitemapOut)}, router → ${path.relative(root, routerOut)} (SPA ${SPA_PATHS.length}, redirects ${Object.keys(COMPAT_REDIRECTS).length})`,
);
