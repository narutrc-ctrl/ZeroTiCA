import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  getSimulationNarrative,
  simulationIntro,
  storyChapters,
  type NarrativeAction,
  type SimCase,
} from "@/data/issue-story";
import {
  getWaitingLabel,
  SIM_STAGE_HEIGHT_PX,
  SimulationCtaBar,
} from "@/components/interactive-journey/SimulationConsole";
import { SimulationStage } from "@/components/interactive-journey/SimulationStage";
import { useIssueSimulation } from "@/hooks/useIssueSimulation";
import { cn } from "@/lib/cn";

const USER_ACTIONS: NarrativeAction[] = [
  "click-card",
  "click-reply",
  "click-submit",
  "click-next-case",
  "click-report",
];

/** 원 4개 — 시작은 왼쪽 끝에 겹침, 펼침 완료 시 좌우 끝 기준으로 전체 왼쪽 시프트 */
const CIRCLE_SHIFT_X = -8;
const CIRCLE_START_X = CIRCLE_SHIFT_X;
const CIRCLE_TARGET_X = [
  0 + CIRCLE_SHIFT_X,
  100 / 3 + CIRCLE_SHIFT_X,
  200 / 3 + CIRCLE_SHIFT_X,
  100 + CIRCLE_SHIFT_X,
] as const;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function getCtaLabel(actionType: NarrativeAction | undefined, activeCase: SimCase): string | null {
  switch (actionType) {
    case "click-card":
      return "강조된 「확인 요청」 카드를 클릭하세요";
    case "click-reply":
      return activeCase === "threat"
        ? "Sheet 하단 「조치 내용 답변하기」를 누르세요"
        : "Sheet 하단 「맥락 답변하기」를 누르세요";
    case "click-submit":
      return activeCase === "threat"
        ? "조치 내용 입력 후 「답변 등록」을 누르세요"
        : "답변 입력 후 「답변 등록」을 누르세요";
    case "click-next-case":
      return "「다음」으로 고객 조치 단계를 이어보세요";
    case "click-report":
      return "「다음」으로 침해평가 보고서를 확인하세요";
    default:
      return null;
  }
}

function JourneyStepTabs({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2" role="tablist" aria-label="검증 단계">
      {storyChapters.map((chapter, index) => {
        const active = index === activeIndex;
        return (
          <div key={chapter.id} className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(index)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors sm:px-4 sm:py-2 sm:text-[14px]",
                active
                  ? "bg-[#e8f1ff] text-primary"
                  : "bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600",
              )}
            >
              {chapter.label}
            </button>
            {index < storyChapters.length - 1 ? (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function revealStyle(t: number) {
  const e = easeOutCubic(Math.min(1, Math.max(0, t)));
  return {
    opacity: e,
    transform: `translate3d(0, ${(1 - e) * 28}px, 0)`,
  };
}

export function InteractiveIssueJourneySection() {
  const sim = useIssueSimulation();
  const { activeCase, phase, chapterIndex } = sim;
  const chapter = storyChapters[chapterIndex] ?? storyChapters[0];
  const narrative = getSimulationNarrative(phase, activeCase);
  const actionType = narrative?.actionType;
  const needsUserAction = actionType && USER_ACTIONS.includes(actionType);
  const isAutoPhase = !needsUserAction && phase !== "report";
  const ctaLabel = needsUserAction ? getCtaLabel(actionType, activeCase) : null;
  const isFirst = chapterIndex <= 0;
  const isLast = chapterIndex >= storyChapters.length - 1;

  const sectionRef = useRef<HTMLElement>(null);
  const flowStartedRef = useRef(false);
  const [circleT, setCircleT] = useState(0);
  const [headerT, setHeaderT] = useState(0);
  const [panelT, setPanelT] = useState(0);

  // 단계+박스가 100% 나타난 뒤에만 자동 흐름 시작
  useEffect(() => {
    if (panelT < 1 || flowStartedRef.current || sim.started) return;
    flowStartedRef.current = true;
    sim.startSimulation();
  }, [panelT, sim.started, sim.startSimulation]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      if (reduceMotion) {
        setCircleT(1);
        setHeaderT(1);
        setPanelT(1);
        return;
      }

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionH = Math.max(section.offsetHeight, 1);
      // 섹션이 뷰포트 하단에서부터 들어온 양
      const entered = vh - rect.top;

      // 원 펼침: 섹션 진입 ~ 끝까지 (콘텐츠와 독립)
      const circle = Math.min(1, Math.max(0, entered / sectionH));

      // 콘텐츠: 섹션 1/2부터 시작, 상단 → 단계+박스 순차 등장
      const contentSpan = sectionH * 0.32;
      const contentT = Math.min(1, Math.max(0, (entered - sectionH * (1 / 2)) / contentSpan));
      const header = Math.min(1, contentT / 0.52);
      const panel = Math.min(1, Math.max(0, (contentT - 0.3) / 0.55));

      setCircleT(circle);
      setHeaderT(header);
      setPanelT(panel);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const spread = easeOutCubic(circleT);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative overflow-hidden border-b border-slate-200/80 bg-[#f7f9fc]"
    >
      <div className="journey-bg-circles" aria-hidden>
        {CIRCLE_TARGET_X.map((targetX, i) => {
          const x = CIRCLE_START_X + (targetX - CIRCLE_START_X) * spread;

          return (
            <div
              key={i}
              className="journey-bg-circle"
              style={{
                left: `${x}%`,
                opacity: 0.5,
                zIndex: CIRCLE_TARGET_X.length - i,
              }}
            />
          );
        })}
      </div>

      <div className="zt-container-hero relative z-10 w-full pt-16 pb-28 sm:pt-20 sm:pb-36 lg:pt-28 lg:pb-44">
        <div className="text-center will-change-transform" style={revealStyle(headerT)}>
          <p className="text-[16px] font-bold text-primary">{simulationIntro.eyebrow}</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-[28px] font-extrabold leading-[1.35] tracking-tight text-zinc-900 [word-break:keep-all] sm:mt-5 sm:text-[36px] lg:text-[42px]">
            {simulationIntro.title}
          </h2>
        </div>

        <div className="sim-journey-sticky mt-10 will-change-transform sm:mt-14" style={revealStyle(panelT)}>
          <JourneyStepTabs activeIndex={chapterIndex} onSelect={sim.goToChapter} />

          <div className="sim-journey-panel mt-5 rounded-[28px] border border-slate-200/90 bg-white/90 p-4 shadow-[0_18px_50px_rgba(171,209,255,0.45)] backdrop-blur-sm sm:mt-6 sm:p-6 lg:p-7">
            <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
              <div className="min-w-0">
                <div className="overflow-hidden rounded-2xl bg-[#eef2f7]">
                  <SimulationStage sim={sim} />
                </div>
              </div>

              <div className="relative min-w-0" style={{ height: SIM_STAGE_HEIGHT_PX }}>
                <div className="h-full overflow-y-auto pb-16">
                  <p className="text-[15px] font-semibold tabular-nums text-primary sm:text-[16px]">
                    {chapterIndex + 1} / {storyChapters.length}
                  </p>

                  <h3 className="mt-4 text-[22px] font-extrabold leading-[1.35] tracking-tight text-zinc-900 [word-break:keep-all] sm:mt-5 sm:text-[26px] lg:text-[28px]">
                    {chapter.titleParts.map((part, i) =>
                      part.text.includes("\n") ? (
                        <span key={i} className={part.accent ? "text-primary" : undefined}>
                          {part.text.split("\n").map((line, li, arr) => (
                            <span key={li}>
                              {line}
                              {li < arr.length - 1 ? <br /> : null}
                            </span>
                          ))}
                        </span>
                      ) : (
                        <span key={i} className={part.accent ? "text-primary" : undefined}>
                          {part.text}
                        </span>
                      ),
                    )}
                  </h3>

                  <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-slate-500 [word-break:keep-all] sm:mt-4 sm:text-[15px]">
                    {chapter.description}
                  </p>

                  <div className="mt-5 sm:mt-6">
                    {phase === "report" ? (
                      <div className="min-h-[52px] rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 text-sm text-slate-500" />
                    ) : (
                      <SimulationCtaBar waiting={isAutoPhase} waitingLabel={getWaitingLabel(phase, activeCase)}>
                        {ctaLabel}
                      </SimulationCtaBar>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 flex items-center justify-end gap-2.5">
                  {isLast ? (
                    <button
                      type="button"
                      onClick={sim.restart}
                      className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-blue-600"
                    >
                      처음으로 돌아가기
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={sim.goPrevChapter}
                        disabled={isFirst}
                        aria-hidden={isFirst}
                        tabIndex={isFirst ? -1 : undefined}
                        className={cn(
                          "inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-2.5 text-[14px] font-semibold text-primary shadow-sm hover:bg-blue-50",
                          isFirst && "invisible pointer-events-none",
                        )}
                      >
                        이전
                      </button>
                      <button
                        type="button"
                        onClick={sim.goNextChapter}
                        className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-blue-600"
                      >
                        다음
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** @deprecated InteractiveIssueJourneySection 사용 */
export { InteractiveIssueJourneySection as InteractiveJourneySection };
