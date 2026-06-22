import { ArrowDown } from "lucide-react";
import {
  experienceSection,
  hero,
} from "@/data/content";
import { journeyActAnchorId, journeyActs } from "@/data/journey-steps";
import { ContactCTA } from "@/components/ContactCTA";
import { ProductCapture } from "@/components/ProductCapture";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { CustomerOutcomesSection } from "@/components/CustomerOutcomesSection";
import { UnifiedJourneySection } from "@/components/UnifiedJourneySection";
import { TourCTA } from "@/components/TourCTA";
import { TrustStrip } from "@/components/TrustStrip";
import { ClosingSection } from "@/components/ClosingSection";
import { ServiceDecisionSection } from "@/components/ServiceDecisionSection";
import { FaqSection } from "@/components/FaqSection";
import { ProblemDifferentiatorSection } from "@/components/ProblemDifferentiatorSection";

export function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero — 1화면 */}
      <section
        id="top"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-950 text-white"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950" />
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl animate-pulse" />
        </div>

        <div className="zt-container-journey relative flex flex-1 flex-col justify-center py-16 sm:py-20 lg:py-24">
          <RevealOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Network Detection · Verification · Response
            </p>
            <h1 className="mt-8 max-w-5xl text-balance text-4xl font-bold leading-[1.15] sm:text-5xl lg:text-6xl xl:text-7xl [word-break:keep-all]">
              {hero.headline}
              <br />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {hero.headlineAccent}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-slate-300 sm:text-2xl">{hero.sub}</p>
            <p className="mt-5 max-w-3xl rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-cyan-100/90 sm:text-base">
              {hero.runaOneLiner}
            </p>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">{hero.lead}</p>
          </RevealOnScroll>

          <RevealOnScroll variant="fade-up" delay={100} className="mt-12 flex flex-wrap gap-2 sm:gap-3">
            {journeyActs.map((act) => (
              <a
                key={act.id}
                href={`#${journeyActAnchorId(act)}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-blue-400/40 hover:bg-blue-500/10"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/80 text-[11px] font-bold tabular-nums">
                  {act.act}
                </span>
                {act.title}
              </a>
            ))}
          </RevealOnScroll>

          <RevealOnScroll variant="fade-up" delay={180} className="mt-10 flex flex-wrap gap-3">
            <TourCTA className="bg-blue-500 shadow-lg shadow-blue-500/25 hover:bg-blue-600" />
            <a href="#journey" className="zt-btn border border-white/20 bg-white/5 text-white hover:bg-white/10">
              STEP 1부터 보기
            </a>
          </RevealOnScroll>
        </div>

        <div className="zt-container-journey pb-10">
          <a
            href="#problem"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-300"
          >
            아래로 스크롤 <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </section>

      <ProblemDifferentiatorSection />

      <UnifiedJourneySection />

      <CustomerOutcomesSection />

      <ServiceDecisionSection />

      <FaqSection />

      <section id="experience" className="bg-slate-950 text-white">
        <div className="zt-container zt-section">
          <RevealOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">직접 체험</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl [word-break:keep-all]">{experienceSection.title}</h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-400">{experienceSection.lead}</p>
          </RevealOnScroll>
          <RevealOnScroll delay={120} variant="scale" className="mt-10">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ProductCapture visual="interact" large />
              </div>
              <div className="flex flex-col justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-8">
                <p className="text-sm text-slate-300">가이드 투어 포함</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>· 업무 Sheet · 칸반</li>
                  <li>· 단계별 대시보드</li>
                  <li>· 침해 평가 보고서 뷰어</li>
                </ul>
                <TourCTA className="mt-4 w-full justify-center" />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <ContactCTA variant="banner" />

      <TrustStrip />

      <ClosingSection />
    </div>
  );
}
