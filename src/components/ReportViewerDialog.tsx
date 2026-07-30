import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/BrandLogo";
import {
  demoAdEnvironmentSummary,
  demoAdOperationalRows,
  demoReportPages,
  demoReportOverview,
  demoReportThreatSummary,
  demoStageSummaryRows,
} from "@/data/demo-runa-data";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  period: string;
};

export function ReportViewerDialog({ open, onClose, title, period }: Props) {
  const [zoom, setZoom] = useState(100);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-slate-900/60">
      <div className="flex h-14 shrink-0 items-center justify-end border-b border-slate-700 bg-slate-900 px-4 text-white">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-slate-800"
            onClick={() => setZoom((z) => Math.max(70, z - 10))}
            aria-label="축소"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-xs tabular-nums">{zoom}%</span>
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-slate-800"
            onClick={() => setZoom((z) => Math.min(130, z + 10))}
            aria-label="확대"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div data-tour="report-preview" className="flex flex-1 items-start justify-center overflow-auto p-6">
        <div
          className="relative w-full max-w-[210mm] origin-top rounded-lg border border-slate-200 bg-white shadow-2xl"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <button
            type="button"
            className="absolute right-3 top-3 z-20 rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50"
            onClick={onClose}
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="p-10 text-sm leading-relaxed text-slate-800">
            <section className="flex min-h-[250mm] flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-blue-600">침해 평가 보고서</p>
                  <h1 className="mt-2 text-3xl font-extrabold text-zinc-800">{title}</h1>
                  <p className="mt-1 text-slate-500">{period}</p>
                </div>
                <BrandMark size="lg" />
              </div>
              <div className="my-6 h-px bg-blue-500" />
              <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-base font-bold text-zinc-800">목차</h2>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-700">
                  {demoReportPages.toc.map((toc) => (
                    <li key={toc}>{toc}</li>
                  ))}
                </ol>
              </div>
            </section>

            <div className="my-8 border-t border-dashed border-slate-300" />

            <section className="min-h-[250mm]">
              <h2 className="text-base font-bold text-zinc-800">1. 침해 평가 개요</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
                <li>분석 기간: {demoReportOverview.period}</li>
                <li>분석 목적: {demoReportOverview.purpose}</li>
                <li>분석 대상: {demoReportOverview.target}</li>
                <li>투입 인력: {demoReportOverview.personnel}</li>
              </ul>

              <h2 className="mt-8 text-base font-bold text-zinc-800">2. 단계별 요약</h2>
              <div className="mt-3 overflow-hidden rounded border border-[#f0f4fa] text-xs">
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

              <h2 className="mt-8 text-base font-bold text-zinc-800">3. 위협 분석 결과</h2>
              <ul data-tour="report-threat-summary" className="mt-3 space-y-4 text-sm">
                {demoReportThreatSummary.map((item, i) => (
                  <li key={item.title}>
                    <p className="font-semibold text-zinc-800">
                      {i + 1}) {item.title} <span className="font-normal text-slate-400">({item.date})</span>
                    </p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-slate-600">
                      <li>이슈·원인: {item.cause}</li>
                      <li>결과·상태: {item.outcome}</li>
                    </ul>
                  </li>
                ))}
              </ul>
            </section>

            <div className="my-8 border-t border-dashed border-slate-300" />

            <section className="min-h-[250mm]">
              <h2 className="text-base font-bold text-zinc-800">4. AD 인증 환경 관측</h2>
              <p className="mt-2 text-slate-600">
                Domain/Site/DC 구조 및 Kerberos 인증 통신 관측 결과를 월간 관점에서 정리했습니다.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                <div className="rounded border border-slate-200 bg-white p-2 text-center">
                  <p className="text-[11px] text-slate-500">관측 DC</p>
                  <p className="text-lg font-bold text-slate-800">{demoAdEnvironmentSummary.totalDc}</p>
                </div>
                <div className="rounded border border-emerald-200 bg-emerald-50 p-2 text-center">
                  <p className="text-[11px] text-emerald-700">Kerberos 확인</p>
                  <p className="text-lg font-bold text-emerald-700">{demoAdEnvironmentSummary.activeDc}</p>
                </div>
                <div className="rounded border border-amber-200 bg-amber-50 p-2 text-center">
                  <p className="text-[11px] text-amber-700">DNS에서만 확인</p>
                  <p className="text-lg font-bold text-amber-700">{demoAdEnvironmentSummary.dnsOnlyDc}</p>
                </div>
                <div className="rounded border border-slate-200 bg-white p-2 text-center">
                  <p className="text-[11px] text-slate-500">IP 미확인</p>
                  <p className="text-lg font-bold text-slate-700">{demoAdEnvironmentSummary.unknownIpDc}</p>
                </div>
              </div>
              <div className="mt-4 rounded border border-slate-200">
                <table className="w-full border-collapse text-xs">
                  <thead className="bg-slate-50 text-left text-slate-500">
                    <tr>
                      <th className="px-2 py-1.5">항목</th>
                      <th className="px-2 py-1.5">상태</th>
                      <th className="px-2 py-1.5">요약</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoAdOperationalRows.map((row) => (
                      <tr key={row.item} className="border-t border-slate-100">
                        <td className="px-2 py-1.5 text-slate-700">{row.item}</td>
                        <td className="px-2 py-1.5 font-semibold text-slate-800">{row.status}</td>
                        <td className="px-2 py-1.5 text-slate-600">{row.summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="mt-8 text-base font-bold text-zinc-800">5. 권장 조치 및 후속 계획</h2>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-slate-700">
                {demoReportPages.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>

              <h3 className="mt-8 text-sm font-semibold text-zinc-800">Executive Summary</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
                {demoReportPages.executiveSummary.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
