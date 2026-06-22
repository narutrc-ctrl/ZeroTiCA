import { closing, partnerTrustStats } from "@/data/content";
import { CountUp } from "@/components/CountUp";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export function ClosingSection() {
  return (
    <section className="border-t border-slate-100 bg-white">
      <div className="zt-container-journey zt-section">
        <RevealOnScroll variant="fade-up" className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl [word-break:keep-all]">{closing.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            {closing.lines[0]}
          </p>
        </RevealOnScroll>

        <RevealOnScroll variant="scale" delay={80} className="mt-12">
          <div className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2">
            {partnerTrustStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-6 py-8 text-center shadow-sm"
              >
                <p className="text-4xl font-bold tabular-nums text-blue-700 sm:text-5xl">
                  <CountUp value={stat.numeric} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-slate-600 [word-break:keep-all]">{stat.label}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up" delay={160} className="mt-10 text-center">
          <p className="text-lg text-slate-600">{closing.lines[1]}</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
