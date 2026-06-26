import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { GlobalTour } from "@/components/GlobalTour";
import { DemoTourBar } from "@/components/DemoTourBar";
import { DemoTourPrompt } from "@/components/DemoTourPrompt";
import { BrandLogo } from "@/components/BrandLogo";
import { ContactCTA } from "@/components/ContactCTA";
import { useContactModal } from "@/components/ContactModal";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FloatingCTA } from "@/components/FloatingCTA";
import { storyAnchors } from "@/data/content";

export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { openContactModal } = useContactModal();
  const isDemo = location.pathname.startsWith("/demo");
  const isHome = location.pathname === "/";

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
    <div className="min-h-screen bg-white">
      <ScrollProgress />
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="zt-container flex h-16 items-center justify-between gap-4">
          <BrandLogo />
          {isHome && (
            <nav className="hidden items-center gap-0.5 lg:flex">
              {storyAnchors.slice(1).map((a) => (
                <a
                  key={a.id}
                  href={`#${a.id}`}
                  className="rounded-lg px-2 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  {a.label}
                </a>
              ))}
            </nav>
          )}
          <div className="flex items-center gap-2">
            {!isHome && (
              <Link to="/" className="hidden text-sm text-slate-600 hover:text-slate-900 sm:inline">
                소개로
              </Link>
            )}
            <ContactCTA className="hidden text-sm sm:inline-flex" />
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="메뉴"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            {isHome &&
              storyAnchors.map((a) => (
                <a
                  key={a.id}
                  href={`#${a.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  {a.label}
                </a>
              ))}
            <button
              type="button"
              className="zt-btn-primary mt-3 w-full text-sm"
              onClick={() => {
                setOpen(false);
                openContactModal();
              }}
            >
              도입 문의
            </button>
            <Link
              to="/#experience"
              className="zt-btn-ghost mt-2 w-full text-sm"
              onClick={() => setOpen(false)}
            >
              서비스 체험
            </Link>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      {isHome && <FloatingCTA />}

      <SiteFooter />
    </div>
  );
}
