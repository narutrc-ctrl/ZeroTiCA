import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { GlobalTour } from "@/components/GlobalTour";
import { DemoTourBar } from "@/components/DemoTourBar";
import { DemoTourPrompt } from "@/components/DemoTourPrompt";
import { BrandLogo } from "@/components/BrandLogo";
// TODO: 도입 문의 CTA — 요청 시 주석 해제
// import { ContactCTA } from "@/components/ContactCTA";
// import { useContactModal } from "@/components/ContactModal";
import { DEFAULT_LOCALE, isSupportedLocale } from "@/i18n/site-locales";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FloatingCTA } from "@/components/FloatingCTA";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { paths, storyAnchors } from "@/data/content";

export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  // TODO: 도입 문의 CTA — 요청 시 주석 해제
  // const { openContactModal } = useContactModal();
  const parts = location.pathname.split("/").filter(Boolean);
  const locale = isSupportedLocale(parts[0]) ? parts[0] : DEFAULT_LOCALE;
  const basePath = isSupportedLocale(parts[0]) ? `/${parts.slice(1).join("/")}` || "/" : location.pathname;
  const withLocale = (path: string) =>
    locale === DEFAULT_LOCALE ? path : `/${locale}${path === "/" ? "" : path}`;
  const isDemo = basePath.startsWith("/demo");
  const isHome = basePath === "/";

  useEffect(() => {
    document.documentElement.lang = locale === "en-us" ? "en" : "ko";
  }, [locale]);

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace(/^#/, "");
    const el = document.getElementById(id);
    if (!el) return;
    // 로고/#top은 새로고침처럼 즉시 이동, 그 외 앵커만 스무스
    const behavior =
      id === "top" || window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";
    requestAnimationFrame(() => el.scrollIntoView({ behavior, block: "start" }));
  }, [location.pathname, location.hash]);

  if (isDemo) {
    return (
      <div className="h-screen overflow-hidden bg-white">
        <DemoTourBar />
        <div className="h-[calc(100vh-40px)]">
          <Outlet />
        </div>
        <DemoTourPrompt />
        <GlobalTour />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollProgress />
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="zt-container-hero flex h-16 items-center justify-between gap-4">
          <BrandLogo />
          {isHome && (
            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="페이지 내 이동">
              {storyAnchors.slice(1).map((a) => (
                <a
                  key={a.id}
                  href={`#${a.id}`}
                  className="rounded-lg px-2 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {a.label}
                </a>
              ))}
            </nav>
          )}
          <div className="flex items-center gap-2">
            {!isHome && (
              <Link to={withLocale("/")} className="hidden text-sm text-slate-600 hover:text-zinc-800 sm:inline">
                소개로
              </Link>
            )}
            {/* TODO: 도입 문의 CTA — 요청 시 주석 해제
            <ContactCTA className="hidden text-sm sm:inline-flex" />
            */}
            {/* 임시: 도입 문의 자리 → 데모 체험 */}
            <Link to={withLocale(paths.fullTour)} className="zt-btn-primary hidden text-sm sm:inline-flex">
              데모 체험
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>
        {open && (
          <div id="mobile-nav" className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            {isHome && (
              <nav aria-label="페이지 내 이동">
                {storyAnchors.map((a) => (
                  <a
                    key={a.id}
                    href={`#${a.id}`}
                    className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    {a.label}
                  </a>
                ))}
              </nav>
            )}
            <Link
              to={withLocale(paths.fullTour)}
              className="zt-btn-primary mt-3 w-full text-sm"
              onClick={() => setOpen(false)}
            >
              데모 체험
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {isHome && <FloatingCTA />}
      {isHome && <ScrollToTopButton />}

      <SiteFooter />
    </div>
  );
}
