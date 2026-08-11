import { ArrowRight, Bell, ChevronRight, Shield } from "lucide-react";
import { heroDashboardPreview, heroFlowSteps } from "@/data/content";
import { BrandMark } from "@/components/BrandLogo";
import { cn } from "@/lib/cn";

const d = heroDashboardPreview;

export function HeroDashboardPreview({ className }: { className?: string }) {
  return (
    <div className={cn("hero-dashboard-float relative mx-auto w-full max-w-[540px] lg:max-w-none", className)}>
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-transparent blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.65)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/90 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-2 text-xs text-slate-400">ZeroTica Watch</span>
          </div>
          <BrandMark size="sm" inverted className="opacity-90" />
        </div>

        <div className="grid gap-0 lg:grid-cols-[7.5rem_1fr]">
          <aside className="hidden border-r border-white/10 bg-slate-950/60 px-2 py-4 lg:block">
            <nav className="space-y-2">
              {["대시보드", "이슈 관리", "보고서"].map((label, i) => (
                <div
                  key={label}
                  className={cn(
                    "rounded-lg px-2 py-2 text-center text-[10px] font-medium",
                    i === 1 ? "bg-blue-600/90 text-white" : "text-slate-500",
                  )}
                >
                  {label}
                </div>
              ))}
            </nav>
          </aside>

          <div className="p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                  <Bell className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">{d.alertTitle}</p>
                  <p className="text-xs text-slate-500">방금 · 분석팀 확인 요청</p>
                </div>
              </div>
              <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-bold text-amber-300">
                NEW
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white shadow-lg">
              <div className="border-b border-slate-100 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                    <Shield className="h-3 w-3" />
                    확인 요청
                  </span>
                  <span className="text-[10px] text-slate-400">long session outbound</span>
                </div>
                <p className="mt-2 text-sm font-bold text-zinc-800 sm:text-base">{d.taskTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-4">
                {[
                  { label: "내부 IP", value: d.internalIp },
                  { label: "외부 IP", value: d.externalIp },
                  { label: "위험도", value: d.risk, accent: "text-amber-600" },
                  { label: "분석 상태", value: d.status, accent: "text-blue-600" },
                ].map((row) => (
                  <div key={row.label} className="bg-white px-3 py-2.5">
                    <p className="text-[10px] font-medium text-slate-400">{row.label}</p>
                    <p className={cn("mt-0.5 truncate font-mono text-xs font-semibold text-slate-800", row.accent)}>
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 p-4">
                <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-slate-500">분석팀 · 11:20</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700 sm:text-sm">{d.staffMessage}</p>
                </div>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                >
                  {d.replyCta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-slate-950/70 px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] font-medium text-slate-400 sm:gap-0">
            {heroFlowSteps.map((step, i) => (
              <span key={step} className="flex items-center">
                <span
                  className={cn(
                    "rounded-full px-2 py-1",
                    i === 1 || i === 2 ? "bg-blue-500/15 text-cyan-300" : "text-slate-400",
                  )}
                >
                  {step}
                </span>
                {i < heroFlowSteps.length - 1 ? (
                  <ChevronRight className="mx-0.5 h-3 w-3 shrink-0 text-slate-600 sm:mx-1" />
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400 sm:text-xs [word-break:keep-all]">
        {d.caption}
      </p>
    </div>
  );
}
