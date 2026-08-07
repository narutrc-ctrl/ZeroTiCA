/** 관측 단계 — 방향별 관측 카드 */
export const observeDirectionCards = [
  {
    en: "Outbound",
    title: "아웃바운드",
    direction: "내부 → 외부",
    body: "내부 자산이 외부 서비스나 인터넷으로 나가는 통신을 확인합니다.",
    tags: ["악성 IP·URL 접근", "기계적 비콘·C2 의심", "장기 외부 연결", "대용량 전송"],
  },
  {
    en: "Inbound",
    title: "인바운드",
    direction: "외부 → 내부",
    body: "외부에서 내부 자산으로 들어오는 접근과 통신을 확인합니다.",
    tags: ["비정상 URI·웹 요청", "외부 스캔", "연결 거절 이상", "관리 콘솔 노출"],
  },
  {
    en: "Lateral",
    title: "측면이동",
    direction: "내부 ↔ 내부",
    body: "내부 자산 사이에서 발생하는 통신과 반복되는 접근 관계를 확인합니다.",
    tags: ["다수 포트 스캔", "인증·접근 이상", "반복 내부 통신", "횡적 이동 정황"],
  },
] as const;

export function ObserveDirectionsPanel() {
  return (
    <div className="flex h-full items-center justify-center overflow-y-auto px-3 py-10 sm:px-4 sm:py-12 lg:px-5 lg:py-14">
      <div className="grid w-full grid-cols-1 items-stretch gap-3 sm:grid-cols-3 sm:gap-3 lg:gap-4">
        {observeDirectionCards.map((card) => (
          <article
            key={card.en}
            className="flex flex-col rounded-2xl border border-slate-200/80 bg-white px-4 py-5 shadow-sm sm:px-5 sm:py-6"
          >
            <p className="text-[13px] font-bold tracking-wide text-primary sm:text-[14px]">{card.en}</p>
            <h4 className="mt-1.5 text-[20px] font-extrabold tracking-tight text-zinc-900 sm:text-[22px]">
              {card.title}
            </h4>
            <span className="mt-3 inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 sm:text-[12px]">
              {card.direction}
            </span>
            <p className="mt-4 text-[13px] leading-relaxed text-slate-500 [word-break:keep-all] sm:text-[14px]">
              {card.body}
            </p>
            <div className="mt-5 pt-1">
              <p className="text-[11px] font-medium text-slate-400 sm:text-[12px]">대표 관측 유형</p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {card.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 [word-break:keep-all] sm:text-[12px]"
                  >
                    {tag}
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
