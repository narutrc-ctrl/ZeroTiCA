// TODO: 도입 문의 CTA — 요청 시 주석 해제
// import { ContactCTA } from "@/components/ContactCTA";
import { CustomerOutcomesSection } from "@/components/CustomerOutcomesSection";
import { ExperienceSection } from "@/components/ExperienceSection";
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

      <ExperienceSection />

      <TrustStrip />

      <ServiceDecisionSection />

      <FaqSection />

      {/* TODO: 도입 문의 CTA — 요청 시 주석 해제
      <ContactCTA variant="banner" />
      */}
    </div>
  );
}
