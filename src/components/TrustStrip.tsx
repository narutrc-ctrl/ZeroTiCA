import { CountUp } from "@/components/CountUp";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { clientLogos, industryBadges, socialProof, statSources, trustBadges } from "@/data/content";

export function TrustStrip() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="zt-container py-10 sm:py-12">
        <RevealOnScroll variant="fade-up" className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">고객사</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {clientLogos.map((logo) => (
              <div
                key={logo.label}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                title={logo.label}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                  {logo.abbr}
                </span>
                <span className="text-xs font-medium text-slate-600">{logo.label}</span>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <RevealOnScroll variant="fade-left">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {trustBadges.map((b) => (
                <div key={b.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-5 text-center">
                  <p className="text-2xl font-bold tabular-nums text-blue-700 sm:text-3xl">
                    <CountUp value={b.numeric} suffix={b.suffix} />
                  </p>
                  <p className="mt-1 text-xs leading-snug text-slate-500 [word-break:keep-all]">{b.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              {statSources.map((s) => `${s.label}: ${s.source}`).join(" · ")}
            </p>
          </RevealOnScroll>

          <RevealOnScroll variant="fade-right" delay={80}>
            <div className="flex flex-wrap gap-2">
              {industryBadges.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="mt-5 space-y-4">
              {socialProof.map((item) => (
                <blockquote
                  key={item.quote}
                  className="rounded-2xl border border-blue-100 bg-blue-50/40 px-5 py-4"
                >
                  <p className="text-sm leading-relaxed text-slate-700">「{item.quote}」</p>
                  <footer className="mt-2 text-xs text-slate-500">
                    — {item.role} · {item.industry}
                  </footer>
                </blockquote>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
