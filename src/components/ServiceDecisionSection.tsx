import { Check } from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { serviceDecision, services } from "@/data/content";
import { cn } from "@/lib/cn";

export function ServiceDecisionSection() {
  return (
    <section id="choose" className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="zt-container-hero zt-section">
        <RevealOnScroll>
          <p className="text-[16px] font-semibold text-blue-600">서비스 선택</p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-800 sm:text-4xl [word-break:keep-all]">
            {serviceDecision.title}
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">{serviceDecision.lead}</p>
        </RevealOnScroll>

        <div className="mt-10">
          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((svc, i) => (
              <RevealOnScroll key={svc.id} delay={i * 100} variant="scale">
                <article
                  className={cn(
                    "relative h-full overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg",
                    svc.id === "watch" ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-200",
                  )}
                >
                  {svc.id === "watch" && (
                    <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
                      추천
                    </span>
                  )}
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{svc.tagline}</p>
                  <h3 className="mt-2 text-2xl font-bold text-zinc-800">{svc.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{svc.description}</p>
                  <ul className="mt-4 space-y-2">
                    {svc.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-sm text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={120} className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4 font-medium text-slate-500" />
                  <th className="py-3 px-4 font-semibold text-zinc-800">Insight</th>
                  <th className="py-3 pl-4 font-semibold text-blue-700">Watch</th>
                </tr>
              </thead>
              <tbody>
                {serviceDecision.compare.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium text-slate-500">{row.label}</td>
                    <td className="py-3 px-4 text-slate-700">{row.insight}</td>
                    <td className="py-3 pl-4 font-medium text-zinc-800">{row.watch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
