import { RotateCcw } from "lucide-react";
import { chapterForPhase, simulationIntro, simulationNarrative, storyChapters } from "@/data/issue-story";
import { SimulationChapterIndex, SimulationStage } from "@/components/interactive-journey/SimulationStage";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { useIssueSimulation } from "@/hooks/useIssueSimulation";
import { cn } from "@/lib/cn";

export function InteractiveIssueJourneySection() {
  const sim = useIssueSimulation();
  const { phase, progress } = sim;
  const narrative = simulationNarrative[phase];
  const needsUserAction = ["click-card", "click-reply", "click-submit", "click-complete"].includes(
    narrative.action ?? "",
  );

  return (
    <section id="journey" className="relative border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="zt-container-hero zt-section">
        <RevealOnScroll>
          <p className="text-sm font-semibold text-blue-600">{simulationIntro.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl [word-break:keep-all]">
            {simulationIntro.title}
            <span className="text-blue-600"> {simulationIntro.titleAccent}</span>
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">{simulationIntro.lead}</p>
        </RevealOnScroll>

        <div className="mt-8 overflow-x-auto pb-1">
          <SimulationChapterIndex phase={phase} />
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-10 xl:gap-12">
          <div className="min-w-0 lg:sticky lg:top-24">
            <div key={phase} className="sim-narrative-in rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                {storyChapters[chapterForPhase(phase)]?.label}
              </p>
              <h3 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl [word-break:keep-all]">
                {narrative.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{narrative.body}</p>

              {needsUserAction ? (
                <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3">
                  <p className="text-sm font-semibold text-blue-800">
                    {narrative.action === "click-card" && "오른쪽 칸반에서 업무 카드를 클릭하세요"}
                    {narrative.action === "click-reply" && "업무 내용 확인 후 「맥락 답변하기」를 누르세요"}
                    {narrative.action === "click-submit" && "답변이 입력되면 「답변 등록」을 누르세요"}
                    {narrative.action === "click-complete" && "분석팀 회신 확인 후 「업무 완료 처리」를 누르세요"}
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
                    "재검토가 완료되면 분석팀 회신이 표시됩니다…"
                  ) : phase === "report" ? (
                    <button
                      type="button"
                      onClick={sim.restart}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      처음부터 다시 체험
                    </button>
                  ) : phase === "monitoring" || phase === "anomaly" ? (
                    <button
                      type="button"
                      onClick={sim.skipToAnalyst}
                      className="text-sm text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
                    >
                      분석 단계로 건너뛰기
                    </button>
                  ) : (
                    "잠시만 기다려 주세요…"
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <div key={`${phase}-${sim.analystStep}`} className="sim-stage-in">
              <SimulationStage sim={sim} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** @deprecated InteractiveIssueJourneySection 사용 */
export { InteractiveIssueJourneySection as InteractiveJourneySection };
