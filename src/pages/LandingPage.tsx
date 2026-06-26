import {
  experienceSection,
} from "@/data/content";
import { ContactCTA } from "@/components/ContactCTA";
import { ProductCapture } from "@/components/ProductCapture";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { CustomerOutcomesSection } from "@/components/CustomerOutcomesSection";
import { TourCTA } from "@/components/TourCTA";
import { TrustStrip } from "@/components/TrustStrip";
import { ServiceDecisionSection } from "@/components/ServiceDecisionSection";
import { FaqSection } from "@/components/FaqSection";
import { ProblemDifferentiatorSection } from "@/components/ProblemDifferentiatorSection";
import { InteractiveIssueJourneySection } from "@/components/interactive-journey/InteractiveIssueJourneySection";
import { HeroSection } from "@/components/HeroSection";

export function LandingPage() {
  return (
    <div className="bg-white">
      <HeroSection />

      <ProblemDifferentiatorSection />

      <InteractiveIssueJourneySection />

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
    </div>
  );
}
