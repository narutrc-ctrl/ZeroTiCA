import {
  caseById,
  communicationCategories,
  customerOutcomeBlocks,
  casesByCategory,
} from "@/data/customer-value-examples";
import { TaskCaseStudyCard } from "@/components/TaskCaseStudyCard";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export function CustomerOutcomesSection() {
  return (
    <section id="outcomes" className="border-b border-slate-100 bg-white">
      <div className="zt-container-wide zt-section">
        <RevealOnScroll>
          <h2 className="text-3xl font-bold text-[#212529] sm:text-4xl">고객이 얻는 것</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            실제 RUNA 업무(Task)에서 반복되는 패턴입니다. 알지 못했던 통신, 정리가 필요한 통신, 있으면 안 되는
            통신을 구분해 기록·조치·재탐지까지 이어집니다.
          </p>
        </RevealOnScroll>

        {/* 3가지 통신 분류 */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {communicationCategories.map((cat, i) => (
            <RevealOnScroll key={cat.id} delay={i * 80}>
              <div className="h-full rounded-2xl bg-[#F8F9FA] p-6">
                <h3 className="text-xl font-bold text-[#212529]">{cat.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{cat.lead}</p>
                <ul className="mt-4 space-y-2">
                  {casesByCategory(cat.id)
                    .slice(0, 3)
                    .map((c) => (
                      <li key={c.id} className="text-sm text-slate-700">
                        <span className="font-medium text-blue-700">·</span> {c.taskTitle.split(" 문의")[0]}
                      </li>
                    ))}
                </ul>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* 가치 블록 + 대표 사례 */}
        <div className="mt-16 space-y-12">
          {customerOutcomeBlocks.map((block, i) => (
            <RevealOnScroll key={block.title} delay={i * 60}>
              <div>
                <h3 className="text-2xl font-bold text-[#212529]">{block.title}</h3>
                <p className="mt-2 max-w-3xl text-base text-slate-600">{block.body}</p>
                <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                  {block.caseIds.map((id) => {
                    const study = caseById(id);
                    return study ? <TaskCaseStudyCard key={id} study={study} compact /> : null;
                  })}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
