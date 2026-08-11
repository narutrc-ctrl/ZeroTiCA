import { X } from "lucide-react";
import type { SimEventDetail } from "@/data/issue-story";
import { cn } from "@/lib/cn";

function checkedBadgeClass(checked: number) {
  if (checked === 5) return "bg-red-950 border-red-900 text-red-300";
  if (checked === 3) return "bg-red-50 border-red-300 text-red-600";
  return "bg-yellow-50 border-yellow-300 text-yellow-700";
}

export function SimulationEventDetailPanel({
  detail,
  onClose,
  overlay = "absolute",
}: {
  detail: SimEventDetail;
  onClose: () => void;
  /** absolute: 부모 relative 기준(검증 시뮬레이션) · fixed: 화면 전체(데모 이슈 시트) */
  overlay?: "absolute" | "fixed";
}) {
  const maxChart = Math.max(...detail.chartValues, 1);
  const isScan = detail.variant === "scan";
  const layer = overlay === "fixed" ? "fixed inset-0" : "absolute inset-0";
  const backdropZ = overlay === "fixed" ? "z-[60]" : "z-30";
  const dialogZ = overlay === "fixed" ? "z-[70]" : "z-40";

  return (
    <>
      <button
        type="button"
        className={cn(layer, backdropZ, "bg-slate-900/35 backdrop-blur-[2px]")}
        aria-label="이벤트 상세 닫기"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(layer, dialogZ, "flex items-center justify-center p-4 pointer-events-none")}
      >
        <div className="pointer-events-auto flex max-h-[88%] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sim-slide-in">
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-blue-600">이벤트 상세 · event detail</p>
              <h3 className="mt-0.5 text-sm font-bold text-zinc-800">{detail.eventName}</h3>
              <p className="text-[11px] text-slate-500">
                {detail.date} · {detail.srcIp} → {detail.dstIp}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              aria-label="닫기"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">{detail.stage}</span>
              <span className={cn("rounded-lg border px-2 py-1 text-[10px] font-semibold", checkedBadgeClass(detail.checked))}>
                {detail.checkedLabel}
              </span>
            </div>

            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-2 row-span-2 rounded-lg border border-slate-200 bg-white p-2">
                <p className="mb-2 text-[10px] font-medium text-slate-500">networkMap</p>
                <div className="flex h-20 items-center justify-center gap-2">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 font-mono text-[10px] text-blue-800">
                    {detail.srcIp}
                  </div>
                  <div className="h-px w-6 bg-slate-300" />
                  <div
                    className={cn(
                      "rounded-lg border px-2 py-1 font-mono text-[10px]",
                      isScan ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800",
                    )}
                  >
                    {detail.dstIp}
                  </div>
                </div>
              </div>

              <div className="col-span-4 rounded-lg border border-slate-200 bg-white p-2">
                <p className="mb-2 text-[10px] font-medium text-slate-500">{detail.chartLabel}</p>
                <div className="flex h-14 items-end gap-1">
                  {detail.chartValues.map((v, i) => (
                    <div
                      key={i}
                      className={cn("flex-1 rounded-t", isScan ? "bg-red-500/80" : "bg-cyan-500/80")}
                      style={{ height: `${(v / maxChart) * 100}%`, minHeight: 6 }}
                    />
                  ))}
                </div>
              </div>

              <div className="col-span-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <p className="border-b border-slate-100 px-2 py-1.5 text-[10px] font-medium text-slate-500">
                  {isScan ? "connRejectLogTable" : "connDstAgentLogTable"}
                </p>
                <table className="w-full text-left text-[9px] text-slate-700">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      {Object.keys(detail.connLogs[0] ?? {}).map((h) => (
                        <th key={h} className="whitespace-nowrap px-1.5 py-1 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {detail.connLogs.map((row) => (
                      <tr key={String(row.datetime)} className="border-t border-slate-100">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="whitespace-nowrap px-1.5 py-1 font-mono">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
