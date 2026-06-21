import { journeyPhases } from "@/data/story-journey";

export function StoryJourneyStrip() {
  return (
    <section className="border-b border-slate-100 bg-[#F8F9FA] py-6">
      <div className="zt-container">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-slate-400">
          스크롤 순서 = 실제 작업 순서
        </p>
        <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {journeyPhases.map((phase, i) => (
            <li key={phase.label} className="flex items-center gap-2 sm:gap-3">
              <a
                href={`#${phase.anchor}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs shadow-[0_4px_16px_-4px_rgba(15,23,42,0.08)] transition hover:shadow-[0_8px_24px_-6px_rgba(37,99,235,0.12)] sm:px-4 sm:text-sm"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                  {phase.step}
                </span>
                <span className="font-medium text-[#212529]">{phase.label}</span>
              </a>
              {i < journeyPhases.length - 1 ? (
                <span className="hidden text-slate-300 sm:inline" aria-hidden>
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
