import { runaConversation } from "@/data/content";
import { cn } from "@/lib/cn";

export function RunaConversationMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <p className="text-sm font-semibold text-zinc-800">ZeroTica Watch · 이슈 대화</p>
        <p className="text-xs text-slate-500">의심 통신 DEMO-2026-05-003</p>
      </div>
      <div className="space-y-4 p-4">
        {runaConversation.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              msg.role === "runa" && "bg-blue-50 text-slate-800",
              msg.role === "client" && "ml-auto bg-slate-100 text-slate-800",
              msg.role === "staff" && "border border-emerald-100 bg-emerald-50/80 text-slate-800",
            )}
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {msg.role === "runa" ? "ZeroTica Watch" : msg.role === "client" ? "고객" : "전문가"}
            </p>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}
