import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

import { canonicalUrl, seoForPathname, stripTrailingSlash } from "@/seo/pages";

/** SPA/StrictMode remount에서도 같은 pathname에 대해 virtual_page_view를 한 번만 보낸다. */
let lastVirtualPageViewPath: string | null = null;

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string
) {
  const selector = `meta[${attr}="${key}"]`;

  let el = document.head.querySelector<HTMLMetaElement>(selector);

  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }

  el.setAttribute("content", content);
}

function upsertLink(
  rel: string,
  href: string,
  extra?: Record<string, string>
) {
  const extraQuery = extra
    ? Object.entries(extra)
        .map(([k, v]) => `[${k}="${v}"]`)
        .join("")
    : "";

  const selector = `link[rel="${rel}"]${extraQuery}`;

  let el = document.head.querySelector<HTMLLinkElement>(selector);

  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);

    if (extra) {
      for (const [k, v] of Object.entries(extra)) {
        el.setAttribute(k, v);
      }
    }

    document.head.appendChild(el);
  }

  el.setAttribute("href", href);
}

export function SeoHead() {
  const { pathname } = useLocation();
  const pathKey = stripTrailingSlash(pathname);

  const page = seoForPathname(pathname);

  const canonical = canonicalUrl(page.canonicalPath);

  const ogTitle = page.ogTitle ?? page.title;
  const ogDescription = page.ogDescription ?? page.description;
  const twitterTitle = page.twitterTitle ?? page.title;

  useLayoutEffect(() => {
    // 기본 SEO
    document.title = page.title;

    upsertMeta(
      "name",
      "description",
      page.description
    );

    upsertMeta(
      "name",
      "robots",
      page.robots
    );

    upsertLink(
      "canonical",
      canonical
    );

    // 현재 한국어 사이트만 운영
    upsertLink(
      "alternate",
      canonical,
      { hreflang: "ko-KR" }
    );

    upsertLink(
      "alternate",
      canonical,
      { hreflang: "x-default" }
    );

    // Open Graph
    upsertMeta(
      "property",
      "og:title",
      ogTitle
    );

    upsertMeta(
      "property",
      "og:description",
      ogDescription
    );

    upsertMeta(
      "property",
      "og:url",
      canonical
    );

    upsertMeta(
      "property",
      "og:type",
      "website"
    );

    upsertMeta(
      "property",
      "og:site_name",
      "ZeroTiCA"
    );

    upsertMeta(
      "property",
      "og:locale",
      "ko_KR"
    );

    // Twitter / X
    upsertMeta(
      "name",
      "twitter:title",
      twitterTitle
    );

    upsertMeta(
      "name",
      "twitter:description",
      ogDescription
    );

    // SEO 반영 후 pathname 기준 virtual page view (hash/query만 바뀌면 pathKey 동일 → 미발송)
    if (lastVirtualPageViewPath === pathKey) {
      return;
    }
    lastVirtualPageViewPath = pathKey;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "virtual_page_view",
      page_location: window.location.href,
      page_title: page.title,
    });
  }, [
    pathKey,
    canonical,
    ogDescription,
    ogTitle,
    page.description,
    page.robots,
    page.title,
    twitterTitle,
  ]);

  return null;
}
