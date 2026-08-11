import { Activity, ArrowRight } from "lucide-react";
import type { SimCase, SimPhase } from "@/data/issue-story";
import { cn } from "@/lib/cn";

/** 왼쪽 시뮬레이션 화면 공통 높이 (보고서 단계 기준) */
export const SIM_STAGE_HEIGHT_PX = 600;

export function SimulationStageShell({
  children,
  className,
  scrollable = false,
}: {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}) {
  return (
    <div
      className={cn(
        // 모바일: 고정 높이·내부 스크롤 없이 콘텐츠만큼 늘어남
        "sim-stage-shell relative h-auto overflow-visible rounded-2xl border border-slate-200/70 bg-slate-50",
        "sm:h-[600px] sm:overflow-hidden",
        scrollable && "sm:overflow-y-auto",
        className,
      )}
    >
      <div className={cn("sm:h-full", !scrollable && "sm:overflow-hidden")}>{children}</div>
    </div>
  );
}

export function SimulationNarrativeCard({
  caseLabel,
  chapterLabel,
  situation,
  why,
  action,
  note,
  className,
}: {
  caseLabel?: string;
  chapterLabel?: string;
  situation: string;
  why: string;
  action: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sim-narrative-in flex h-[220px] flex-col rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-4 sm:px-5",
        className,
      )}
    >
      {(caseLabel || chapterLabel) && (
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {[caseLabel, chapterLabel].filter(Boolean).join(" · ")}
        </p>
      )}
      <ul className="mt-2 flex-1 space-y-2.5 text-sm leading-snug text-slate-700">
        <li className="font-semibold text-zinc-800 [word-break:keep-all]">{situation}</li>
        <li className="text-slate-600 [word-break:keep-all]">{why}</li>
        <li className="text-blue-700 [word-break:keep-all]">{action}</li>
      </ul>
      {note ? (
        <p className="mt-2 border-t border-slate-200/80 pt-2 text-[11px] leading-relaxed text-slate-400">{note}</p>
      ) : null}
    </div>
  );
}

export function SimulationCtaBar({
  children,
  waiting,
  waitingLabel = "잠시만 기다려 주세요…",
}: {
  children?: React.ReactNode;
  waiting?: boolean;
  waitingLabel?: string;
}) {
  if (waiting) {
    return (
      <div className="flex min-h-[52px] items-center gap-2 rounded-xl border border-slate-200/60 bg-white px-4 py-3 text-sm text-slate-400">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
        {waitingLabel}
      </div>
    );
  }
  if (!children) return <div className="min-h-[52px]" />;
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/90 px-4 py-3 text-sm font-semibold text-blue-800">
      {children}
    </div>
  );
}

export function SimulationStartPreview({ compact }: { compact?: boolean }) {
  return (
    <SimulationStageShell className="bg-slate-950 border-slate-800">
      <div className="flex h-full flex-col p-4 text-slate-200">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">오늘의 네트워크 상태</p>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            LIVE
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: "오늘 이벤트", value: "1,192" },
            { label: "오픈 이슈", value: "2" },
            { label: "위험도", value: "낮음" },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-2">
              <p className="text-[9px] text-slate-500">{m.label}</p>
              <p className="mt-0.5 text-sm font-bold tabular-nums">{m.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex-1 space-y-1.5 overflow-hidden">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">로그 스트림 미리보기</p>
          {[
            "10:01:02 conn allow 10.24.18.52 → 10.24.20.10 :80",
            "10:01:08 conn allow 10.24.18.52 → 10.24.20.10 :80",
            "10:01:14 agent session · long-lived HTTP",
          ].map((line) => (
            <div
              key={line}
              className="rounded border border-slate-800 bg-slate-900/50 px-2 py-1.5 font-mono text-[9px] text-slate-500"
            >
              {line}
            </div>
          ))}
        </div>
        {!compact ? (
          <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-amber-300/90">
            <Activity className="h-3.5 w-3.5" />
            곧 의심 통신 한 건을 처리합니다
            <ArrowRight className="h-3 w-3 opacity-70" />
          </p>
        ) : null}
      </div>
    </SimulationStageShell>
  );
}

export function getWaitingLabel(phase: SimPhase, activeCase: SimCase): string {
  if (phase === "analyst") return "분석 파이프라인이 진행 중입니다…";
  if (phase === "verifying") {
    return activeCase === "threat"
      ? "분석팀이 고객 조치 결과를 검증 중입니다…"
      : "분석팀이 업무 맥락을 검증 중입니다…";
  }
  if (phase === "staff-reply") return "Sheet를 닫고 칸반 「완료」로 이동 중…";
  if (phase === "delivery") return "포털에 이슈 카드가 등록되고 있습니다…";
  if (phase === "monitoring" || phase === "anomaly") return "네트워크 상태를 스캔 중입니다…";
  return "잠시만 기다려 주세요…";
}
