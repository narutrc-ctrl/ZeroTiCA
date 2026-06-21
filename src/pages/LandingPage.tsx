import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import {
  closing,
  experienceSection,
  hero,
  paths,
  problemSection,
  services,
  site,
  trustBadges,
} from "@/data/content";
import { ContactCTA } from "@/components/ContactCTA";
import { ProductCapture } from "@/components/ProductCapture";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { CustomerOutcomesSection } from "@/components/CustomerOutcomesSection";
import { UnifiedJourneySection } from "@/components/UnifiedJourneySection";
import { TourCTA } from "@/components/TourCTA";
import { journeyFlowPills } from "@/data/journey-steps";

export function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section id="top" className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950" />
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
        </div>
        <div className="zt-container relative zt-section">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Network Detection · Verification · Response
          </p>
          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl [word-break:keep-all]">
            {hero.headline}
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {hero.headlineAccent}
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-300">{hero.sub}</p>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-400">{hero.lead}</p>

          <div className="mt-10 flex flex-wrap gap-2 sm:gap-3">
            {journeyFlowPills.map((pill) => (
              <span
                key={pill.step}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 sm:px-4"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/80 text-[11px] font-bold tabular-nums">
                  {pill.step}
                </span>
                {pill.label}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#journey" className="zt-btn-primary bg-blue-500 hover:bg-blue-600">
              작업 순서 따라가기
            </a>
            <Link to={paths.contact} className="zt-btn border border-white/20 bg-white/5 text-white hover:bg-white/10">
              상담 문의하기
            </Link>
          </div>

          <a
            href="#problem"
            className="mt-16 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300"
          >
            아래로 스크롤 <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="border-b border-slate-200 bg-slate-50">
        <div className="zt-container zt-section">
          <RevealOnScroll>
            <h2 className="max-w-3xl text-balance text-3xl font-bold text-slate-900 sm:text-4xl [word-break:keep-all]">
              {problemSection.title}
              <br />
              <span className="text-blue-600">{problemSection.titleAccent}</span>
            </h2>
          </RevealOnScroll>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {problemSection.cards.map((card, i) => (
              <RevealOnScroll key={card.q} delay={i * 120}>
                <div className="zt-card h-full border-slate-200 p-8 text-center shadow-md transition hover:shadow-lg">
                  <p className="text-4xl font-light text-blue-200">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-4 text-lg font-semibold leading-snug text-slate-900 [word-break:keep-all]">
                    {card.q}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <UnifiedJourneySection />

      <CustomerOutcomesSection />

      <section className="border-b border-slate-100 bg-[#F8F9FA]">
        <div className="zt-container zt-section">
          <RevealOnScroll>
            <div className="flex flex-wrap gap-8 rounded-2xl bg-white px-6 py-5 shadow-sm">
              {trustBadges.map((b) => (
                <p key={b.label} className="text-sm text-slate-700">
                  <span className="text-2xl font-bold text-blue-700">{b.value}</span>
                  <span className="ml-2">{b.label}</span>
                </p>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-b border-slate-200 bg-slate-50">
        <div className="zt-container zt-section">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold text-slate-900">인사이트와 와치</h2>
            <p className="mt-3 max-w-2xl text-slate-600">{site.runaDefinition}</p>
          </RevealOnScroll>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {services.map((svc, i) => (
              <RevealOnScroll key={svc.id} delay={i * 100}>
                <article className="zt-card overflow-hidden">
                  <div className="border-b border-slate-100 bg-white p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{svc.tagline}</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{svc.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{svc.description}</p>
                    <ul className="mt-4 space-y-2">
                      {svc.bullets.map((b) => (
                        <li key={b} className="text-sm text-slate-600">
                          <span className="text-blue-500">·</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-100 p-4">
                    <ProductCapture visual={svc.id === "insight" ? "detect" : "report"} />
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Experience — demo ONLY here */}
      <section id="experience" className="bg-slate-950 text-white">
        <div className="zt-container zt-section">
          <RevealOnScroll>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">직접 체험</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl [word-break:keep-all]">{experienceSection.title}</h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-400">{experienceSection.lead}</p>
          </RevealOnScroll>
          <RevealOnScroll delay={120} className="mt-10">
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
                <Link
                  to={paths.contact}
                  className="zt-btn w-full justify-center border border-white/20 text-white hover:bg-white/10"
                >
                  상담 문의하기
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <ContactCTA variant="banner" />

      <section className="bg-white">
        <div className="zt-container zt-section text-center">
          <h2 className="text-3xl font-bold text-slate-900">{closing.title}</h2>
          {closing.lines.map((line) => (
            <p key={line} className="mt-3 text-lg text-slate-600">
              {line}
            </p>
          ))}
        </div>
      </section>

    </div>
  );
}
