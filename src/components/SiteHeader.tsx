import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { ContactCTA } from "@/components/ContactCTA";
import { useContactModal } from "@/components/ContactModal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { paths } from "@/data/content";
import { cn } from "@/lib/cn";
import { CTA, markDemoEntrySource, trackCtaClick } from "@/lib/analytics";

function navLinkClass(active: boolean) {
  return cn(
    "rounded-full px-5 py-2.5 text-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    active ? "font-semibold text-primary" : "font-medium text-slate-600 hover:text-zinc-800",
  );
}

type Props = {
  currentPath: string;
};

export function SiteHeader({ currentPath }: Props) {
  const [open, setOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);
  const { openContactModal } = useContactModal();

  const path = currentPath.length > 1 && currentPath.endsWith("/") ? currentPath.slice(0, -1) : currentPath;
  const isHome = path === "/" || path === "";
  const isPerspectives = path === "/perspectives";

  const goToIntro = () => {
    setOpen(false);
    if (isHome) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      return;
    }
    window.location.assign("/");
  };

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

  return (
    <>
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
              <button
                type="button"
                className={navLinkClass(isHome)}
                aria-current={isHome ? "page" : undefined}
                onClick={goToIntro}
              >
                ZeroTiCA 소개
              </button>
              <a
                href={paths.perspectives}
                className={navLinkClass(isPerspectives)}
                aria-current={isPerspectives ? "page" : undefined}
                onClick={() => trackCtaClick(CTA.perspectivesHeader)}
              >
                검증 관점
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <a
                href={paths.fullTour}
                className="zt-btn-ghost hidden py-2.5 px-6 text-sm sm:inline-flex"
                onClick={() => {
                  markDemoEntrySource("header");
                  trackCtaClick(CTA.demoHeader);
                }}
              >
                데모 체험
              </a>
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
              <a
                href={paths.perspectives}
                className={cn(navLinkClass(isPerspectives), "text-sm")}
                aria-current={isPerspectives ? "page" : undefined}
                onClick={() => {
                  setOpen(false);
                  trackCtaClick(CTA.perspectivesHeader);
                }}
              >
                검증 관점
              </a>
              <a
                href={paths.fullTour}
                className="zt-btn-ghost mt-2 w-full justify-center text-sm sm:hidden"
                onClick={() => {
                  setOpen(false);
                  markDemoEntrySource("header");
                  trackCtaClick(CTA.demoHeader);
                }}
              >
                데모 체험
              </a>
              <button
                type="button"
                className="zt-btn-primary mt-2 w-full text-sm sm:hidden"
                onClick={() => {
                  setOpen(false);
                  trackCtaClick(CTA.inquiryHeader);
                  openContactModal();
                }}
              >
                도입 문의
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
