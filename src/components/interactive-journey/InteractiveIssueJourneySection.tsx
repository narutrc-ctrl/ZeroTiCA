import { Play, RotateCcw, SkipForward } from "lucide-react";
import {
  chapterForPhase,
  getCaseLabel,
  getSimulationNarrative,
  simulationIntro,
  storyChapters,
  type NarrativeAction,
  type SimCase,
} from "@/data/issue-story";
import {
  SimulationCtaBar,
  SimulationNarrativeCard,
  SimulationStartPreview,
  getWaitingLabel,
} from "@/components/interactive-journey/SimulationConsole";
import { SimulationChapterIndex, SimulationStage } from "@/components/interactive-journey/SimulationStage";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { useIssueSimulation } from "@/hooks/useIssueSimulation";
import { cn } from "@/lib/cn";

const USER_ACTIONS: NarrativeAction[] = [
  "click-card",
  "click-reply",
  "click-submit",
  "click-next-case",
  "click-report",
];

function getCtaLabel(actionType: NarrativeAction | undefined, activeCase: SimCase): string | null {
  switch (actionType) {
    case "click-card":
      return "오른쪽 강조된 「업무 확인」 카드를 클릭하세요";
    case "click-reply":
      return activeCase === "threat"
        ? "Sheet 하단 「조치 내용 답변하기」를 누르세요"
        : "Sheet 하단 「맥락 답변하기」를 누르세요";
    case "click-submit":
      return activeCase === "threat"
        ? "조치 내용 입력 후 「답변 등록」을 누르세요"
        : "답변 입력 후 「답변 등록」을 누르세요";
    case "click-next-case":
      return "오른쪽 「위험 통신 사례 이어서 보기」를 누르세요";
    case "click-report":
      return "오른쪽 「보고서에서 확인하기」를 누르세요";
    default:
      return null;
  }
}

export function InteractiveIssueJourneySection() {
  const sim = useIssueSimulation();
  const { started, activeCase, phase, progress } = sim;
  const chapterIdx = started ? chapterForPhase(phase) : -1;
  const chapterLabel = chapterIdx >= 0 ? storyChapters[chapterIdx]?.label : null;
  const narrative = started ? getSimulationNarrative(phase, activeCase) : null;
  const actionType = narrative?.actionType;
  const needsUserAction = actionType && USER_ACTIONS.includes(actionType);
  const isAutoPhase = started && !needsUserAction && phase !== "report";
  const ctaLabel = needsUserAction ? getCtaLabel(actionType, activeCase) : null;

  return (
    <section
      id="journey"
      className="relative min-h-[120vh] border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="zt-container-hero px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <p className="text-sm font-semibold text-blue-600">{simulationIntro.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl [word-break:keep-all]">
            {simulationIntro.title}
            <span className="text-blue-600"> {simulationIntro.titleAccent}</span>
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {simulationIntro.coreMessage}
          </p>
        </RevealOnScroll>

        <div className="sim-journey-sticky mt-10">
          <div className="sim-journey-panel rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-sm sm:p-6">
            {!started ? (
              <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:gap-8">
                <div className="flex min-w-0 flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">미니 시뮬레이션</p>
                    <h3 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl [word-break:keep-all]">
                      {simulationIntro.title}
                      {simulationIntro.titleAccent}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{simulationIntro.description}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={sim.startSimulation}
                      className="sim-click-cue-target inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-500"
                    >
                      <Play className="h-4 w-4" />
                      {simulationIntro.startCta}
                    </button>
                    <button
                      type="button"
                      onClick={sim.jumpToReport}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <SkipForward className="h-4 w-4" />
                      보고서부터 보기
                    </button>
                  </div>
                </div>
                <div className="min-w-0">
                  <SimulationStartPreview />
                </div>
              </div>
            ) : (
              <div className="flex min-h-[520px] flex-col">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {chapterLabel ? (
                      <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                        {chapterIdx + 1}/6 {chapterLabel}
                      </span>
                    ) : null}
                    {phase !== "report" ? (
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                          activeCase === "threat" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {getCaseLabel(activeCase)}
                      </span>
                    ) : null}
                    <SimulationChapterIndex phase={phase} />
                  </div>
                  {phase !== "report" ? (
                    <button
                      type="button"
                      onClick={sim.jumpToReport}
                      className="text-xs text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
                    >
                      건너뛰기 · 보고서
                    </button>
                  ) : null}
                </div>

                <div className="h-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-[width] duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-6 grid min-h-0 flex-1 items-stretch gap-6 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:gap-8">
                  <div className="flex min-w-0 flex-col gap-3">
                    {narrative ? (
                      <SimulationNarrativeCard
                        key={`${activeCase}-${phase}`}
                        caseLabel={phase !== "report" ? getCaseLabel(activeCase) : "월간 보고서"}
                        chapterLabel={chapterLabel ?? undefined}
                        situation={narrative.situation}
                        why={narrative.why}
                        action={narrative.action}
                        note={narrative.note}
                      />
                    ) : null}

                    {phase === "report" ? (
                      <button
                        type="button"
                        onClick={sim.restart}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                      >
                        <RotateCcw className="h-4 w-4" />
                        처음부터 다시 체험
                      </button>
                    ) : (
                      <SimulationCtaBar
                        waiting={isAutoPhase}
                        waitingLabel={getWaitingLabel(phase, activeCase)}
                      >
                        {ctaLabel}
                      </SimulationCtaBar>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div key={`${activeCase}-${phase}-${sim.analystStep}-${sim.sheetOpen}`} className="sim-stage-in h-full">
                      <SimulationStage sim={sim} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** @deprecated InteractiveIssueJourneySection 사용 */
export { InteractiveIssueJourneySection as InteractiveJourneySection };
