export const SITE_ORIGIN = "https://zerotica.narusec.com";

export const INDEX_ROBOTS = "index,follow,max-image-preview:large";
export const NOINDEX_ROBOTS = "noindex,follow";

/** Shared meta / OG / Twitter description for all pages. */
export const SITE_DESCRIPTION =
  "나루씨큐리티의 제로티카(ZeroTiCA)는 내부망 네트워크 통신을 분석해 침해 징후를 검증하고 조치 방향을 제시합니다.";

export type SeoPage = {
  path: string;
  title: string;
  description: string;
  canonicalPath: string;
  robots: string;
  /** Included in sitemap.xml and unique first-byte SEO. */
  indexable: boolean;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
};

export const HOME: SeoPage = {
  path: "/",
  title: "제로티카(ZeroTiCA) | 침해평가로 기업 내부를 검증하는 보안",
  description: SITE_DESCRIPTION,
  canonicalPath: "/",
  robots: INDEX_ROBOTS,
  indexable: true,
  ogTitle: "제로티카(ZeroTiCA) | 침해평가로 기업 내부를 검증하는 보안",
  twitterTitle: "기업 내부를 검증하는 보안 | ZeroTiCA",
};

export const NOT_FOUND: SeoPage = {
  path: "*",
  title: "페이지를 찾을 수 없습니다 | ZeroTiCA",
  description: SITE_DESCRIPTION,
  canonicalPath: "/",
  robots: NOINDEX_ROBOTS,
  indexable: false,
};

/** Public pages that CloudFront should serve as 200. Home `/` is the S3 default root. */
export const PAGES: SeoPage[] = [
  HOME,
  {
    path: "/perspectives",
    title: "침해 징후를 확인하는 8가지 보안 검증 관점 | ZeroTiCA",
    description: SITE_DESCRIPTION,
    canonicalPath: "/perspectives",
    robots: INDEX_ROBOTS,
    indexable: true,
  },
  {
    path: "/legal/privacy",
    title: "개인정보 처리방침 | ZeroTiCA",
    description: SITE_DESCRIPTION,
    canonicalPath: "/legal/privacy",
    robots: INDEX_ROBOTS,
    indexable: true,
  },
  {
    path: "/demo/task",
    title: "이슈 관리 데모 | ZeroTiCA",
    description: SITE_DESCRIPTION,
    canonicalPath: "/demo/task",
    robots: NOINDEX_ROBOTS,
    indexable: false,
  },
  {
    path: "/demo/event",
    title: "이벤트 데모 | ZeroTiCA",
    description: SITE_DESCRIPTION,
    canonicalPath: "/demo/event",
    robots: NOINDEX_ROBOTS,
    indexable: false,
  },
  {
    path: "/demo/report",
    title: "보고서 데모 | ZeroTiCA",
    description: SITE_DESCRIPTION,
    canonicalPath: "/demo/report",
    robots: NOINDEX_ROBOTS,
    indexable: false,
  },
];

export const SPA_PATHS = PAGES.filter((page) => page.path !== "/").map((page) => page.path);

export const INDEXABLE_PAGES = PAGES.filter((page) => page.indexable);

const PAGE_MAP = new Map(PAGES.map((page) => [page.path, page]));

export function canonicalUrl(canonicalPath: string): string {
  if (canonicalPath === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${canonicalPath}`;
}

export function stripTrailingSlash(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname || "/";
}

export function seoForPathname(pathname: string): SeoPage {
  const path = stripTrailingSlash(pathname);
  return PAGE_MAP.get(path) ?? NOT_FOUND;
}
