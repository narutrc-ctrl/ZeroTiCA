import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { SeoHead } from "@/components/SeoHead";
import { paths, storyAnchors } from "@/data/content";
import { cn } from "@/lib/cn";
import { CTA, trackCtaClick } from "@/lib/analytics";
import { jumpToTopInstant } from "@/lib/scroll";

/** 히어로 sticky 안 섹션2가 거의 다 드러난 지점 (끝이면 검증 관점으로 넘어감) */
const PROBLEM_SCENE_PROGRESS = 0.96;

function scrollToStoryAnchor(id: string) {
  const behavior =
    id === "top" || window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";

  if (id === "problem") {
    // 모바일: 섹션2가 sticky 밖 #problem — 일반 스크롤
    if (window.matchMedia("(max-width: 640px)").matches) {
      document.getElementById("problem")?.scrollIntoView({ behavior, block: "start" });
      return;
    }
    const scene = document.getElementById("top");
    if (!scene) return;
    const totalDistance = Math.max(scene.offsetHeight - window.innerHeight, 0);
    const top = scene.offsetTop + totalDistance * PROBLEM_SCENE_PROGRESS;
    window.scrollTo({ top, behavior });
    return;
  }

  document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
}

export function Layout() {
  const [open, setOpen] = useState(false);
  /** 모바일: 아래로 스크롤 중 헤더 숨김 / 위로 스크롤 시 다시 표시 */
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  // TODO: 도입 문의 CTA — 요청 시 주석 해제
  // const { openContactModal } = useContactModal();
  const parts = location.pathname.split("/").filter(Boolean);
  const locale = isSupportedLocale(parts[0]) ? parts[0] : DEFAULT_LOCALE;
  const basePath = isSupportedLocale(parts[0]) ? `/${parts.slice(1).join("/")}` || "/" : location.pathname;
  const withLocale = (path: string) =>
    locale === DEFAULT_LOCALE ? path : `/${locale}${path === "/" ? "" : path}`;
  const isDemo = basePath.startsWith("/demo");
  const isHome = basePath === "/";

  const goToAnchor = useCallback(
    (id: string) => {
      const hash = `#${id}`;
      if (location.hash === hash) {
        scrollToStoryAnchor(id);
        return;
      }
      navigate({ pathname: location.pathname, search: location.search, hash: id });
    },
    [location.hash, location.pathname, location.search, navigate],
  );

  useEffect(() => {
    document.documentElement.lang = locale === "en-us" ? "en" : "ko";
  }, [locale]);

  useEffect(() => {
    if (location.hash) return;
    jumpToTopInstant();
  }, [location.pathname]);

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
          {isHome && (
              <nav className="hidden items-center gap-2 lg:flex" aria-label="페이지 내 이동">
                {storyAnchors.map((a) => (
                  <a
                    key={a.id}
                    href={`#${a.id}`}
                    className="rounded-lg px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  onClick={(e) => {
                    e.preventDefault();
                    goToAnchor(a.id);
                  }}
                >
                  {a.label}
                </a>
              ))}
            </nav>
          )}
          <div className="flex items-center gap-2">
            {/* TODO: 도입 문의 CTA — 요청 시 주석 해제
            <ContactCTA className="hidden text-sm sm:inline-flex" />
            */}
            {/* 임시: 도입 문의 자리 → 데모 체험 */}
            <Link
              to={withLocale(paths.fullTour)}
              className="zt-btn-primary hidden px-6 text-sm sm:inline-flex"
              onClick={() => trackCtaClick(CTA.demoHeader)}
            >
              데모 체험하기
            </Link>
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
        {open && (
          <div id="mobile-nav" className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            {isHome && (
              <nav aria-label="페이지 내 이동">
                {storyAnchors.map((a) => (
                  <a
                    key={a.id}
                    href={`#${a.id}`}
                    className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      goToAnchor(a.id);
                    }}
                  >
                    {a.label}
                  </a>
                ))}
              </nav>
            )}
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
