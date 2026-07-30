import { useEffect, useRef, useState } from "react";
import type { FlowVisualKey } from "@/data/content";
import { ProductCapture } from "@/components/ProductCapture";
import { cn } from "@/lib/cn";

type Step = {
  step: string;
  title: string;
  body: string;
  visual: FlowVisualKey;
};

export function ScrollyFlowSection({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { threshold: 0.55, rootMargin: "-20% 0px -35% 0px" },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, [steps.length]);

  return (
    <div className="relative">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        <div className="hidden lg:block">
          <div className="sticky top-24 py-8">
            <ProductCapture visual={steps[active]?.visual ?? "detect"} large />
            <p className="mt-4 text-center text-xs text-slate-500">
              STEP {steps[active]?.step} · {steps[active]?.title}
            </p>
          </div>
        </div>

        <div className="space-y-0">
          {steps.map((s, i) => (
            <div
              key={s.step}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className={cn(
                "min-h-[70vh] py-12 lg:min-h-[85vh] lg:py-16",
                "flex flex-col justify-center border-b border-slate-100 last:border-b-0",
              )}
            >
              <p className="text-[16px] font-bold tracking-widest text-blue-600">STEP {s.step}</p>
              <h3
                className={cn(
                  "mt-3 text-2xl font-bold text-zinc-800 transition-colors sm:text-3xl [word-break:keep-all]",
                  active === i && "text-blue-700",
                )}
              >
                {s.title}
              </h3>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">{s.body}</p>

              <div className="mt-8 lg:hidden">
                <ProductCapture visual={s.visual} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
