import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { TourStep } from "@/data/demo-tour";
import { cn } from "@/lib/cn";
import { paths } from "@/data/content";

type Rect = { top: number; left: number; width: number; height: number };

function measureTarget(selector: string): Rect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

type Props = {
  steps: TourStep[];
  active: boolean;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onComplete?: () => void;
};

export function TutorialOverlay({ steps, active, index, onIndexChange, onClose, onComplete }: Props) {
  const [rect, setRect] = useState<Rect | null>(null);

  const step = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  useEffect(() => {
    if (!active || !step) return;

    const update = () => setRect(measureTarget(step.target));
    const t = window.setTimeout(update, 160);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [active, step, index]);

  const tooltipStyle = useMemo(() => {
    if (!rect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const pad = 12;
    const placement = step?.placement ?? "bottom";
    if (placement === "top") {
      return { top: rect.top - pad, left: rect.left + rect.width / 2, transform: "translate(-50%, -100%)" };
    }
    if (placement === "left") {
      return { top: rect.top + rect.height / 2, left: rect.left - pad, transform: "translate(-100%, -50%)" };
    }
    if (placement === "right") {
      return { top: rect.top + rect.height / 2, left: rect.left + rect.width + pad, transform: "translateY(-50%)" };
    }
    return { top: rect.top + rect.height + pad, left: rect.left + rect.width / 2, transform: "translateX(-50%)" };
  }, [rect, step]);

  if (!active || !step) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden />

      {rect && (
        <div
          className="pointer-events-none absolute rounded-xl ring-2 ring-blue-500 transition-all duration-300"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.45)",
          }}
        />
      )}

      <div
        className="absolute z-[101] w-[min(92vw,380px)] rounded-2xl border border-slate-200 bg-white p-5 shadow-panel"
        style={tooltipStyle}
      >
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              가이드 {index + 1} / {steps.length}
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">{step.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{step.body}</p>
        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            type="button"
            className={cn("zt-btn-ghost px-3 py-2 text-xs", isFirst && "invisible")}
            onClick={() => onIndexChange(Math.max(0, index - 1))}
          >
            <ChevronLeft className="h-4 w-4" /> 이전
          </button>
          {isLast ? (
            <div className="flex gap-2">
              <Link
                to={`${paths.contact}?from=tour`}
                className="zt-btn-ghost px-3 py-2 text-xs"
                onClick={() => onComplete?.()}
              >
                도입 문의
              </Link>
              <button
                type="button"
                className="zt-btn-primary px-4 py-2 text-xs"
                onClick={() => onComplete?.()}
              >
                완료
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="zt-btn-primary px-4 py-2 text-xs"
              onClick={() => onIndexChange(Math.min(steps.length - 1, index + 1))}
            >
              다음 <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
