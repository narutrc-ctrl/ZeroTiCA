import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  caseById,
  communicationCategories,
  customerOutcomeBlocks,
  casesByCategory,
} from "@/data/customer-value-examples";
import { TaskCaseStudyCard } from "@/components/TaskCaseStudyCard";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { cn } from "@/lib/cn";

export function CustomerOutcomesSection() {
  const [expanded, setExpanded] = useState(false);
  const visibleBlocks = expanded ? customerOutcomeBlocks : customerOutcomeBlocks.slice(0, 2);

  return (
    <section id="outcomes" className="border-b border-slate-100 bg-slate-950 text-white">
      <div className="zt-container-wide zt-section">
        <RevealOnScroll variant="fade-up">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">고객 가치</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl [word-break:keep-all]">고객이 얻는 것</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">
            실제 RUNA 업무(Task)에서 반복되는 패턴입니다. 알지 못했던 통신, 정리가 필요한 통신, 있으면 안 되는
            통신을 구분해 기록·조치·재탐지까지 이어집니다.
          </p>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {communicationCategories.map((cat, i) => (
            <RevealOnScroll key={cat.id} delay={i * 80} variant="scale">
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold">{cat.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">{cat.lead}</p>
                <ul className="mt-4 space-y-2">
                  {casesByCategory(cat.id)
                    .slice(0, expanded ? 5 : 2)
                    .map((c) => (
                      <li key={c.id} className="text-sm text-slate-300">
                        <span className="font-medium text-cyan-400">·</span> {c.taskTitle.split(" 문의")[0]}
                      </li>
                    ))}
                </ul>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-16 space-y-12">
          {visibleBlocks.map((block, i) => (
            <RevealOnScroll key={block.title} delay={i * 60} variant="fade-left">
              <div>
                <h3 className="text-2xl font-bold">{block.title}</h3>
                <p className="mt-2 max-w-3xl text-base text-slate-400">{block.body}</p>
                <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                  {block.caseIds.slice(0, expanded ? undefined : 2).map((id) => {
                    const study = caseById(id);
                    return study ? <TaskCaseStudyCard key={id} study={study} compact /> : null;
                  })}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10",
            )}
          >
            {expanded ? (
              <>
                요약만 보기 <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                대표 사례·심화 내용 더 보기 <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
