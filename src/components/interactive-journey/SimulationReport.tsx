import { BrandMark } from "@/components/BrandLogo";
import { demoStageSummaryRows } from "@/data/demo-runa-data";
import { incident, reportMeta, threatIncident } from "@/data/issue-story";
import { cn } from "@/lib/cn";

type Props = {
  highlightNormal?: boolean;
  highlightThreat?: boolean;
};

export function SimulationReport({ highlightNormal = true, highlightThreat = true }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xl">
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-blue-600">침해 평가 보고서</p>
            <h3 className="mt-1 text-lg font-extrabold text-zinc-800">{reportMeta.title}</h3>
            <p className="text-xs text-slate-500">{reportMeta.period}</p>
          </div>
          <BrandMark size="sm" />
        </div>
      </div>

      <div className="space-y-6 p-5 text-xs leading-relaxed text-slate-800 sm:text-sm">
        <section>
          <h4 className="font-bold text-zinc-800">01. 침해 평가 개요</h4>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-600">
            <li>분석 기간: {reportMeta.period}</li>
            <li>분석 목적: {reportMeta.purpose}</li>
            <li>분석 대상: {reportMeta.target}</li>
            <li>투입 인력: {reportMeta.personnel}</li>
          </ul>
        </section>

        <section>
          <h4 className="font-bold text-zinc-800">02. 침해 평가 결과 (STAGE별)</h4>
          <div className="mt-2 overflow-hidden rounded border border-[#f0f4fa] text-[11px]">
            <div className="grid grid-cols-4 bg-[#f7fbfe] font-medium text-[#898989]">
              <div className="p-2">STAGE</div>
              <div className="p-2 text-center">발생</div>
              <div className="p-2 text-center">의심</div>
              <div className="p-2 text-center">유효</div>
            </div>
            {demoStageSummaryRows.map((row) => (
              <div key={row.stage} className="grid grid-cols-4 border-t border-[#f0f4fa]">
                <div className="p-2">{row.stage}</div>
                <div className="p-2 text-center">{row.events}</div>
                <div className="p-2 text-center text-amber-600">{row.suspected}</div>
                <div className="p-2 text-center text-red-700">{row.valid}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="font-bold text-zinc-800">03. 위협 분석 결과 요약</h4>
          <p className="mt-1 text-slate-500">이번 달 의심 통신 검증 결과 · 주요 확인 요청</p>

          <div
            className={cn(
              "mt-3 rounded-xl border p-4 transition-all",
              highlightNormal ? "sim-report-highlight border-blue-200 bg-blue-50/50" : "border-slate-100 bg-slate-50",
            )}
          >
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
              사례 A · 에이전트 통신(패킷/바이트)
            </span>
            <p className="mt-2 font-semibold text-zinc-800">
              1) {incident.title}{" "}
              <span className="font-normal text-slate-400">(2026-05-12)</span>
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-600">
              <li>이슈·원인: {incident.reportCause}</li>
              <li>결과·상태: {incident.reportOutcome}</li>
            </ul>
            <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              {incident.reportVerdict}
            </span>
          </div>

          <div
            className={cn(
              "mt-3 rounded-xl border p-4 transition-all",
              highlightThreat ? "sim-report-highlight border-red-200 bg-red-50/40" : "border-slate-100 bg-slate-50",
            )}
          >
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
              사례 B · 목적지 연결 거절 이상
            </span>
            <p className="mt-2 font-semibold text-zinc-800">
              2) {threatIncident.title}{" "}
              <span className="font-normal text-slate-400">(2026-05-21)</span>
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-600">
              <li>이슈·원인: {threatIncident.reportCause}</li>
              <li>결과·상태: {threatIncident.reportOutcome}</li>
            </ul>
            <span className="mt-2 inline-block rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold text-red-700">
              {threatIncident.reportVerdict}
            </span>
          </div>
        </section>

        <section className="rounded-lg bg-slate-50 p-3">
          <p className="font-semibold text-slate-800">정상 / 위협 / 완료 요약</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center">
              <p className="text-[10px] text-slate-500">정상 검증</p>
              <p className="text-lg font-bold text-emerald-700">9</p>
            </div>
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-center">
              <p className="text-[10px] text-slate-500">주의</p>
              <p className="text-lg font-bold text-amber-700">2</p>
            </div>
            <div className="rounded-lg bg-red-50 px-3 py-2 text-center">
              <p className="text-[10px] text-slate-500">위협·완료</p>
              <p className="text-lg font-bold text-red-700">1</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
