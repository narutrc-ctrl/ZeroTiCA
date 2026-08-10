import { ArrowLeft, ArrowLeftRight, ArrowRight } from "lucide-react";

type FlowNode = "내부" | "외부";
type FlowArrow = "right" | "left" | "both";

/** 관측 단계 — 방향별 관측 카드 */
export const observeDirectionCards = [
  {
    en: "Outbound",
    title: "아웃바운드",
    from: "내부" as FlowNode,
    to: "외부" as FlowNode,
    arrow: "right" as FlowArrow,
    body: "외부로 나가는 통신의 변화",
    models: ["에이전트 통신(패킷/바이트)", "User-Agent 위협", "IOC 연결"],
  },
  {
    en: "Inbound",
    title: "인바운드",
    from: "내부" as FlowNode,
    to: "외부" as FlowNode,
    arrow: "left" as FlowArrow,
    body: "내부로 들어오는 통신의 변화",
    models: ["응답 실패율 이상", "URI 위협", "목적지 연결 거절 이상"],
  },
  {
    en: "Lateral",
    title: "측면이동",
    from: "내부" as FlowNode,
    to: "내부" as FlowNode,
    arrow: "both" as FlowArrow,
    body: "내부 자산 사이 통신의 변화",
    models: ["URI 위협", "응답 실패율 이상", "목적지 연결 거절 이상"],
  },
] as const;

function FlowNodeCircle({ label }: { label: FlowNode }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-white text-[12px] font-semibold text-primary sm:h-11 sm:w-11 sm:text-[13px]">
      {label}
    </span>
  );
}

function FlowArrowIcon({ arrow }: { arrow: FlowArrow }) {
  const className = "h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5";
  if (arrow === "both") {
    return <ArrowLeftRight className={className} strokeWidth={2.25} aria-hidden />;
  }
  if (arrow === "left") {
    return <ArrowLeft className={className} strokeWidth={2.25} aria-hidden />;
  }
  return <ArrowRight className={className} strokeWidth={2.25} aria-hidden />;
}

function DirectionFlow({
  from,
  to,
  arrow,
}: {
  from: FlowNode;
  to: FlowNode;
  arrow: FlowArrow;
}) {
  return (
    <div className="mt-2 flex items-center justify-center rounded-2xl bg-[#eef4fb] px-3 py-4 sm:mt-2.5 sm:px-4 sm:py-5">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <FlowNodeCircle label={from} />
        <FlowArrowIcon arrow={arrow} />
        <FlowNodeCircle label={to} />
      </div>
    </div>
  );
}

export function ObserveDirectionsPanel() {
  return (
    <div className="flex h-auto items-stretch justify-center overflow-visible py-4 sm:h-full sm:items-center sm:overflow-y-auto sm:px-4 sm:py-12 lg:px-5 lg:py-14">
      {/* 모바일: 가로 스크롤 / sm+: 3열 그리드 */}
      <div
        className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:snap-none sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0 sm:[-ms-overflow-style:auto] sm:[scrollbar-width:auto] lg:gap-4 [&::-webkit-scrollbar]:hidden sm:[&::-webkit-scrollbar]:block"
      >
        {observeDirectionCards.map((card) => (
          <article
            key={card.en}
            className="flex w-[min(78vw,20rem)] shrink-0 snap-center flex-col rounded-2xl border border-slate-200/80 bg-white px-4 py-5 shadow-sm sm:w-auto sm:min-w-0 sm:shrink sm:px-5 sm:py-6"
          >
            <p className="text-[13px] font-bold tracking-wide text-primary sm:text-[14px]">{card.en}</p>
            <h4 className="mt-0.5 text-[20px] font-extrabold tracking-tight text-zinc-900 sm:text-[22px]">
              {card.title}
            </h4>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-500 [word-break:keep-all] sm:text-[14px]">
              {card.body}
            </p>
            <div className="hidden sm:block">
              <DirectionFlow from={card.from} to={card.to} arrow={card.arrow} />
            </div>
            <div className="mt-5 sm:mt-8">
              <p className="text-[12px] font-medium text-slate-400 sm:text-[12px]">대표 모델 예시</p>
              <ul className="mt-2.5 flex flex-col gap-2">
                {card.models.map((model) => (
                  <li
                    key={model}
                    className="rounded-xl border border-slate-200/90 bg-white px-3.5 py-1.5 text-[10px] font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] [word-break:keep-all] sm:text-[12px]"
                  >
                    {model}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
