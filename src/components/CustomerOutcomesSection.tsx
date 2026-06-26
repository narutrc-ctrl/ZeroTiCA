import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  customerValueZones,
  primaryOutcomeHighlight,
  type CustomerValueZone,
} from "@/data/customer-value-examples";
import { CaseStudySlider } from "@/components/CaseStudySlider";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { cn } from "@/lib/cn";

function CustomerValueZoneBlock({ zone, delay }: { zone: CustomerValueZone; delay: number }) {
  const [casesOpen, setCasesOpen] = useState(false);
  const collapsibleCases = zone.id === "threat";

  const slides = useMemo(
    () => zone.slideTabs.map(({ caseId, tabLabel }) => ({ caseId, tabLabel })),
    [zone],
  );

  const gridCols =
    zone.columns.length === 3 ? "lg:grid-cols-3" : zone.columns.length === 2 ? "lg:grid-cols-2" : "";

  return (
    <RevealOnScroll delay={delay} variant="fade-up">
      <div
        className={cn(
          "rounded-2xl border p-6 sm:p-8",
          zone.id === "threat"
            ? "border-red-500/15 bg-gradient-to-br from-red-950/20 via-slate-900/40 to-slate-950"
            : "border-cyan-500/15 bg-gradient-to-br from-cyan-950/15 via-slate-900/40 to-slate-950",
        )}
      >
        <div className="max-w-3xl">
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-wider",
              zone.id === "threat" ? "text-red-300/90" : "text-cyan-300/90",
            )}
          >
            {zone.id === "threat" ? "Threat analysis" : "Discovery & hygiene"}
          </p>
          <h3 className="mt-2 text-2xl font-bold sm:text-3xl [word-break:keep-all]">{zone.title}</h3>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-400 sm:text-base">
            {zone.lead.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className={cn("mt-8 grid gap-5", gridCols)}>
          {zone.columns.map((col) => (
            <div
              key={col.id}
              className="flex flex-col rounded-xl border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <h4 className="text-base font-bold text-white">{col.title}</h4>
                {col.subtitle ? (
                  <span className="text-xs font-medium text-slate-500">{col.subtitle}</span>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{col.description}</p>
              {col.hygieneNote ? (
                <p className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2.5 text-xs leading-relaxed text-slate-300">
                  {col.hygieneNote}
                </p>
              ) : null}
              <ul className="mt-4 flex-1 space-y-1.5">
                {col.bullets.map((bullet) => (
                  <li key={bullet.label} className="text-sm text-slate-300">
                    <span
                      className={cn(
                        "font-medium",
                        zone.id === "threat" ? "text-red-300/80" : "text-cyan-400",
                      )}
                    >
                      ·
                    </span>{" "}
                    {bullet.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-5">
          {collapsibleCases ? (
            <>
              <div
                className="mx-auto flex items-center bg-white/[0.04] flex justify-center px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white hover:cursor-pointer"
                onClick={() => setCasesOpen((open) => !open)}
                aria-expanded={casesOpen}
              >
                사례 확인
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-slate-500 transition-transform duration-200",
                    casesOpen && "rotate-180",
                  )}
                />
              </div>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300",
                  casesOpen ? "mt-8 grid-rows-[1fr]" : "mt-8 grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <CaseStudySlider slides={slides} />
                </div>
              </div>
            </>
          ) : (
            <>
              <CaseStudySlider slides={slides} />
            </>
          )}
        </div>
      </div>
    </RevealOnScroll>
  );
}

export function CustomerOutcomesSection() {
  const [threatZone, operationsZone] = customerValueZones;

  return (
    <section id="outcomes" className="border-b border-slate-100 bg-slate-950 text-white">
      <div className="zt-container-wide zt-section">
        <RevealOnScroll variant="fade-up">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">고객 가치</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl [word-break:keep-all]">
            {primaryOutcomeHighlight.title}
            <span className="text-cyan-400"> · {primaryOutcomeHighlight.titleAccent}</span>
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {primaryOutcomeHighlight.body}
          </p>
        </RevealOnScroll>

        <div className="mt-12 space-y-10 sm:mt-14 sm:space-y-12">
          {threatZone ? <CustomerValueZoneBlock zone={threatZone} delay={60} /> : null}
          {operationsZone ? <CustomerValueZoneBlock zone={operationsZone} delay={100} /> : null}
        </div>
      </div>
    </section>
  );
}
