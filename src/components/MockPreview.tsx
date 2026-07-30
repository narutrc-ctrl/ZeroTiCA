import { KANBAN_COLUMNS } from "@/data/issue-ui-labels";

export function MockPreview({ id }: { id: string }) {
  if (id === "task") {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex border-b border-slate-200">
          <div className="w-12 shrink-0 bg-[hsl(217,28%,15%)]" />
          <div className="flex-1 p-3">
            <div className="mb-2 flex gap-2">
              {[KANBAN_COLUMNS.pre_request, KANBAN_COLUMNS.in_request, KANBAN_COLUMNS.done].map((c, i) => (
                <div
                  key={c}
                  className={
                    i === 1
                      ? "flex-1 rounded-lg bg-sky-50 p-2 text-center text-[10px] font-medium text-blue-600"
                      : "flex-1 rounded-lg bg-slate-100 p-2 text-center text-[10px] text-slate-600"
                  }
                >
                  {c}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="rounded-lg border border-slate-200 p-2 text-[11px] font-medium text-slate-800">
                폐쇄망 IP (10.24.18.52) 기계적 통신 문의
              </div>
              <div className="rounded-lg border border-slate-200 p-2 text-[11px] text-slate-600">
                다수의 내부 IP 대상 SSH 연결 시도
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (id === "event") {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex">
          <div className="w-12 shrink-0 bg-[hsl(217,28%,15%)]" />
          <div className="flex-1 p-3 text-[11px]">
            <div className="mb-2 grid grid-cols-3 gap-1 text-[10px]">
              {["발생 1842", "의심 28", "유효 3"].map((s) => (
                <div key={s} className="rounded bg-blue-50 p-1.5 text-center text-blue-700">
                  {s}
                </div>
              ))}
            </div>
            <table className="w-full text-left text-slate-700">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-1">Stage</th>
                  <th className="pb-1">의심</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100">
                  <td className="py-1">아웃바운드</td>
                  <td>28</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 text-[11px] shadow-sm">
      <p className="font-semibold text-zinc-800">ZeroTica Watch</p>
      <div className="my-2 h-px bg-blue-500" />
      <p className="text-slate-500">01. 침해 평가 개요</p>
      <p className="mt-1 text-slate-600">평가 기간 위협 12건 · 검증 완료 3건</p>
    </div>
  );
}
