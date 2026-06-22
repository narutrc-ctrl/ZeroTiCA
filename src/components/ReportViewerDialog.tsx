import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/BrandLogo";
import {
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
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-4 text-white">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-slate-400">{period}</p>
        </div>
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
          <button type="button" className="rounded-lg p-2 hover:bg-slate-800" onClick={onClose} aria-label="닫기">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div data-tour="report-preview" className="flex flex-1 items-start justify-center overflow-auto p-6">
        <div
          className="w-full max-w-[210mm] origin-top rounded-lg border border-slate-200 bg-white shadow-2xl"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <div className="p-10 text-sm leading-relaxed text-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-blue-600">침해 평가 보고서</p>
                <h1 className="mt-2 text-3xl font-extrabold text-slate-900">{title}</h1>
                <p className="mt-1 text-slate-500">{period}</p>
              </div>
              <BrandMark size="lg" />
            </div>
            <div className="my-6 h-px bg-blue-500" />

            <h2 className="text-base font-bold text-slate-900">01. 침해 평가 개요</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
              <li>분석 기간: {demoReportOverview.period}</li>
              <li>분석 목적: {demoReportOverview.purpose}</li>
              <li>분석 대상: {demoReportOverview.target}</li>
              <li>투입 인력: {demoReportOverview.personnel}</li>
            </ul>

            <h2 className="mt-8 text-base font-bold text-slate-900">02. 침해 평가 결과</h2>
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

            <div data-tour="report-threat-summary" className="mt-8">
              <h2 className="text-base font-bold text-slate-900">03. 위협 분석 결과 요약</h2>
              <ul className="mt-3 space-y-4 text-sm">
                {demoReportThreatSummary.map((item, i) => (
                  <li key={item.title}>
                    <p className="font-semibold text-slate-900">
                      {i + 1}) {item.title} <span className="font-normal text-slate-400">({item.date})</span>
                    </p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-slate-600">
                      <li>이슈·원인: {item.cause}</li>
                      <li>결과·상태: {item.outcome}</li>
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
