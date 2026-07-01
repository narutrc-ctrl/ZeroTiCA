import { AppWindow, BarChart3, Calendar, ClipboardList } from "lucide-react";
import {
  DEMO_DATE_RANGE,
  demoAgentEventDetail,
  demoIocBatch,
  demoLongSessionPreview,
  demoStageEventRows,
  demoStageSummaryRows,
  demoTasks,
  demoWhitelistSampleRows,
  demoWhitelistTabs,
} from "@/data/demo-runa-data";
import { KanbanColumn, TaskCard, taskStatusClass } from "@/components/MockRunaShell";
import { BrandMark } from "@/components/BrandLogo";
import { cn } from "@/lib/cn";

export type MethodologyScreenId =
  | "event-detail-agent"
  | "long-session"
  | "task-and-whitelist"
  | "event-dashboard"
  | "ioc-batch";

const SCREEN_LABELS: Record<MethodologyScreenId, string> = {
  "event-detail-agent": "RUNA 대시보드 · 이벤트 상세 (에이전트 통신)",
  "long-session": "RUNA 분석 · 장시간 세션",
  "task-and-whitelist": "RUNA 이슈 관리 · 화이트리스트 설정",
  "event-dashboard": "RUNA 대시보드 · 단계별 요약",
  "ioc-batch": "RUNA 대시보드 · IOC 연결 이벤트",
};

function RunaPreviewShell({
  screenId,
  children,
}: {
  screenId: MethodologyScreenId;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-600 bg-white shadow-2xl">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="ml-1 truncate text-[11px] text-slate-500">{SCREEN_LABELS[screenId]}</span>
      </div>
      <div className="flex min-h-[280px]">
        <aside className="flex w-14 shrink-0 flex-col border-r border-slate-200 bg-[hsl(217,28%,15%)] py-3">
          <div className="mb-3 flex justify-center">
            <BrandMark size="sm" inverted />
          </div>
          <div className="flex flex-col items-center gap-2 px-1">
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl",
                screenId === "event-dashboard" || screenId === "event-detail-agent"
                  ? "bg-blue-500 text-white"
                  : "text-slate-400",
              )}
            >
              <AppWindow className="h-4 w-4" />
            </span>
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl",
                screenId === "task-and-whitelist" ? "bg-blue-500 text-white" : "text-slate-400",
              )}
            >
              <ClipboardList className="h-4 w-4" />
            </span>
          </div>
        </aside>
        <div className="min-w-0 flex-1 overflow-hidden bg-slate-50">{children}</div>
      </div>
    </div>
  );
}

function EventDetailAgentPreview() {
  const d = demoAgentEventDetail;
  const maxBytes = Math.max(...d.hourlyBytes);

  return (
    <RunaPreviewShell screenId="event-detail-agent">
      <div className="border-b border-slate-200 bg-white px-3 py-2">
        <p className="text-[11px] font-semibold text-slate-900">{d.eventName}</p>
        <p className="text-[10px] text-slate-500">
          {d.date} · {d.srcIp} → {d.dstIp}
        </p>
      </div>
      <div className="grid grid-cols-6 gap-2 p-2">
        {/* networkMap — front event-detail 2x2 */}
        <div className="col-span-2 row-span-2 rounded-lg border border-slate-200 bg-white p-2">
          <p className="mb-2 text-[10px] font-medium text-slate-500">networkMap</p>
          <div className="flex h-24 items-center justify-center gap-3">
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-mono text-blue-800">
              {d.srcIp}
            </div>
            <div className="h-px w-8 bg-slate-300" />
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-mono text-amber-800">
              {d.dstIp}
            </div>
          </div>
        </div>

        {/* bytesTimeline — front 4x1 */}
        <div className="col-span-4 rounded-lg border border-slate-200 bg-white p-2">
          <p className="mb-2 text-[10px] font-medium text-slate-500">bytesTimeline</p>
          <div className="flex h-16 items-end gap-1">
            {d.hourlyBytes.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-cyan-500/80"
                style={{ height: `${(v / maxBytes) * 100}%`, minHeight: 8 }}
              />
            ))}
          </div>
        </div>

        {/* bytesTraffic — front 4x1 */}
        <div className="col-span-4 rounded-lg border border-slate-200 bg-white p-2">
          <p className="mb-1 text-[10px] font-medium text-slate-500">bytesTraffic</p>
          <p className="text-[10px] text-slate-600">시간대별 src_bytes — 균일한 패턴</p>
        </div>

        {/* connDstAgentLogTable — front conn_log_view columns */}
        <div className="col-span-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <p className="border-b border-slate-100 px-2 py-1.5 text-[10px] font-medium text-slate-500">
            connDstAgentLogTable
          </p>
          <table className="w-full text-left text-[9px] text-slate-700">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {["datetime", "src_ip", "dst_ip", "dst_port", "service", "duration", "src_pkts", "src_bytes"].map(
                  (h) => (
                    <th key={h} className="whitespace-nowrap px-1.5 py-1 font-medium">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {d.connLogs.map((row) => (
                <tr key={row.datetime} className="border-t border-slate-100">
                  <td className="whitespace-nowrap px-1.5 py-1">{row.datetime}</td>
                  <td className="px-1.5 py-1 font-mono">{row.src_ip}</td>
                  <td className="px-1.5 py-1 font-mono">{row.dst_ip}</td>
                  <td className="px-1.5 py-1">{row.dst_port}</td>
                  <td className="px-1.5 py-1">{row.service}</td>
                  <td className="px-1.5 py-1">{row.duration}</td>
                  <td className="px-1.5 py-1 text-right">{row.src_pkts}</td>
                  <td className="px-1.5 py-1 text-right">{row.src_bytes.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RunaPreviewShell>
  );
}

function LongSessionPagePreview() {
  const d = demoLongSessionPreview;

  return (
    <RunaPreviewShell screenId="long-session">
      <div className="space-y-2 p-2">
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-600">
            <Calendar className="h-3 w-3" />
            {DEMO_DATE_RANGE.start} ~ {DEMO_DATE_RANGE.end}
          </span>
          <span className="rounded-lg bg-blue-600 px-2 py-1 text-white">Apply Filter</span>
        </div>

        <div className="flex gap-2">
          <div className="w-[28%] shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-[10px]">
            <label className="flex items-center gap-2 text-slate-700">
              <input type="checkbox" checked={d.excludeWhiteGroup} readOnly className="rounded" />
              화이트 그룹 제외
            </label>
            <p className="mt-2 text-slate-500">LogSummary · long_session</p>
          </div>

          <div className="min-w-0 flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-2 py-1.5">
              <div className="flex gap-1 text-[10px]">
                {(["outbound", "inbound", "lateral"] as const).map((dir) => (
                  <span
                    key={dir}
                    className={cn(
                      "rounded-lg px-2 py-0.5 capitalize",
                      d.direction === dir ? "bg-blue-50 font-medium text-blue-700" : "text-slate-500",
                    )}
                  >
                    {dir}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                <BarChart3 className="h-3 w-3" />
                그래프 보기
              </span>
            </div>
            <table className="runa-table text-[9px]">
              <thead>
                <tr>
                  {["datetime", "src_ip", "dst_ip", "dst port", "proto", "service", "duration", "src_bytes"].map(
                    (h) => (
                      <th key={h}>{h}</th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {d.rows.map((row) => (
                  <tr key={row.datetime}>
                    <td className="whitespace-nowrap">{row.datetime}</td>
                    <td className="font-mono">{row.src_ip}</td>
                    <td className="font-mono">{row.dst_ip}</td>
                    <td>{row.dst_port}</td>
                    <td>{row.proto}</td>
                    <td>{row.service}</td>
                    <td>{row.duration}</td>
                    <td>{row.src_bytes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RunaPreviewShell>
  );
}

function TaskAndWhitelistPreview() {
  const task = demoTasks.find((t) => t.id === "t3")!;
  const inRequest = demoTasks.filter((t) => t.section === "in_request");

  return (
    <RunaPreviewShell screenId="task-and-whitelist">
      <div className="grid gap-2 p-2 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-[10px] font-semibold text-slate-600">이슈 관리 · 칸반</p>
          <KanbanColumn
            title="확인 요청"
            titleClass="text-blue-500"
            headerClass="bg-sky-50"
            count={inRequest.length}
          >
            {inRequest.map((t) => (
              <TaskCard
                key={t.id}
                title={t.title}
                code={t.code}
                author={t.author}
                status={t.statusLabel}
                statusClass={taskStatusClass(t.status)}
                highlight={t.id === "t3"}
              />
            ))}
          </KanbanColumn>
          <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2 text-[10px]">
            <p className="font-semibold text-slate-800">{task.title}</p>
            <p className="mt-1 text-slate-600">{task.comments[task.comments.length - 1]?.body}</p>
          </div>
        </div>

        <div>
          <p className="mb-1 text-[10px] font-semibold text-slate-600">설정 · 화이트리스트 통합 관리</p>
          <div className="flex flex-wrap gap-1">
            {demoWhitelistTabs.map((tab) => (
              <span
                key={tab.id}
                className={cn(
                  "rounded-lg px-2 py-1 text-[9px]",
                  tab.active ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-600",
                )}
              >
                {tab.label}
              </span>
            ))}
          </div>
          <table className="runa-table mt-2 text-[9px]">
            <thead>
              <tr>
                <th>대상</th>
                <th>메모</th>
                <th>수정일</th>
              </tr>
            </thead>
            <tbody>
              {demoWhitelistSampleRows.map((row) => (
                <tr key={row.target}>
                  <td className="font-mono">{row.target}</td>
                  <td>{row.memo}</td>
                  <td>{row.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RunaPreviewShell>
  );
}

function EventDashboardPreview() {
  return (
    <RunaPreviewShell screenId="event-dashboard">
      <div className="flex min-h-[260px]">
        <aside className="w-[110px] shrink-0 border-r border-slate-200 bg-white p-2">
          <div className="mb-2 flex items-center gap-1 rounded-lg border border-slate-200 px-1.5 py-1 text-[9px] text-slate-600">
            <Calendar className="h-3 w-3" />
            {DEMO_DATE_RANGE.start.slice(5)} ~ {DEMO_DATE_RANGE.end.slice(5)}
          </div>
          {["현황", "1단계: 아웃바운드", "2단계: 인바운드", "3단계: 측면이동"].map((label, i) => (
            <div
              key={label}
              className={cn(
                "rounded-lg px-2 py-1.5 text-[10px]",
                i === 0 ? "bg-blue-50 font-medium text-blue-600" : "text-slate-600",
              )}
            >
              {label}
            </div>
          ))}
        </aside>
        <div className="min-w-0 flex-1 space-y-2 p-2">
          <div className="runa-card overflow-hidden">
            <div className="border-b border-slate-200 px-2 py-1.5 text-[10px] font-semibold">Stage별 집계</div>
            <table className="runa-table text-[9px]">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th className="text-center">발생</th>
                  <th className="text-center">의심</th>
                  <th className="text-center">유효</th>
                </tr>
              </thead>
              <tbody>
                {demoStageSummaryRows.map((row) => (
                  <tr key={row.stage}>
                    <td>{row.stage}</td>
                    <td className="text-center tabular-nums">{row.events}</td>
                    <td className="text-center tabular-nums text-amber-600">{row.suspected}</td>
                    <td className="text-center tabular-nums text-red-700">{row.valid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="runa-card overflow-hidden">
            <div className="border-b border-slate-200 px-2 py-1.5 text-[10px] font-semibold">
              이벤트별 상세 (현황)
            </div>
            <table className="runa-table text-[9px]">
              <thead>
                <tr>
                  <th>이벤트</th>
                  <th>Stage</th>
                  <th className="text-center">의심</th>
                </tr>
              </thead>
              <tbody>
                {demoStageEventRows.slice(0, 4).map((row) => (
                  <tr key={row.event}>
                    <td className="font-medium">{row.event}</td>
                    <td>{row.stage}</td>
                    <td className="text-center tabular-nums text-amber-600">{row.suspected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RunaPreviewShell>
  );
}

function IocBatchPreview() {
  const d = demoIocBatch;
  return (
    <RunaPreviewShell screenId="event-dashboard">
      <div className="border-b border-slate-200 bg-white px-3 py-2">
        <p className="text-[11px] font-semibold text-slate-900">{d.eventName}</p>
        <p className="text-[10px] text-slate-500">
          {d.date} · {d.poolNote}
        </p>
      </div>
      <div className="p-2">
        <div className="mb-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-[10px] text-amber-900">
          IocIP 테이블 ↔ conn dst_ip 일일 조인 · tag_list 집계
        </div>
        <table className="w-full text-left text-[9px] text-slate-700">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {["src_ip", "dst_ip", "tags", "dst_ports", "count"].map((h) => (
                <th key={h} className="px-1.5 py-1 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.matches.map((row) => (
              <tr key={row.dst_ip} className="border-t border-slate-100">
                <td className="px-1.5 py-1 font-mono">{row.src_ip}</td>
                <td className="px-1.5 py-1 font-mono text-red-700">{row.dst_ip}</td>
                <td className="px-1.5 py-1">{row.tags.join(", ")}</td>
                <td className="px-1.5 py-1">{row.dst_ports}</td>
                <td className="px-1.5 py-1 text-right">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RunaPreviewShell>
  );
}

export function MethodologyCapture({ id }: { id: MethodologyScreenId }) {
  if (id === "event-detail-agent") return <EventDetailAgentPreview />;
  if (id === "long-session") return <LongSessionPagePreview />;
  if (id === "task-and-whitelist") return <TaskAndWhitelistPreview />;
  if (id === "ioc-batch") return <IocBatchPreview />;
  return <EventDashboardPreview />;
}

export function MethodologyScreenCaption({ id }: { id: MethodologyScreenId }) {
  return (
    <p className="mt-3 text-center text-xs text-slate-500">
      {SCREEN_LABELS[id]} — 실제 RUNA(front) 화면과 동일한 레이아웃 · 컬럼명 · 데모 데이터
    </p>
  );
}
