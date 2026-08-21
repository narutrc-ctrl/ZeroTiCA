import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

import { canonicalUrl, seoForPathname } from "@/seo/pages";

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

function upsertJsonLd(id: string, data: object) {
  const selector =
    `script[type="application/ld+json"][data-seo-id="${id}"]`;

  let el = document.head.querySelector<HTMLScriptElement>(selector);

  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.dataset.seoId = id;
    document.head.appendChild(el);
  }

  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  const selector =
    `script[type="application/ld+json"][data-seo-id="${id}"]`;

  document.head
    .querySelector<HTMLScriptElement>(selector)
    ?.remove();
}

const HOME_STRUCTURED_DATA = {
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://zerotica.narusec.com/#website",

      url: "https://zerotica.narusec.com/",

      name: "ZeroTiCA",

      alternateName: "제로티카",

      inLanguage: "ko-KR",

      publisher: {
        "@id": "https://zerotica.narusec.com/#organization",
      },
    },

    {
      "@type": "Organization",
      "@id": "https://zerotica.narusec.com/#organization",

      name: "나루씨큐리티",

      url: "https://www.narusec.com/",

      brand: {
        "@type": "Brand",
        name: "ZeroTiCA",
        alternateName: "제로티카",
      },
    },
  ],
};

export function SeoHead() {
  const { pathname } = useLocation();

  const page = seoForPathname(pathname);

  const canonical = canonicalUrl(page.canonicalPath);

  const ogTitle = page.ogTitle ?? page.title;

  const ogDescription =
    page.ogDescription ?? page.description;

  const twitterTitle =
    page.twitterTitle ?? page.title;

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

    // 홈페이지 구조화 데이터
    if (page.path === "/") {
      upsertJsonLd(
        "home",
        HOME_STRUCTURED_DATA
      );
    } else {
      removeJsonLd("home");
    }
  }, [
    canonical,
    ogDescription,
    ogTitle,
    page.description,
    page.path,
    page.robots,
    page.title,
    twitterTitle,
  ]);

  return null;
}