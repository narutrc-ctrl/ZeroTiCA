import { ArrowRight } from "lucide-react";
import { customerValueSection } from "@/data/content";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export function CustomerOutcomesSection() {
  const {
    eyebrow,
    title,
    titleAccent,
    lead,
    beforeLabel,
    afterLabel,
    closingBefore,
    closingAccent,
    closingAfter,
    rows,
  } = customerValueSection;

  return (
    <section id="outcomes" className="border-b border-slate-200/80 bg-white">
      <div className="zt-container-hero py-20 sm:py-28 lg:py-32">
        <RevealOnScroll variant="fade-up">
          <p className="text-[16px] font-bold tracking-wide text-primary">{eyebrow}</p>
          <h2 className="mt-[32px] max-w-[900px] text-[28px] font-extrabold leading-[1.35] tracking-tight [word-break:keep-all] sm:mt-[40px] sm:text-[36px] lg:text-[46px]">
            <span className="text-zinc-900">{title}</span>
            <br />
            <span className="text-primary">{titleAccent}</span>
          </h2>
          <p className="mt-4 w-full max-w-none text-[16px] leading-relaxed text-slate-500 sm:mt-5 sm:text-[18px] [word-break:keep-all]">
            {lead}
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={80} variant="fade-up">
          <div className="mt-[48px] rounded-[28px] bg-gradient-to-r from-white to-[#abd1ff] px-4 py-8 sm:mt-[64px] sm:rounded-[32px] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div className="mb-5 hidden grid-cols-[minmax(0,0.92fr)_auto_minmax(0,1.35fr)] items-end gap-4 px-1 sm:mb-6 sm:gap-5 md:grid lg:gap-6">
              <p className="pl-1 text-[13px] font-medium text-slate-400 sm:text-[14px]">
                {beforeLabel}
              </p>
              <span className="w-8 lg:w-10" aria-hidden />
              <p className="pl-1 text-[13px] font-semibold text-primary sm:text-[14px]">
                {afterLabel}
              </p>
            </div>

            <ul className="flex flex-col gap-5 sm:gap-6">
              {rows.map((row) => (
                <li
                  key={row.num}
                  className="grid grid-cols-1 items-center gap-3 md:grid-cols-[minmax(0,0.92fr)_auto_minmax(0,1.35fr)] md:gap-5 lg:gap-6"
                >
                  <p className="text-[12px] font-medium text-slate-400 md:hidden">{beforeLabel}</p>
                  <div className="flex min-h-[88px] items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-[0_8px_28px_rgba(59,130,246,0.08)] sm:gap-4 sm:px-5 sm:py-5">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold tabular-nums text-white sm:h-10 sm:w-10 sm:text-[13px]">
                      {row.num}
                    </span>
                    <p className="text-[15px] font-bold leading-snug tracking-tight text-zinc-900 [word-break:keep-all] sm:text-[17px]">
                      {row.before}
                    </p>
                  </div>

                  <div className="flex justify-center py-0.5 md:py-0" aria-hidden>
                    <ArrowRight className="h-5 w-5 rotate-90 text-primary md:h-6 md:w-6 md:rotate-0" />
                  </div>

                  <p className="text-[12px] font-semibold text-primary md:hidden">{afterLabel}</p>
                  <div className="rounded-2xl bg-white px-5 py-5 shadow-[0_8px_28px_rgba(59,130,246,0.08)] sm:px-6 sm:py-6">
                    <h3 className="text-[17px] font-bold leading-snug tracking-tight text-primary [word-break:keep-all] sm:text-[20px]">
                      {row.afterTitle}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-slate-500 [word-break:keep-all] sm:mt-2.5 sm:text-[15px]">
                      {row.afterBody}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={140} variant="fade-up">
          <div className="mt-16 flex flex-col items-center px-2 text-center sm:mt-20">
            <span
              className="mb-6 h-1 w-9 rounded-full bg-primary/35 sm:mb-7"
              aria-hidden
            />
            <p className="max-w-[720px] text-[20px] font-semibold leading-[1.45] tracking-[-0.01em] text-zinc-800 [word-break:keep-all] sm:text-[24px] lg:text-[28px]">
              {closingBefore}
              <br />
              <span className="text-primary">{closingAccent}</span>
              {closingAfter}
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
