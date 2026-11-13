import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
  site: "https://zerotica.narusec.com",
  // CloudFront spa-router expects /perspectives.html (not /perspectives/index.html)
  build: {
    format: "file",
  },
  // 데모 체험 등 MPA 전환 시 HTML·섬 스크립트 미리 받기
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  // Astro 기본 HTML 압축이 한글 중간에 \0을 넣는 경우가 있어 비활성화
  compressHTML: false,
  trailingSlash: "never",
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "./src"),
      },
    },
  },
});
