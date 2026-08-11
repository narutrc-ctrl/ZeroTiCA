import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar } from "lucide-react";
import { MockRunaShell, RunaPageTabs } from "@/components/MockRunaShell";
import { ReportViewerDialog } from "@/components/ReportViewerDialog";
import { cn } from "@/lib/cn";
import {
  demoAdActionItems,
  demoAdDcRows,
  demoAdDnsFailureTopQueries,
  demoAdEnvironmentSummary,
  demoAdFailingClients,
  demoAdKerberosCauseRows,
  demoAdNarrative,
  demoAdOperationalRows,
  DEMO_DATE_RANGE,
  demoReports,
  demoStageEventRows,
  demoStageSummaryRows,
} from "@/data/demo-runa-data";
import { useDemoTour } from "@/hooks/useDemoTour";

const SIDEBAR_ITEMS = [
  { key: "overview", label: "현황", active: true },
  { key: "outbound", label: "1단계: 아웃바운드" },
  { key: "inbound", label: "2단계: 인바운드" },
  { key: "lateral", label: "3단계: 측면이동" },
];

export function DemoEventPage() {
  const [params, setParams] = useSearchParams();
  const { active: tourActive, ui: tourUi } = useDemoTour();
  const [reportOpen, setReportOpen] = useState(false);
  const tab = params.get("tab") === "reports" ? "reports" : "stage-summary";

  useEffect(() => {
    if (!tourActive) return;
    setReportOpen(tourUi.reportDialogOpen);
  }, [tourActive, tourUi.reportDialogOpen]);

  const setTab = (id: string) => {
    if (tourActive) return;
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
                  <h2 className="text-sm font-semibold text-zinc-800">Stage별 집계</h2>
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
                  <h2 className="text-sm font-semibold text-zinc-800">이벤트별 상세 (현황)</h2>
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

              <div className="runa-card overflow-hidden">
                <div className="border-b border-slate-200 px-4 py-3">
                  <h2 className="text-sm font-semibold text-zinc-800">{demoAdEnvironmentSummary.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">{demoAdEnvironmentSummary.description}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{demoAdEnvironmentSummary.sampleNotice}</p>
                </div>
                <div className="grid gap-3 border-b border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-4">
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
                    <p className="text-[11px] text-slate-500">관측 DC</p>
                    <p className="text-lg font-bold text-zinc-800">{demoAdEnvironmentSummary.totalDc}</p>
                  </div>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-center">
                    <p className="text-[11px] text-emerald-700">Kerberos 확인</p>
                    <p className="text-lg font-bold text-emerald-700">{demoAdEnvironmentSummary.activeDc}</p>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center">
                    <p className="text-[11px] text-amber-700">DNS에서만 확인</p>
                    <p className="text-lg font-bold text-amber-700">{demoAdEnvironmentSummary.dnsOnlyDc}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
                    <p className="text-[11px] text-slate-500">IP 미확인</p>
                    <p className="text-lg font-bold text-slate-700">{demoAdEnvironmentSummary.unknownIpDc}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                    <p className="text-xs font-semibold text-blue-700">{demoAdNarrative.overallStatus}</p>
                    <p className="mt-1 text-xs text-slate-700">{demoAdNarrative.summary}</p>
                    <p className="mt-1 text-xs text-slate-600">{demoAdNarrative.why}</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Domain: <span className="font-mono">{demoAdEnvironmentSummary.domain}</span>
                    </p>
                  </div>

                  <h3 className="mb-2 text-xs font-semibold text-slate-700">운영 상태 요약</h3>
                  <table className="runa-table mb-4">
                    <thead>
                      <tr>
                        <th>항목</th>
                        <th>상태</th>
                        <th>요약</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoAdOperationalRows.map((row) => (
                        <tr key={row.item}>
                          <td className="font-medium text-slate-800">{row.item}</td>
                          <td>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                              {row.status}
                            </span>
                          </td>
                          <td className="text-slate-600">{row.summary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3 className="mb-2 text-xs font-semibold text-slate-700">DC 상세 샘플</h3>
                  <table className="runa-table">
                    <thead>
                      <tr>
                        <th>DC</th>
                        <th>IP</th>
                        <th>Site</th>
                        <th>상태</th>
                        <th className="text-center">로그인 통신</th>
                        <th className="text-center">실패율</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoAdDcRows.map((row) => (
                        <tr key={row.dc}>
                          <td className="font-medium text-slate-800">{row.dc}</td>
                          <td className="font-mono text-slate-600">{row.ip}</td>
                          <td className="text-slate-600">{row.site}</td>
                          <td>{row.status}</td>
                          <td className="text-center tabular-nums">{row.events.toLocaleString()}</td>
                          <td className="text-center">{row.failRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div>
                      <h3 className="mb-2 text-xs font-semibold text-slate-700">권장 확인</h3>
                      <ol className="space-y-2">
                        {demoAdActionItems.map((item) => (
                          <li key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                            <p className="text-xs font-semibold text-slate-800">
                              <span className="mr-1 rounded bg-white px-1.5 py-0.5 text-[11px] text-slate-600">
                                {item.priority}
                              </span>
                              {item.title}
                            </p>
                            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] text-slate-600">
                              {item.bullets.map((b) => (
                                <li key={b}>{b}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h3 className="mb-2 text-xs font-semibold text-slate-700">문제 클라이언트 IP</h3>
                      <table className="runa-table">
                        <thead>
                          <tr>
                            <th>IP</th>
                            <th>우선순위</th>
                            <th className="text-center">실패율</th>
                            <th>주요 원인</th>
                          </tr>
                        </thead>
                        <tbody>
                          {demoAdFailingClients.map((row) => (
                            <tr key={row.ip}>
                              <td className="font-mono text-slate-700">{row.ip}</td>
                              <td>{row.priority}</td>
                              <td className="text-center">{row.failRate}</td>
                              <td className="text-slate-600">{row.primaryCause}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 p-3">
                      <h3 className="mb-2 text-xs font-semibold text-slate-700">근거 데이터 · DNS 실패</h3>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {demoAdDnsFailureTopQueries.map((q) => (
                          <li key={q.query} className="flex items-center justify-between gap-2">
                            <code className="break-all text-[11px]">{q.query}</code>
                            <span className="tabular-nums text-slate-500">{q.count}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3">
                      <h3 className="mb-2 text-xs font-semibold text-slate-700">근거 데이터 · Kerberos 원인</h3>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {demoAdKerberosCauseRows.map((row) => (
                          <li key={row.code} className="flex items-center justify-between gap-2">
                            <span>
                              {row.title} <code className="text-[11px] text-blue-600">{row.code}</code>
                            </span>
                            <span className="tabular-nums text-slate-500">
                              {row.count.toLocaleString()} ({row.pct})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div data-tour="report-list" className="runa-card overflow-hidden">
              <div className="border-b border-slate-200 px-4 py-3">
                <h2 className="text-sm font-semibold text-zinc-800">저장된 침해 평가 보고서</h2>
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
                      onClick={() => {
                        if (tourActive && !tourUi.reportDialogOpen) return;
                        setReportOpen(true);
                      }}
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
        initialPage={tourActive ? tourUi.reportPage : 0}
      />
    </MockRunaShell>
  );
}
