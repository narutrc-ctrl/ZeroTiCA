export const SITE_ORIGIN = "https://zerotica.narusec.com";

export const INDEX_ROBOTS = "index,follow,max-image-preview:large";
export const NOINDEX_ROBOTS = "noindex,follow";

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
  title: "제로티카(ZeroTiCA) | 기업 내부를 검증하는 보안",
  description:
    "제로티카(ZeroTiCA)는 네트워크 통신을 분석해 보이지 않는 이상 징후를 찾고, 실제 위협 여부를 전문가가 검증하는 침해평가 서비스입니다.",
  canonicalPath: "/",
  robots: INDEX_ROBOTS,
  indexable: true,
  ogTitle: "제로티카(ZeroTiCA) | 기업 내부를 검증하는 보안",
  ogDescription: "내부망 통신을 분석해 보이지 않는 이상 징후를 찾고, 실제 위협 여부를 전문가가 검증합니다.",
  twitterTitle: "기업 내부를 검증하는 보안 | ZeroTiCA",
};

export const NOT_FOUND: SeoPage = {
  path: "*",
  title: "페이지를 찾을 수 없습니다 | ZeroTiCA",
  description: "요청하신 페이지를 찾을 수 없습니다.",
  canonicalPath: "/",
  robots: NOINDEX_ROBOTS,
  indexable: false,
};

/** Public pages that CloudFront should serve as 200. Home `/` is the S3 default root. */
export const PAGES: SeoPage[] = [
  HOME,
  {
    path: "/perspectives",
    title: "ZeroTiCA의 8가지 검증 관점 | ZeroTiCA",
    description:
      "실제 침해사고 조사에서 반복적으로 확인된 흔적을 8가지 관점으로 정리했습니다. 각 관점의 정황을 연결해 검증하며, 전문가가 현재 침해 여부를 최종 판단합니다.",
    canonicalPath: "/perspectives",
    robots: INDEX_ROBOTS,
    indexable: true,
  },
  {
    path: "/legal/privacy",
    title: "개인정보 처리방침 | ZeroTiCA",
    description:
      "(주)나루씨큐리티 제로티카 서비스의 개인정보 수집 항목, 이용 목적, 문의 방법을 안내합니다.",
    canonicalPath: "/legal/privacy",
    robots: INDEX_ROBOTS,
    indexable: true,
  },
  {
    path: "/demo/task",
    title: "이슈 관리 데모 | ZeroTiCA",
    description: "제로티카 고객 포털의 이슈 관리 화면 데모입니다.",
    canonicalPath: "/demo/task",
    robots: NOINDEX_ROBOTS,
    indexable: false,
  },
  {
    path: "/demo/event",
    title: "이벤트 데모 | ZeroTiCA",
    description: "제로티카 고객 포털의 이벤트·보고서 화면 데모입니다.",
    canonicalPath: "/demo/event",
    robots: NOINDEX_ROBOTS,
    indexable: false,
  },
  {
    path: "/demo/report",
    title: "보고서 데모 | ZeroTiCA",
    description: "제로티카 고객 포털의 침해 평가 보고서 데모입니다.",
    canonicalPath: "/demo/event",
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
