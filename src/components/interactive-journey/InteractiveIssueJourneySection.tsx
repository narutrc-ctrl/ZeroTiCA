import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { getChapterStepDetail, simulationIntro, storyChapters } from "@/data/issue-story";
import { SimulationStage } from "@/components/interactive-journey/SimulationStage";
import { useIssueSimulation } from "@/hooks/useIssueSimulation";
import { cn } from "@/lib/cn";

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

function JourneyNavFooter({
  chapterLabel,
  subProgress,
  isAtStart,
  isAtEnd,
  showVerifyClosingNote,
  showThreatClosingNote,
  onPrev,
  onNext,
  onRestart,
  showSubDots = false,
}: {
  chapterLabel: string;
  subProgress: { current: number; total: number };
  isAtStart: boolean;
  isAtEnd: boolean;
  showVerifyClosingNote: boolean;
  showThreatClosingNote: boolean;
  onPrev: () => void;
  onNext: () => void;
  onRestart: () => void;
  /** 데스크톱 전용 — 하위 단계 닷 */
  showSubDots?: boolean;
}) {
  return (
    <>
      {showVerifyClosingNote ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-3.5 py-3">
          <p className="text-[12px] font-semibold leading-relaxed text-emerald-800 [word-break:keep-all] sm:text-[13px]">
            위협이 아니어도 검증의 결과입니다.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {["몰랐던 자산·통신", "필요한 업무 통신", "정리가 필요한 통신", "이후 판단의 기준"].map(
              (label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 [word-break:keep-all] sm:text-[12px]"
                >
                  {label}
                </span>
              ),
            )}
          </div>
        </div>
      ) : null}

      {showThreatClosingNote ? (
        <p className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3.5 text-[14px] font-semibold leading-relaxed text-primary [word-break:keep-all] sm:text-[15px]">
          정상으로 확인된 사례와 위협으로 조치한 사례가 모두 검증 기록으로 남아 이후 변화를
          판단하는 기준이 됩니다.
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        {showSubDots && subProgress.total > 1 && !isAtEnd ? (
          <div
            className="mr-auto flex items-center gap-1.5"
            aria-label={`${chapterLabel} ${subProgress.current + 1}/${subProgress.total}`}
          >
            {Array.from({ length: subProgress.total }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  i === subProgress.current ? "bg-primary" : "bg-slate-300",
                )}
              />
            ))}
          </div>
        ) : null}
        <div className="flex items-center justify-end gap-2.5">
          {isAtEnd ? (
            <>
              <button
                type="button"
                onClick={onPrev}
                className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-2.5 text-[14px] font-semibold text-primary shadow-sm hover:bg-blue-50"
              >
                이전
              </button>
              <button
                type="button"
                onClick={onRestart}
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-blue-600"
              >
                처음으로
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onPrev}
                disabled={isAtStart}
                aria-hidden={isAtStart}
                tabIndex={isAtStart ? -1 : undefined}
                className={cn(
                  "inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-2.5 text-[14px] font-semibold text-primary shadow-sm hover:bg-blue-50",
                  isAtStart && "invisible pointer-events-none",
                )}
              >
                이전
              </button>
              <button
                type="button"
                onClick={onNext}
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-blue-600"
              >
                다음
              </button>
            </>
          )}
        </div>
      </div>
    </>
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
  const { phase, chapterIndex, isAtStart, isAtEnd, subProgress, analystStep, activeCase } = sim;
  const chapter = storyChapters[chapterIndex] ?? storyChapters[0];
  const chapterDescription = getChapterStepDetail(phase, activeCase, analystStep);
  /** 검증 5/5 — 오른쪽 패널 안내 박스 + 뱃지 */
  const showVerifyClosingNote =
    chapterIndex === 2 && subProgress.total > 1 && subProgress.current === subProgress.total - 1;
  /** 고객 조치 5/5 — 오른쪽 패널 하단 안내 박스 */
  const showThreatClosingNote =
    chapterIndex === 3 && subProgress.total > 1 && subProgress.current === subProgress.total - 1;

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
      const isMobile = window.matchMedia("(max-width: 640px)").matches;

      // 원 펼침: 섹션 진입 ~ 끝까지 (콘텐츠와 독립)
      const circle = Math.min(1, Math.max(0, entered / sectionH));

      /**
       * 콘텐츠 등장
       * — 기존: 섹션 높이 1/2 지점부터 시작 → 모바일에서 빈 화면이 길게 유지됨
       * — 모바일: 섹션이 들어오자마자 타이틀→패널이 짧게 등장
       */
      let contentT: number;
      let header: number;
      let panel: number;
      if (isMobile) {
        const startAt = vh * 0.08;
        const contentSpan = Math.min(vh * 0.4, sectionH * 0.2);
        contentT = Math.min(1, Math.max(0, (entered - startAt) / Math.max(contentSpan, 1)));
        header = Math.min(1, contentT / 0.35);
        panel = Math.min(1, Math.max(0, (contentT - 0.12) / 0.5));
      } else {
        const contentSpan = sectionH * 0.32;
        contentT = Math.min(1, Math.max(0, (entered - sectionH * (1 / 2)) / contentSpan));
        header = Math.min(1, contentT / 0.52);
        panel = Math.min(1, Math.max(0, (contentT - 0.3) / 0.55));
      }

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
      aria-labelledby="journey-heading"
      className="relative scroll-mt-20 overflow-hidden border-b border-slate-200/80 bg-[#f7f9fc]"
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
        <div className="text-center" style={revealStyle(headerT)}>
          <p className="text-[16px] font-bold text-primary">{simulationIntro.eyebrow}</p>
          <h2
            id="journey-heading"
            className="mx-auto mt-4 max-w-4xl text-[28px] font-extrabold leading-[1.35] tracking-tight text-zinc-900 [word-break:keep-all] sm:mt-5 sm:text-[36px] lg:text-[42px]"
          >
            {simulationIntro.title}
            <br />
            {simulationIntro.titleLine2}
          </h2>
        </div>

        <div className="sim-journey-sticky mt-10 sm:mt-14" style={revealStyle(panelT)}>
          <JourneyStepTabs activeIndex={chapterIndex} onSelect={sim.goToChapter} />

          <div className="sim-journey-panel mt-5 rounded-[28px] border border-slate-200/90 bg-white/90 p-4 shadow-[0_18px_50px_rgba(171,209,255,0.45)] backdrop-blur-sm sm:mt-6 sm:p-6 lg:p-7">
            <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
              {/* 모바일: 설명 → 시뮬레이션 → 이전/다음(카드 하단) / lg: 시뮬 | 설명+버튼 */}
              <div className="relative order-1 min-w-0 sm:h-[600px] lg:order-2">
                <div
                  className={cn(
                    "pb-0 pt-0 sm:h-full sm:overflow-y-auto sm:pb-4 sm:pt-6",
                    showVerifyClosingNote || showThreatClosingNote ? "sm:pb-44" : "sm:pb-16",
                  )}
                >
                  <p className="text-[15px] font-semibold text-slate-700 sm:text-[16px]">
                    <span className="text-primary">{chapter.label}</span>{" "}
                    <span className="tabular-nums">
                      <span className="text-primary">{subProgress.current + 1}</span>
                      <span className="text-slate-400">/{subProgress.total}</span>
                    </span>
                  </p>

                  {chapterIndex === 2 ? (
                    <p className="mt-1 text-[12px] font-medium text-slate-400 [word-break:keep-all] sm:text-[13px]">
                      사례 A · 에이전트 통신(패킷/바이트)
                    </p>
                  ) : null}

                  {chapterIndex === 3 ? (
                    <p className="mt-1 text-[12px] font-medium text-slate-400 [word-break:keep-all] sm:text-[13px]">
                      사례 B · 목적지 연결 거절 이상
                    </p>
                  ) : null}

                  <h3 className="mt-2.5 text-[22px] font-extrabold leading-[1.35] tracking-tight text-zinc-900 [word-break:keep-all] sm:mt-3 sm:text-[26px] lg:text-[28px]">
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

                  <p className="mt-3 whitespace-pre-line text-[16px] leading-relaxed text-slate-500 [word-break:keep-all] sm:mt-4 sm:text-[18px]">
                    {chapterDescription}
                  </p>
                </div>

                {/* 데스크톱: 설명 컬럼 하단 고정 */}
                <div className="relative mt-4 hidden flex-col gap-3 sm:absolute sm:inset-x-0 sm:bottom-0 sm:mt-0 sm:flex">
                  <JourneyNavFooter
                    chapterLabel={chapter.label}
                    subProgress={subProgress}
                    isAtStart={isAtStart}
                    isAtEnd={isAtEnd}
                    showVerifyClosingNote={showVerifyClosingNote}
                    showThreatClosingNote={showThreatClosingNote}
                    onPrev={sim.goPrev}
                    onNext={sim.goNext}
                    onRestart={sim.restart}
                    showSubDots
                  />
                </div>
              </div>

              <div className="order-2 min-w-0 lg:order-1">
                <div
                  className={cn(
                    "overflow-hidden",
                    // 관측·선별 모바일: 회색 프레임 없이 콘텐츠만
                    phase === "monitoring" || phase === "anomaly" || phase === "analyst"
                      ? "rounded-none bg-transparent sm:rounded-2xl sm:bg-[#eef2f7]"
                      : "rounded-2xl bg-[#eef2f7]",
                  )}
                >
                  <SimulationStage sim={sim} />
                </div>
              </div>

              {/* 모바일: 카드 맨 아래 */}
              <div className="order-3 flex flex-col gap-3 sm:hidden">
                <JourneyNavFooter
                  chapterLabel={chapter.label}
                  subProgress={subProgress}
                  isAtStart={isAtStart}
                  isAtEnd={isAtEnd}
                  showVerifyClosingNote={showVerifyClosingNote}
                  showThreatClosingNote={showThreatClosingNote}
                  onPrev={sim.goPrev}
                  onNext={sim.goNext}
                  onRestart={sim.restart}
                />
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
