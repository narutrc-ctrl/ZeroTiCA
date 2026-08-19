import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { canonicalUrl, seoForPathname } from "@/seo/pages";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
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
      for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function SeoHead() {
  const { pathname } = useLocation();
  const page = seoForPathname(pathname);
  const canonical = canonicalUrl(page.canonicalPath);
  const ogTitle = page.ogTitle ?? page.title;
  const ogDescription = page.ogDescription ?? page.description;
  const twitterTitle = page.twitterTitle ?? page.title;

  useLayoutEffect(() => {
    document.title = page.title;
    upsertMeta("name", "description", page.description);
    upsertMeta("name", "robots", page.robots);
    upsertLink("canonical", canonical);
    upsertLink("alternate", canonical, { hreflang: "ko-KR" });
    upsertLink("alternate", canonical, { hreflang: "x-default" });
    upsertMeta("property", "og:title", ogTitle);
    upsertMeta("property", "og:description", ogDescription);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("name", "twitter:title", twitterTitle);
    upsertMeta("name", "twitter:description", ogDescription);
  }, [canonical, ogDescription, ogTitle, page.description, page.robots, page.title, twitterTitle]);

  return null;
}
