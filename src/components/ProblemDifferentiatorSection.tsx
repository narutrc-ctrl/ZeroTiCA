import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { problemSection } from "@/data/content";
import { ndrComparison } from "@/data/methodology";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { cn } from "@/lib/cn";

function NdrRow({
  typical,
  zerotica,
  index,
}: {
  typical: string;
  zerotica: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-[2px]",
      )}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="grid lg:grid-cols-[1fr_auto_1fr]">
        <div className="border-b border-slate-100 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">일반 NDR</p>
          <p className="mt-3 text-base leading-relaxed text-slate-500 sm:text-lg">{typical}</p>
        </div>
        <div className="hidden items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50 px-4 lg:flex">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white">VS</span>
        </div>
        <div className="bg-gradient-to-br from-blue-50/80 to-white p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">제로티카</p>
          <p className="mt-3 text-base font-semibold leading-relaxed text-[#212529] sm:text-lg">{zerotica}</p>
        </div>
      </div>
    </div>
  );
}

export function ProblemDifferentiatorSection() {
  return (
    <section id="problem" className="relative overflow-hidden bg-slate-50">
      {/* —— 문제 제기 (1화면) —— */}
      <div className="flex min-h-screen flex-col justify-center border-b border-slate-200/60">
        <div className="zt-container-journey py-16 sm:py-20">
          <RevealOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">현장의 질문</p>
            <h2 className="mt-4 max-w-4xl text-balance text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] [word-break:keep-all]">
              {problemSection.title}
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {problemSection.titleAccent}
              </span>
            </h2>
          </RevealOnScroll>

          <div className="mt-14 grid gap-5 md:grid-cols-3 lg:gap-8">
            {problemSection.cards.map((card, i) => (
              <RevealOnScroll key={card.q} delay={120 + i * 100} variant="scale">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 lg:p-10">
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition group-hover:bg-blue-200/60" />
                  <p className="text-5xl font-extralight tabular-nums text-blue-100 transition duration-500 group-hover:text-blue-200">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="relative mt-6 text-xl font-semibold leading-snug text-slate-900 [word-break:keep-all] sm:text-2xl">
                    {card.q}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={400} className="mt-14 flex justify-center">
            <a
              href="#differentiator"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-500 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
            >
              제로티카는 어떻게 다른가 <ArrowDown className="h-4 w-4 animate-bounce" />
            </a>
          </RevealOnScroll>
        </div>
      </div>

      {/* —— 브릿지 —— */}
      <div
        id="differentiator"
        className="relative scroll-mt-20 border-b border-slate-200/60 bg-gradient-to-b from-slate-50 via-white to-white py-16 sm:py-20"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
        <div className="zt-container-journey text-center">
          <RevealOnScroll variant="fade-up">
            <p className="text-sm font-bold text-blue-600">분석 · 차별점</p>
            <h3 className="mx-auto mt-3 max-w-3xl text-3xl font-bold text-[#212529] sm:text-4xl [word-break:keep-all]">
              {ndrComparison.title}
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              알람만 쌓이는 NDR이 아니라, 분석팀이 선별하고 고객과 검증하는 운영 방식입니다.
            </p>
          </RevealOnScroll>
        </div>
      </div>

      {/* —— NDR 비교 (문제에서 자연스럽게 이어짐) —— */}
      <div className="bg-white pb-20 pt-4 sm:pb-28 sm:pt-8">
        <div className="zt-container-journey">
          <div className="space-y-5 sm:space-y-6">
            {ndrComparison.rows.map((row, i) => (
              <NdrRow key={row.typical} typical={row.typical} zerotica={row.zerotica} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
