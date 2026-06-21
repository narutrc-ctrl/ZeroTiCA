import { analysisPipeline, directionLabels } from "@/data/methodology";

/** STEP 02 전용 — 파이프라인 + 방향 칩 (밝은 테마, 테두리 없음) */
export function AnalyzePipelineStrip() {
  return (
    <div className="mt-10 space-y-6">
      <p className="text-sm font-bold text-[#212529]">주요 분석 프로세스</p>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {analysisPipeline.map((p) => (
          <li
            key={p.title}
            className="rounded-2xl bg-[#F8F9FA] px-4 py-4 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_28px_-6px_rgba(37,99,235,0.12)]"
          >
            <span className="text-lg font-bold text-blue-600">{p.step}</span>
            <p className="mt-1 text-sm font-semibold text-[#212529]">{p.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{p.body}</p>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        {directionLabels.map((d) => (
          <span
            key={d}
            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
