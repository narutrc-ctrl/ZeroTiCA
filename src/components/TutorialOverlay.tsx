import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { TourStep } from "@/data/demo-tour";
import { cn } from "@/lib/cn";
import { useContactModal } from "@/components/ContactModal";

type Rect = { top: number; left: number; width: number; height: number };

const SPOTLIGHT_PAD = 8;

function measureTarget(selector: string): Rect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return null;

  let r = el.getBoundingClientRect();
  if (r.width < 4 || r.height < 4) return null;

  // 화면 밖이면 스크롤해 보이게 한 뒤 재측정 (기존에는 이 처리가 없어 하이라이트 실패)
  if (r.right < 8 || r.left > window.innerWidth - 8 || r.bottom < 8 || r.top > window.innerHeight - 8) {
    el.scrollIntoView({ block: "center", inline: "nearest" });
    r = el.getBoundingClientRect();
  }

  if (r.right < 8 || r.left > window.innerWidth - 8) return null;
  if (r.bottom < 8 || r.top > window.innerHeight - 8) return null;

  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

function toSpotlight(rect: Rect) {
  return {
    top: rect.top - SPOTLIGHT_PAD,
    left: rect.left - SPOTLIGHT_PAD,
    width: rect.width + SPOTLIGHT_PAD * 2,
    height: rect.height + SPOTLIGHT_PAD * 2,
  };
}

function dimClipPathFromSpotlight(spotlight: { top: number; left: number; width: number; height: number }) {
  const x1 = spotlight.left;
  const y1 = spotlight.top;
  const x2 = spotlight.left + spotlight.width;
  const y2 = spotlight.top + spotlight.height;
  return `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${x1}px ${y1}px, ${x2}px ${y1}px, ${x2}px ${y2}px, ${x1}px ${y2}px, ${x1}px ${y1}px)`;
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
  const measureToken = useRef(0);
  const { openContactModal } = useContactModal();

  const [spotlightRect, setSpotlightRect] = useState<Rect | null>(null);

  const step = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  useEffect(() => {
    if (!active || !step) return;

    const token = ++measureToken.current;
    const delay = step.measureDelay ?? 180;

    const run = () => {
      if (token !== measureToken.current) return;
      const measured = measureTarget(step.target);
      if (measured) setSpotlightRect(measured);
    };

    const t1 = window.setTimeout(run, delay);
    const t2 = window.setTimeout(run, delay + 320);

    window.addEventListener("resize", run);
    window.addEventListener("scroll", run, true);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", run);
      window.removeEventListener("scroll", run, true);
    };
  }, [active, step, index]);

  if (!active || !step) return null;

  const spotlight = spotlightRect ? toSpotlight(spotlightRect) : null;
  const dimClipPath = spotlight ? dimClipPathFromSpotlight(spotlight) : undefined;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px] transition-[clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={dimClipPath ? { clipPath: dimClipPath, WebkitClipPath: dimClipPath } : undefined}
        onClick={onClose}
        aria-hidden
      />

      {spotlight && (
        <>
          <div
            className="pointer-events-none absolute rounded-xl border-2 border-white/95 bg-white/[0.06] shadow-[0_0_0_1px_rgba(59,130,246,0.35),0_0_40px_rgba(255,255,255,0.35),0_0_64px_rgba(59,130,246,0.18)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
            }}
          />
          <div
            className="pointer-events-none absolute rounded-[14px] ring-2 ring-blue-400/90 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
            }}
          />
        </>
      )}

      <div className="fixed left-1/2 top-[80%] z-[101] w-[min(92vw,380px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              가이드 {index + 1} / {steps.length}
            </p>
            <h3 className="mt-1 text-lg font-bold text-zinc-800">{step.title}</h3>
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
              <button
                type="button"
                className="zt-btn-ghost px-3 py-2 text-xs"
                onClick={() => {
                  onComplete?.();
                  openContactModal();
                }}
              >
                도입 문의
              </button>
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
