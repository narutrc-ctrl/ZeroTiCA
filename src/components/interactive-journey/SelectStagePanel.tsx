import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const SELECT_STEPS = [
  { label: "01 전체 이벤트" },
  { label: "02 정상 활동 제외" },
  { label: "03 분석가 우선 검토" },
  { label: "04 검증 대상 사례" },
] as const;

type ModelRow = {
  model: string;
  date: string;
  /** 정상 활동 제외 단계에서 남김 */
  kept: boolean;
  /** 분석가 우선 검토·검증 사례로 남김 (2개) */
  caseFocus: boolean;
  /** 회색 처리 시 부여할 상태 (화이트 / 정상) */
  clearedStatus: "화이트" | "정상";
};

/** 데스크톱: 9개. kept 4개는 위·가운데 묶음·아래로 자연스럽게 흩뿌림 */
const MODEL_ROWS: ModelRow[] = [
  { model: "Kerberos 인증 이상", date: "2026-05-11", kept: false, caseFocus: false, clearedStatus: "정상" },
  { model: "URI 위협", date: "2026-05-12", kept: true, caseFocus: false, clearedStatus: "화이트" },
  { model: "SSH 인증 이상", date: "2026-05-09", kept: false, caseFocus: false, clearedStatus: "화이트" },
  { model: "연결 거절 이상", date: "2026-05-14", kept: false, caseFocus: false, clearedStatus: "정상" },
  { model: "목적지 연결 거절 이상", date: "2026-05-13", kept: true, caseFocus: true, clearedStatus: "정상" },
  { model: "에이전트 통신(패킷/바이트)", date: "2026-05-12", kept: true, caseFocus: true, clearedStatus: "화이트" },
  { model: "스캔", date: "2026-05-10", kept: false, caseFocus: false, clearedStatus: "화이트" },
  { model: "RDP 접속 시도 이상", date: "2026-05-08", kept: false, caseFocus: false, clearedStatus: "정상" },
  { model: "응답 실패율 이상", date: "2026-05-15", kept: true, caseFocus: false, clearedStatus: "정상" },
];

/** 모바일: 4개로 축소해 1→4 단계가 한 화면에 보이게 */
const MODEL_ROWS_MOBILE: ModelRow[] = [
  { model: "Kerberos 인증 이상", date: "2026-05-11", kept: false, caseFocus: false, clearedStatus: "정상" },
  { model: "URI 위협", date: "2026-05-12", kept: false, caseFocus: false, clearedStatus: "화이트" },
  { model: "목적지 연결 거절 이상", date: "2026-05-13", kept: true, caseFocus: true, clearedStatus: "정상" },
  { model: "에이전트 통신(패킷/바이트)", date: "2026-05-12", kept: true, caseFocus: true, clearedStatus: "화이트" },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

const VERIFY_CASES = [
  {
    key: "A",
    meta: "사례 A · 에이전트 통신(패킷/바이트)",
    title: "폐쇄망 서버의 반복 HTTP 통신",
    path: "10.24.18.52 → 10.24.20.10 :80",
    highlight: true,
    rows: [
      { label: "반복 활동", body: "일정한 간격의 HTTP 연결이 반복됨" },
      { label: "통신 관계", body: "추가 확인이 필요한 내부 자산 간 연결" },
    ],
  },
  {
    key: "B",
    meta: "사례 B · 목적지 연결 거절 이상",
    title: "내부 호스트의 다수 포트 연결 시도",
    path: "10.88.12.5 → 10.200.0.0/16",
    highlight: false,
    rows: [
      { label: "다수 연결", body: "여러 내부 자산·포트로 연결 시도가 집중됨" },
      { label: "거절 반복", body: "일반적인 통신과 다른 연결 거절 패턴 반복" },
    ],
  },
] as const;

function MessageSkeleton({ muted }: { muted?: boolean }) {
  return (
    <span
      className={cn("block h-1.5 w-[88%] rounded-full", muted ? "bg-slate-200" : "bg-slate-300")}
      aria-hidden
    />
  );
}

function StatusPill({
  step,
  kept,
  caseFocus,
  clearedStatus,
}: {
  step: number;
  kept: boolean;
  caseFocus: boolean;
  clearedStatus: "화이트" | "정상";
}) {
  // 1. 전체 이벤트 — 모두 미확인
  if (step === 0) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
        미확인
      </span>
    );
  }

  const clearedBadge =
    clearedStatus === "정상" ? (
      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
        정상
      </span>
    ) : (
      <span className="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-600">
        화이트
      </span>
    );

  // 2. 정상 활동 제외 — 회색 모델만 화이트/정상, 나머지는 미확인
  if (step === 1) {
    if (!kept) return clearedBadge;
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
        미확인
      </span>
    );
  }

  // 3. 분석가 우선 검토 — 선택 2개 위협 의심, 이전 미확인(kept)은 보류
  if (caseFocus) {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
        위협 의심
      </span>
    );
  }
  if (kept) {
    return (
      <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
        보류
      </span>
    );
  }
  return clearedBadge;
}

function ModelTable({ step, rows }: { step: number; rows: ModelRow[] }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      <div className="flex shrink-0 items-center gap-2 border-b border-slate-100 px-4 py-3">
        <p className="truncate text-[13px] font-bold text-zinc-900 sm:text-[14px]">측면이동 관측 모델</p>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <table className="w-full table-fixed text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
              <th className="w-[62%] px-4 py-2.5 font-semibold sm:w-[34%]">모델</th>
              <th className="hidden w-[18%] px-3 py-2.5 font-semibold sm:table-cell">날짜</th>
              <th className="hidden w-[28%] px-3 py-2.5 font-semibold sm:table-cell">메세지</th>
              <th className="w-[38%] py-2.5 pl-2.5 pr-3 text-left font-semibold sm:w-[20%] sm:px-4">
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const excluded =
                (step === 1 && !row.kept) || (step === 2 && !row.caseFocus);
              const priorityFocus = step === 2 && row.caseFocus;

              return (
                <tr
                  key={row.model}
                  className={cn(
                    "border-b border-slate-50 last:border-b-0",
                    priorityFocus && "bg-blue-50/40",
                    excluded && "opacity-55",
                  )}
                >
                  <td
                    className={cn(
                      "relative truncate px-4 py-2.5 text-[12px] font-semibold tracking-tight",
                      priorityFocus ? "text-primary" : excluded ? "text-slate-400" : "text-zinc-800",
                    )}
                  >
                    {priorityFocus ? (
                      <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" aria-hidden />
                    ) : null}
                    {row.model}
                  </td>
                  <td
                    className={cn(
                      "hidden px-3 py-2.5 font-mono text-[11px] tabular-nums sm:table-cell",
                      excluded ? "text-slate-400" : "text-slate-600",
                    )}
                  >
                    {row.date}
                  </td>
                  <td className="hidden px-3 py-2.5 sm:table-cell">
                    <MessageSkeleton muted={excluded} />
                  </td>
                  <td className="py-2.5 pl-2.5 pr-3 sm:px-4">
                    <StatusPill
                      step={step}
                      kept={row.kept}
                      caseFocus={row.caseFocus}
                      clearedStatus={row.clearedStatus}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VerifyCases() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* 모바일: 사례 카드 가로 스크롤 / sm+: 2열 그리드 */}
      <div className="flex min-h-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-y-auto sm:overflow-x-visible sm:pb-0 sm:[-ms-overflow-style:auto] sm:[scrollbar-width:auto] [&::-webkit-scrollbar]:hidden sm:[&::-webkit-scrollbar]:block">
        {VERIFY_CASES.map((item) => (
          <article
            key={item.key}
            className={cn(
              "flex w-[min(82vw,20rem)] shrink-0 snap-center flex-col rounded-2xl bg-white p-4 shadow-sm sm:w-auto sm:min-w-0 sm:shrink",
              item.highlight ? "border-2 border-primary/70" : "border border-slate-200/90",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-medium text-slate-400">{item.meta}</p>
              <span className="shrink-0 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                위협 의심
              </span>
            </div>
            <h4 className="mt-2 text-[16px] font-extrabold leading-snug tracking-tight text-zinc-900 [word-break:keep-all] sm:text-[17px]">
              {item.title}
            </h4>
            <p className="mt-3 rounded-full bg-slate-100 px-3 py-1.5 font-mono text-[11px] text-slate-600">
              {item.path}
            </p>
            <ul className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
              {item.rows.map((row) => (
                <li key={row.label} className="py-2.5">
                  <p className="text-[11px] font-bold text-zinc-800">{row.label}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 [word-break:keep-all]">
                    {row.body}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="shrink-0 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 text-[12px] font-semibold leading-relaxed text-primary [word-break:keep-all] sm:text-[13px]">
        모델이 탐지한 모든 이벤트를 그대로 전달하지 않고, 분석가가 우선 검증할 후보를 좁힙니다.
      </p>
    </div>
  );
}

export function SelectStagePanel({ step }: { step: number }) {
  const active = Math.min(Math.max(step, 0), SELECT_STEPS.length - 1);
  const isMobile = useIsMobile();
  const rows = isMobile ? MODEL_ROWS_MOBILE : MODEL_ROWS;

  return (
    <div className="flex h-full flex-col gap-3 bg-[#f3f6fa] p-3 sm:p-4">
      {/* 모바일: 상단 1~4 단계 뱃지 숨김 (설명은 우측/상단 내러티브로 충분) */}
      <div className="hidden shrink-0 grid-cols-2 gap-2 sm:grid lg:grid-cols-4">
        {SELECT_STEPS.map((s, i) => {
          const on = i === active;
          return (
            <div
              key={s.label}
              className={cn(
                "rounded-xl border px-2.5 py-2.5 text-center text-[11px] font-semibold sm:text-[12px]",
                on
                  ? "border-primary/50 bg-blue-50 text-primary"
                  : "border-slate-200/80 bg-white text-slate-400",
              )}
            >
              {s.label}
            </div>
          );
        })}
      </div>

      {active < 3 ? <ModelTable step={active} rows={rows} /> : <VerifyCases />}
    </div>
  );
}
