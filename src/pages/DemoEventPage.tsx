import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar } from "lucide-react";
import { MockRunaShell, RunaPageTabs } from "@/components/MockRunaShell";
import { ReportViewerDialog } from "@/components/ReportViewerDialog";
import { cn } from "@/lib/cn";
import {
  DEMO_DATE_RANGE,
  demoReports,
  demoStageEventRows,
  demoStageSummaryRows,
} from "@/data/demo-runa-data";

const SIDEBAR_ITEMS = [
  { key: "overview", label: "현황", active: true },
  { key: "outbound", label: "1단계: 아웃바운드" },
  { key: "inbound", label: "2단계: 인바운드" },
  { key: "lateral", label: "3단계: 측면이동" },
];

export function DemoEventPage() {
  const [params, setParams] = useSearchParams();
  const [reportOpen, setReportOpen] = useState(false);
  const tab = params.get("tab") === "reports" ? "reports" : "stage-summary";
  const tour = params.get("tour");
  const step = Number(params.get("step") ?? 0);

  useEffect(() => {
    if (tab === "reports" && tour && step >= 6) {
      setReportOpen(true);
    }
  }, [tab, tour, step]);

  const setTab = (id: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (id === "reports") next.set("tab", "reports");
      else next.delete("tab");
      return next;
    });
  };

  const report = demoReports[0];

  return (
    <MockRunaShell>
      <div className="runa-page">
        <RunaPageTabs
          tabs={[
            { id: "stage-summary", label: "단계별 요약" },
            { id: "reports", label: "침해 평가 보고서" },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab === "stage-summary" ? (
          <div className="flex min-h-0 flex-1">
            <aside
              data-tour="event-sidebar"
              className="w-[270px] shrink-0 border-r border-slate-200 bg-white p-4"
            >
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                {DEMO_DATE_RANGE.start} ~ {DEMO_DATE_RANGE.end}
              </div>
              <div className="space-y-1">
                {SIDEBAR_ITEMS.map((item) => (
                  <div
                    key={item.key}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-sm",
                      item.active
                        ? "bg-blue-50 font-medium text-blue-600"
                        : "text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </aside>

            <div className="min-w-0 flex-1 space-y-4 p-4">
              <div data-tour="event-table" className="runa-card overflow-hidden">
                <div className="border-b border-slate-200 px-4 py-3">
                  <h2 className="text-sm font-semibold text-slate-900">Stage별 집계</h2>
                </div>
                <table className="runa-table">
                  <thead>
                    <tr>
                      <th>Stage</th>
                      <th className="text-center">발생 이벤트</th>
                      <th className="text-center">위협 의심</th>
                      <th className="text-center">유효 위협</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoStageSummaryRows.map((row) => (
                      <tr key={row.stage} className="hover:bg-slate-50">
                        <td className="font-medium text-slate-800">{row.stage}</td>
                        <td className="text-center tabular-nums">{row.events}</td>
                        <td className="text-center tabular-nums text-amber-600">{row.suspected}</td>
                        <td className="text-center tabular-nums text-red-700">{row.valid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="runa-card overflow-hidden">
                <div className="border-b border-slate-200 px-4 py-3">
                  <h2 className="text-sm font-semibold text-slate-900">이벤트별 상세 (현황)</h2>
                </div>
                <table className="runa-table">
                  <thead>
                    <tr>
                      <th>이벤트</th>
                      <th>Stage</th>
                      <th className="text-center">발생</th>
                      <th className="text-center">위협 의심</th>
                      <th className="text-center">유효 위협</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoStageEventRows.map((row) => (
                      <tr key={row.event} className="hover:bg-slate-50">
                        <td className="font-medium text-slate-800">{row.event}</td>
                        <td className="text-slate-600">{row.stage}</td>
                        <td className="text-center tabular-nums">{row.events}</td>
                        <td className="text-center tabular-nums text-amber-600">{row.suspected}</td>
                        <td className="text-center tabular-nums text-red-700">{row.valid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div data-tour="report-list" className="runa-card overflow-hidden">
              <div className="border-b border-slate-200 px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-900">저장된 침해 평가 보고서</h2>
                <p className="mt-1 text-xs text-slate-500">행을 클릭하면 실제 서비스와 같이 전체 화면 뷰어가 열립니다.</p>
              </div>
              <table className="runa-table">
                <thead>
                  <tr>
                    <th>기간</th>
                    <th>제목</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {demoReports.map((r) => (
                    <tr
                      key={r.period}
                      className="cursor-pointer hover:bg-sky-50"
                      onClick={() => setReportOpen(true)}
                    >
                      <td className="font-medium">{r.period}</td>
                      <td className="text-blue-600">{r.title}</td>
                      <td className={r.statusClass}>{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ReportViewerDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title={report.title}
        period={report.period}
      />
    </MockRunaShell>
  );
}
