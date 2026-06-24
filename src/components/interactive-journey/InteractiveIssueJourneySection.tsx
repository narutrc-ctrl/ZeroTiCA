import { Play, RotateCcw, SkipForward } from "lucide-react";
import {
  chapterForPhase,
  getCaseLabel,
  getSimulationNarrative,
  simulationIntro,
  storyChapters,
} from "@/data/issue-story";
import { SimulationChapterIndex, SimulationStage } from "@/components/interactive-journey/SimulationStage";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { useIssueSimulation } from "@/hooks/useIssueSimulation";
import { cn } from "@/lib/cn";

export function InteractiveIssueJourneySection() {
  const sim = useIssueSimulation();
  const { started, activeCase, phase, progress } = sim;
  const chapterIdx = started ? chapterForPhase(phase) : -1;
  const chapterLabel = chapterIdx >= 0 ? storyChapters[chapterIdx]?.label : null;
  const narrative = started ? getSimulationNarrative(phase, activeCase) : null;
  const needsUserAction =
    narrative?.action &&
    ["click-card", "click-reply", "click-submit", "click-view-result", "click-next-case", "click-report"].includes(
      narrative.action,
    );

  const replyHint =
    activeCase === "threat" ? "업무 내용 확인 후 「조치 내용 답변하기」를 누르세요" : "업무 내용 확인 후 「맥락 답변하기」를 누르세요";

  const viewResultHint =
    activeCase === "threat"
      ? "분석팀의 조치 검증 결과를 확인하려면 「검증 결과 확인하기」를 누르세요"
      : "분석팀의 검증 결과를 확인하려면 「검증 결과 확인하기」를 누르세요";

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
          <div className="sim-journey-panel rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-sm sm:p-6 lg:p-8">
            {!started ? (
              <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:gap-10">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">미니 시뮬레이션</p>
                  <h3 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl [word-break:keep-all]">
                    {simulationIntro.title}
                    {simulationIntro.titleAccent}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {simulationIntro.description}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">정상 검증 사례와 위험 통신 사례를 순서대로 체험합니다.</p>
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
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
                    <p className="text-sm font-medium text-slate-500">
                      탐지 · 분석 · 알림 · 협업 · 완료를 두 가지 사례로 체험합니다
                    </p>
                    <p className="mt-2 text-xs text-slate-400">사례 1 정상 검증 → 사례 2 위험 통신·조치 검증 → 보고서</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
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

                <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-10 xl:gap-12">
                  <div className="min-w-0">
                    {narrative ? (
                      <div
                        key={`${activeCase}-${phase}`}
                        className="sim-narrative-in rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 sm:p-7"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                          {phase !== "report" ? getCaseLabel(activeCase) : "월간 보고서"}
                          {chapterLabel ? ` · ${chapterLabel}` : ""}
                        </p>
                        <h3 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl [word-break:keep-all]">
                          {narrative.title}
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{narrative.body}</p>

                        {needsUserAction ? (
                          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3">
                            <p className="text-sm font-semibold text-blue-800">
                              {narrative.action === "click-card" && "오른쪽 「업무 요청」 칸반 카드를 클릭하세요"}
                              {narrative.action === "click-reply" && replyHint}
                              {narrative.action === "click-submit" &&
                                (activeCase === "threat"
                                  ? "조치 내용이 입력되면 「답변 등록」을 누르세요"
                                  : "답변이 입력되면 「답변 등록」을 누르세요")}
                              {narrative.action === "click-view-result" && viewResultHint}
                              {narrative.action === "click-next-case" &&
                                "이어서 위험 통신 사례를 체험하려면 「위험 통신 사례 이어서 보기」를 누르세요"}
                              {narrative.action === "click-report" &&
                                "두 사례 결과를 보고서에서 확인하려면 「보고서에서 확인하기」를 누르세요"}
                            </p>
                          </div>
                        ) : (
                          <p className={cn("mt-5 text-sm text-slate-400", phase === "analyst" && "flex items-center gap-2")}>
                            {phase === "analyst" ? (
                              <>
                                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                                분석이 진행 중입니다…
                              </>
                            ) : phase === "verifying" ? (
                              activeCase === "threat"
                                ? "분석팀이 고객 조치 결과를 검증 중입니다…"
                                : "분석팀이 업무 맥락을 검증 중입니다…"
                            ) : phase === "report" ? (
                              <button
                                type="button"
                                onClick={sim.restart}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                              >
                                <RotateCcw className="h-4 w-4" />
                                처음부터 다시 체험
                              </button>
                            ) : (
                              "잠시만 기다려 주세요…"
                            )}
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <div key={`${activeCase}-${phase}-${sim.analystStep}-${sim.sheetOpen}`} className="sim-stage-in">
                      <SimulationStage sim={sim} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** @deprecated InteractiveIssueJourneySection 사용 */
export { InteractiveIssueJourneySection as InteractiveJourneySection };
