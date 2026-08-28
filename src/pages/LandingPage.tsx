import { ContactCTA } from "@/components/ContactCTA";
import { CustomerOutcomesSection } from "@/components/CustomerOutcomesSection";
import { ExperienceSection } from "@/components/ExperienceSection";
// TODO: 함께하는 고객사 섹션 — 요청 시 주석 해제
// import { TrustStrip } from "@/components/TrustStrip";
import { HomeSectionViewTracker } from "@/components/HomeSectionViewTracker";
import { HomeVerificationVisitProvider } from "@/components/HomeVerificationVisitContext";
import { ServiceDecisionSection } from "@/components/ServiceDecisionSection";
import { FaqSection } from "@/components/FaqSection";
import { ProblemDifferentiatorSection } from "@/components/ProblemDifferentiatorSection";
import { InteractiveIssueJourneySection } from "@/components/interactive-journey/InteractiveIssueJourneySection";
import { HeroSection } from "@/components/HeroSection";

export function LandingPage() {
  return (
    <HomeVerificationVisitProvider>
      <div className="bg-white">
        <HomeSectionViewTracker />
        <HeroSection />

        <ProblemDifferentiatorSection />

        <InteractiveIssueJourneySection />

        <CustomerOutcomesSection />

        <ExperienceSection />

        {/* TODO: 함께하는 고객사 섹션 — 요청 시 주석 해제
      <TrustStrip />
      */}

        <ServiceDecisionSection />

        <FaqSection />

        <ContactCTA variant="banner" />
      </div>
    </HomeVerificationVisitProvider>
  );
}
