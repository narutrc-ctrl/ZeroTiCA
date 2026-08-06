import { closing, partnerIndustries, partnerTrustStats } from "@/data/content";
import { CountUp } from "@/components/CountUp";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export function TrustStrip() {
  return (
    <section aria-labelledby="trust-heading" className="bg-slate-50">
      <div className="zt-container-hero zt-section">
        <RevealOnScroll variant="fade-up" className="max-w-3xl">
          <p className="text-[16px] font-semibold text-blue-600">함께하는 고객사</p>
          <h2
            id="trust-heading"
            className="mt-2 text-3xl font-bold text-zinc-800 sm:text-4xl [word-break:keep-all]"
          >
            {closing.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            금융·게임·제조·공공까지, 실제 망을 분석해 운영하고 있습니다. 아래 산업군 고객사 네트워크에서
            의심 통신을 탐지·검증·조치해 왔습니다.
          </p>
        </RevealOnScroll>

        {/* TODO(ops): 공개 가능한 고객 인용·로고가 확정되면 이 영역에 추가. 검증되지 않은 후기는 사용하지 않음. */}
        <RevealOnScroll variant="fade-up" delay={60}>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {partnerIndustries.map((item) => (
              <div
                key={item.sector}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
              >
                <p className="text-sm font-bold text-zinc-800">{item.sector}</p>
                <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="scale" delay={100} className="mt-14 sm:mt-16">
          <div className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2">
            {partnerTrustStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm"
              >
                <p className="text-4xl font-bold tabular-nums text-blue-700 sm:text-5xl">
                  <CountUp value={stat.numeric} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-slate-600 [word-break:keep-all]">{stat.label}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up" delay={140} className="mt-10 text-center">
          <p className="text-lg text-slate-600">{closing.lines[0]}</p>
          <p className="mt-2 text-lg font-semibold text-zinc-800">{closing.lines[1]}</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
