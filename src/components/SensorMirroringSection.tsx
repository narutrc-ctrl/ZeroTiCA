import { ArrowRight } from "lucide-react";
import { sensorCollectionSection } from "@/data/sensor-collection";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SensorIngestionPreview } from "@/components/SensorIngestionPreview";
import { StoryStepHeader } from "@/components/StoryStepHeader";

export function SensorMirroringSection() {
  return (
    <section id="collect" className="border-b border-slate-200 bg-white">
      <div className="zt-container zt-section">
        <RevealOnScroll>
          <StoryStepHeader
            step="01"
            eyebrow={sensorCollectionSection.eyebrow}
            title={sensorCollectionSection.title}
            titleAccent={sensorCollectionSection.titleAccent}
            lead={sensorCollectionSection.lead}
          />
        </RevealOnScroll>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
          <RevealOnScroll delay={80}>
            <div className="space-y-6">
              {sensorCollectionSection.points.map((p) => (
                <div key={p.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="font-semibold text-slate-900">{p.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
                </div>
              ))}

              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-5 text-sm">
                {sensorCollectionSection.flowSteps.map((s, i, arr) => (
                  <span key={s.label} className="flex items-center gap-2">
                    <span className="rounded-lg bg-white px-3 py-2 shadow-sm">
                      <span className="block font-medium text-slate-900">{s.label}</span>
                      <span className="text-xs text-slate-500">{s.sub}</span>
                    </span>
                    {i < arr.length - 1 ? <ArrowRight className="h-4 w-4 shrink-0 text-blue-400" /> : null}
                  </span>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={160}>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                RUNA에서 확인하는 화면
              </p>
              <SensorIngestionPreview />
              <p className="mt-3 text-xs text-slate-500">
                수집이 끊기면 분석·탐지도 멈춥니다. 그래서 센서 상태를 대시보드에서 먼저 봅니다.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
