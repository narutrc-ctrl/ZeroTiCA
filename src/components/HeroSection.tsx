import { ArrowDown, ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { hero } from "@/data/content";
import { HeroBackground } from "@/components/HeroBackground";
import { HeroDashboardPreview } from "@/components/HeroDashboardPreview";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-[min(100vh,920px)] flex-col justify-center overflow-hidden bg-slate-950 text-white lg:min-h-screen"
    >
      <HeroBackground />

      <div className="zt-container-hero relative flex flex-1 flex-col justify-center py-14 sm:py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          <RevealOnScroll variant="fade-up" className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400/90 sm:text-sm">
              {hero.eyebrow}
            </p>
            <h1 className="mt-5 max-w-xl text-balance text-[1.75rem] font-bold leading-[1.22] tracking-tight sm:text-4xl sm:leading-[1.2] lg:text-[2.65rem] xl:text-[2.85rem] [word-break:keep-all]">
              {hero.headline}
              <br />
              <span className="bg-gradient-to-r from-cyan-200 to-blue-400 bg-clip-text text-transparent">
                {hero.headlineAccent}
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg [word-break:keep-all]">
              {hero.sub}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href={hero.ctaFlow.href} className="zt-btn-primary shadow-lg shadow-blue-500/20">
                {hero.ctaFlow.label}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to={hero.ctaReport.href}
                className="zt-btn inline-flex items-center gap-2 border border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                <FileText className="h-4 w-4" />
                {hero.ctaReport.label}
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll variant="fade-up" delay={120} className="min-w-0 lg:justify-self-end">
            <HeroDashboardPreview />
          </RevealOnScroll>
        </div>
      </div>

      <div className="zt-container-hero relative pb-8">
        <a
          href="#problem"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-300"
        >
          아래로 스크롤 <ArrowDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
