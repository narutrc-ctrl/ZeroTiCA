import { RevealOnScroll } from "@/components/RevealOnScroll";
import { partnerIndustries, socialProof } from "@/data/content";

export function TrustStrip() {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="zt-container py-12 sm:py-16">
        <RevealOnScroll variant="fade-up" className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">함께하는 고객사</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl [word-break:keep-all]">
            금융·게임·제조·공공까지, 실제 망을 분석해 운영하고 있습니다
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            아래 산업군 고객사 네트워크에서 의심 통신을 탐지·검증·조치해 왔습니다. 고객사명은 익명으로 표기합니다.
          </p>
        </RevealOnScroll>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-12">
          <RevealOnScroll variant="fade-left">
            <div className="grid gap-3 sm:grid-cols-2">
              {partnerIndustries.map((item) => (
                <div
                  key={item.sector}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                >
                  <p className="text-sm font-bold text-slate-900">{item.sector}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll variant="fade-right" delay={80}>
            <div className="space-y-4">
              {socialProof.map((item) => (
                <blockquote
                  key={item.quote}
                  className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm"
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
