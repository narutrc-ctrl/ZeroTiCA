import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GlobalTour } from "@/components/GlobalTour";
import { DemoTourBar } from "@/components/DemoTourBar";
import { DemoTourPrompt } from "@/components/DemoTourPrompt";
import { BrandLogo } from "@/components/BrandLogo";
import { StoryProgressIndicator } from "@/components/StoryProgressIndicator";
import { ContactCTA } from "@/components/ContactCTA";
import { useContactModal } from "@/components/ContactModal";
import { DEFAULT_LOCALE, isSupportedLocale } from "@/i18n/site-locales";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { SeoHead } from "@/components/SeoHead";
import { paths } from "@/data/content";
import { cn } from "@/lib/cn";
import { CTA, markDemoEntrySource, trackCtaClick, trackDemoStartIfNeeded } from "@/lib/analytics";
import { jumpToTopInstant, HERO_PROBLEM_CLICK_PROGRESS, scrollToHeroSceneProgress } from "@/lib/scroll";

/** 외부 /#section deep-link 호환 — Indicator는 hash를 쓰지 않음 */
function scrollToStoryAnchor(id: string) {
  const behavior =
    id === "top" || window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";

  if (id === "problem") {
    if (window.matchMedia("(max-width: 640px)").matches) {
      document.getElementById("problem")?.scrollIntoView({ behavior, block: "start" });
      return;
    }
    scrollToHeroSceneProgress(HERO_PROBLEM_CLICK_PROGRESS, behavior);
    return;
  }

  document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
}

function navLinkClass(active: boolean) {
  return cn(
    "rounded-full px-5 py-2.5 text-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    // font-* 는 공통에 두지 않음 — Tailwind에서 medium/extrabold가 충돌하면 굵기가 덮임
    active
      ? "font-semibold text-primary"
      : "font-medium text-slate-600 hover:text-zinc-800",
  );
}

export function Layout() {
  const [open, setOpen] = useState(false);
  /** 모바일: 아래로 스크롤 중 헤더 숨김 / 위로 스크롤 시 다시 표시 */
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { openContactModal } = useContactModal();
  const parts = location.pathname.split("/").filter(Boolean);
  const locale = isSupportedLocale(parts[0]) ? parts[0] : DEFAULT_LOCALE;
  const basePath = isSupportedLocale(parts[0]) ? `/${parts.slice(1).join("/")}` || "/" : location.pathname;
  const withLocale = (path: string) =>
    locale === DEFAULT_LOCALE ? path : `/${locale}${path === "/" ? "" : path}`;
  const isDemo = basePath.startsWith("/demo");
  const isHome = basePath === "/";
  const isPerspectives = basePath === "/perspectives";
  const homePath = withLocale("/");

  const goToIntro = useCallback(() => {
    setOpen(false);
    if (isHome) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      return;
    }
    navigate(homePath);
  }, [homePath, isHome, navigate]);

  useEffect(() => {
    document.documentElement.lang = locale === "en-us" ? "en" : "ko";
  }, [locale]);

  useEffect(() => {
    trackDemoStartIfNeeded(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) return;
    jumpToTopInstant();
  }, [location.pathname]);

  // 기존 /#section deep-link 유지 (Header Indicator는 hash를 생성하지 않음)
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace(/^#/, "");
    requestAnimationFrame(() => scrollToStoryAnchor(id));
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const mobileMq = window.matchMedia("(max-width: 640px)");
    lastScrollY.current = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!mobileMq.matches || open) {
          setHeaderHidden(false);
          lastScrollY.current = window.scrollY;
          return;
        }
        const y = window.scrollY;
        const delta = y - lastScrollY.current;
        if (y < 16) {
          setHeaderHidden(false);
        } else if (delta > 6) {
          setHeaderHidden(true);
        } else if (delta < -6) {
          setHeaderHidden(false);
        }
        lastScrollY.current = y;
      });
    };

    const onMqChange = () => {
      setHeaderHidden(false);
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    mobileMq.addEventListener?.("change", onMqChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mobileMq.removeEventListener?.("change", onMqChange);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [open]);

  if (isDemo) {
    return (
      <div className="h-screen overflow-hidden bg-white">
        <SeoHead />
        <DemoTourBar />
        <div className="h-[calc(100vh-40px)]">
          <Outlet />
        </div>
        <DemoTourPrompt />
        <GlobalTour />
      </div>
    );
  }

  const globalNav = (
    <>
      <button
        type="button"
        className={navLinkClass(isHome)}
        aria-current={isHome ? "page" : undefined}
        onClick={goToIntro}
      >
        ZeroTiCA 소개
      </button>
      <Link
        to={withLocale(paths.perspectives)}
        className={navLinkClass(isPerspectives)}
        aria-current={isPerspectives ? "page" : undefined}
        onClick={() => {
          setOpen(false);
          trackCtaClick(CTA.perspectivesHeader);
        }}
      >
        검증 관점
      </Link>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SeoHead />
      <ScrollProgress retracted={headerHidden} />
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl transition-transform duration-300 ease-out will-change-transform",
          headerHidden && "max-sm:-translate-y-full",
        )}
      >
        <div className="zt-container-hero flex h-16 items-center justify-between gap-4">
          <BrandLogo />
          <div className="flex items-center gap-6 sm:gap-10">
            <nav className="hidden items-center gap-1 lg:flex" aria-label="주요 콘텐츠">
              {globalNav}
            </nav>
            <div className="flex items-center gap-2">
              <Link
                to={withLocale(paths.fullTour)}
                className="zt-btn-ghost hidden py-2.5 px-6 text-sm sm:inline-flex"
                onClick={() => {
                  markDemoEntrySource("header");
                  trackCtaClick(CTA.demoHeader);
                }}
              >
                데모 체험
              </Link>
              <ContactCTA className="hidden py-2.5 text-sm sm:inline-flex" />
              <button
                type="button"
                className="-mr-1 rounded-lg p-1 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
                aria-expanded={open}
                aria-controls="mobile-nav"
              >
                {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
              </button>
            </div>
          </div>
        </div>
        {open && (
          <div id="mobile-nav" className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="주요 콘텐츠">
              <button
                type="button"
                className={cn(navLinkClass(isHome), "w-full text-left text-sm")}
                aria-current={isHome ? "page" : undefined}
                onClick={goToIntro}
              >
                ZeroTiCA 소개
              </button>
              <Link
                to={withLocale(paths.perspectives)}
                className={cn(navLinkClass(isPerspectives), "text-sm")}
                aria-current={isPerspectives ? "page" : undefined}
                onClick={() => {
                  setOpen(false);
                  trackCtaClick(CTA.perspectivesHeader);
                }}
              >
                검증 관점
              </Link>
              <Link
                to={withLocale(paths.fullTour)}
                className="zt-btn-ghost mt-2 w-full justify-center text-sm sm:hidden"
                onClick={() => {
                  setOpen(false);
                  markDemoEntrySource("header");
                  trackCtaClick(CTA.demoHeader);
                }}
              >
                데모 체험
              </Link>
              <button
                type="button"
                className="zt-btn-primary mt-2 w-full text-sm sm:hidden"
                onClick={() => {
                  setOpen(false);
                  openContactModal();
                }}
              >
                도입 문의
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {isHome && <StoryProgressIndicator />}
      {isHome && <ScrollToTopButton />}

      <SiteFooter />
    </div>
  );
}
