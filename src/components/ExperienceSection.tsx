import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { experienceSection, paths } from "@/data/content";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { cn } from "@/lib/cn";

type HighlightId = "01" | "02" | "03" | "04" | "05";

const HIGHLIGHT_IDS: HighlightId[] = ["01", "02", "03", "04", "05"];
const DEFAULT_HIGHLIGHT: HighlightId = "01";
const SKELETON_LINE = "h-[4px] shrink-0 rounded-[2px] bg-slate-200";
const HOVER_DEVICE_MQ = "(hover: hover) and (pointer: fine)";
const DESKTOP_LAYOUT_MQ = "(min-width: 1024px)";

function highlightClass(active: boolean, dimmed: boolean) {
  return cn(
    "rounded-xl transition-[box-shadow,opacity] duration-200",
    active && "ring-2 ring-primary/70 ring-offset-2 ring-offset-white",
    dimmed && "opacity-35",
  );
}

function SkeletonBlock({
  title,
  active,
  dimmed,
}: {
  title: string;
  active: boolean;
  dimmed: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3.5 transition-[box-shadow,opacity] duration-200",
        active && "ring-2 ring-primary/70 ring-offset-2 ring-offset-white",
        dimmed && "opacity-35",
      )}
      aria-hidden
    >
      <p className="text-[12px] font-semibold text-slate-500">{title}</p>
      <div className="mt-3 flex flex-col gap-3.5">
        <div className={`${SKELETON_LINE} w-[78%]`} />
        <div className={`${SKELETON_LINE} w-[55%]`} />
      </div>
    </div>
  );
}

function Panel01({
  highlight,
  idPrefix = "experience-panel",
}: {
  highlight: HighlightId;
  idPrefix?: string;
}) {
  const { mock } = experienceSection;
  const active = highlight === "01";
  return (
    <div
      id={`${idPrefix}-01`}
      role="region"
      aria-label={experienceSection.points[0]?.title}
      className={cn("p-3", highlightClass(active, !active))}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="max-w-[28rem] text-[17px] font-extrabold leading-snug tracking-tight text-slate-700 [word-break:keep-all] sm:text-[20px]">
          {mock.title}
        </h3>
        <span className="shrink-0 rounded-md border border-primary/40 bg-white px-2.5 py-1 text-[11px] font-semibold text-primary">
          {mock.badge}
        </span>
      </div>
      <p className="mt-5 text-[12px] font-bold text-zinc-800">위협 내역</p>
      <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-[11px] sm:text-[12px]">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">일시</th>
              <th className="px-3 py-2 font-medium">이벤트 명</th>
              <th className="hidden px-3 py-2 font-medium sm:table-cell">관련 자산</th>
              <th className="px-3 py-2 font-medium">설명</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            <tr>
              <td className="whitespace-nowrap px-3 py-2.5">03-12 14:22</td>
              <td className="px-3 py-2.5">비인가 원격 접근 시도</td>
              <td className="hidden px-3 py-2.5 font-mono sm:table-cell">사내 IP 주소</td>
              <td className="px-3 py-2.5">승인 요청 확인필요</td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-3 py-2.5">03-12 14:18</td>
              <td className="px-3 py-2.5">외부 IP 장기 세션</td>
              <td className="hidden px-3 py-2.5 font-mono sm:table-cell">사내 IP 주소</td>
              <td className="px-3 py-2.5">탐지됨</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Panel02({
  highlight,
  idPrefix = "experience-panel",
}: {
  highlight: HighlightId;
  idPrefix?: string;
}) {
  const active = highlight === "02";
  return (
    <div
      id={`${idPrefix}-02`}
      role="region"
      aria-label={experienceSection.points[1]?.title}
      className={cn("p-3", highlightClass(active, !active))}
    >
      <p className="text-[12px] font-bold text-zinc-800">분석 내용</p>
      <p className="mt-2 text-[12px] leading-relaxed text-slate-500 [word-break:keep-all] sm:text-[13px]">
        평소와 다른 원격 접근 패턴이 확인되어 업무 맥락 확인이 필요합니다.
      </p>
    </div>
  );
}

function Panel03({
  highlight,
  idPrefix = "experience-panel",
}: {
  highlight: HighlightId;
  idPrefix?: string;
}) {
  return (
    <div id={`${idPrefix}-03`} role="region" aria-label={experienceSection.points[2]?.title}>
      <SkeletonBlock title="통신 흐름 분석" active={highlight === "03"} dimmed={highlight !== "03"} />
    </div>
  );
}

function Panel04({
  highlight,
  idPrefix = "experience-panel",
}: {
  highlight: HighlightId;
  idPrefix?: string;
}) {
  return (
    <div id={`${idPrefix}-04`} role="region" aria-label={experienceSection.points[3]?.title}>
      <SkeletonBlock title="조치 방안" active={highlight === "04"} dimmed={highlight !== "04"} />
    </div>
  );
}

function Panel05({
  highlight,
  idPrefix = "experience-panel",
}: {
  highlight: HighlightId;
  idPrefix?: string;
}) {
  const active = highlight === "05";
  return (
    <div
      id={`${idPrefix}-05`}
      role="region"
      aria-label={experienceSection.points[4]?.title}
      className={cn("p-3", highlightClass(active, !active))}
    >
      <p className="text-[12px] font-bold text-zinc-800">댓글 2</p>
      <div className="mt-2.5 space-y-2.5">
        <div className="flex gap-3 rounded-lg bg-slate-50 px-4 py-3.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[11px] font-bold text-white">
            A
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-slate-700">분석팀</p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
              해당 자산의 원격 접근이 예정된 작업인지 확인 부탁드립니다.
            </p>
          </div>
        </div>
        <div className="flex gap-3 rounded-lg bg-sky-50/80 px-4 py-3.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
            C
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-slate-700">고객 담당자</p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
              외부 점검 업체 원격 지원 일정이 있었습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function panelFor(id: HighlightId, highlight: HighlightId, idPrefix: string): ReactNode {
  switch (id) {
    case "01":
      return <Panel01 highlight={highlight} idPrefix={idPrefix} />;
    case "02":
      return <Panel02 highlight={highlight} idPrefix={idPrefix} />;
    case "03":
      return <Panel03 highlight={highlight} idPrefix={idPrefix} />;
    case "04":
      return <Panel04 highlight={highlight} idPrefix={idPrefix} />;
    case "05":
      return <Panel05 highlight={highlight} idPrefix={idPrefix} />;
  }
}

function PointExplain({
  id,
  active,
  interactive,
  onActivate,
}: {
  id: HighlightId;
  active: boolean;
  interactive?: boolean;
  onActivate?: (id: HighlightId) => void;
}) {
  const point = experienceSection.points.find((p) => p.num === id);
  if (!point) return null;

  const inner = (
    <div className="flex gap-3.5 sm:gap-4">
      <span
        className={cn(
          "w-7 shrink-0 text-[15px] font-bold tabular-nums sm:w-8 sm:text-[16px]",
          active ? "text-primary" : "text-slate-300",
        )}
      >
        {point.num}
      </span>
      <div className="min-w-0">
        <p className="text-[16px] font-extrabold leading-snug text-zinc-900 [word-break:keep-all] sm:text-[17px]">
          {point.title}
        </p>
        <p
          className={cn(
            "mt-1.5 text-[13px] leading-relaxed text-slate-500 [word-break:keep-all] sm:text-[14px]",
            active ? "block" : "hidden",
          )}
        >
          {point.body}
        </p>
        {!active ? <span className="sr-only">{point.body}</span> : null}
      </div>
    </div>
  );

  if (!interactive) {
    return (
      <div
        className={cn(
          "rounded-2xl px-3.5 py-3 transition-colors duration-200 sm:px-4 sm:py-3.5",
          active && "bg-primary/[0.07]",
        )}
      >
        {inner}
      </div>
    );
  }

  return (
    <button
      type="button"
      id={`experience-q-${id}`}
      aria-controls={`experience-panel-${id}`}
      aria-current={active ? "true" : undefined}
      onClick={() => onActivate?.(id)}
      onFocus={() => onActivate?.(id)}
      className={cn(
        "w-full cursor-pointer rounded-2xl px-3.5 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-4 sm:py-3.5",
        active && "bg-primary/[0.07]",
      )}
    >
      {inner}
    </button>
  );
}

function ExperienceMockCard({ highlight }: { highlight: HighlightId }) {
  const { mock } = experienceSection;

  return (
    <div className="flex h-full flex-col rounded-[24px] bg-white p-4 sm:rounded-[28px] sm:p-5">
      <p className="shrink-0 text-[12px] font-medium text-slate-500 sm:text-[13px]">{mock.label}</p>

      <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-slate-200/80 bg-white sm:rounded-[18px]">
        <div className="flex shrink-0 items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-4 sm:px-5 sm:py-[18px]">
          <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
        </div>

        <div className="flex min-h-0 flex-1 flex-col space-y-5 overflow-auto p-6 sm:p-7">
          <Panel01 highlight={highlight} />
          <div className="-mt-2 space-y-3">
            <Panel02 highlight={highlight} />
            <div className="grid gap-2 sm:grid-cols-2">
              <Panel03 highlight={highlight} />
              <Panel04 highlight={highlight} />
            </div>
          </div>
          <Panel05 highlight={highlight} />
        </div>
      </div>
    </div>
  );
}

function ExperienceCta() {
  const { footerNote, ctaLabel } = experienceSection;
  const btnClass =
    "mt-4 flex w-full items-center justify-center rounded-full bg-primary px-5 py-3.5 text-[15px] font-bold text-white sm:mt-5 sm:py-4 sm:text-[16px]";

  return (
    <div className="pt-1 sm:pt-2">
      <p className="text-center text-[12px] leading-relaxed text-slate-400 [word-break:keep-all] sm:text-[13px]">
        {footerNote}
      </p>
      {/* 모바일: 클릭 불가(PC 유도) / lg+: 데모 링크 */}
      <span
        className={cn(btnClass, "pointer-events-none select-none opacity-55 lg:hidden")}
        aria-disabled="true"
      >
        {ctaLabel}
        <span className="ml-1.5" aria-hidden>
          →
        </span>
      </span>
      <Link
        to={paths.fullTour}
        className={cn(
          btnClass,
          "hidden transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:flex",
        )}
      >
        {ctaLabel}
        <span className="ml-1.5" aria-hidden>
          →
        </span>
      </Link>
    </div>
  );
}

function MobileStep({
  id,
  activeId,
  stepRefs,
}: {
  id: HighlightId;
  activeId: HighlightId;
  stepRefs: MutableRefObject<Partial<Record<HighlightId, HTMLElement | null>>>;
}) {
  const focused = activeId === id;
  return (
    <div
      data-experience-step={id}
      ref={(el) => {
        stepRefs.current[id] = el;
      }}
      className="scroll-mt-24"
    >
      {panelFor(id, activeId, "experience-m-panel")}
      {/* 포커스된 스텝만 설명 카드 표시 — 지나가면 언마운트 */}
      {focused ? (
        <div key={id} className="sim-slide-in mt-2.5">
          <PointExplain id={id} active />
        </div>
      ) : null}
    </div>
  );
}

/** 모바일: 데스크톱 왼쪽 목업이 베이스. 스크롤 위치에 맞는 설명 카드만 잠깐 표시 */
function ExperienceMobileFlow({
  activeId,
  onActiveChange,
  enabled,
}: {
  activeId: HighlightId;
  onActiveChange: (id: HighlightId) => void;
  enabled: boolean;
}) {
  const { mock } = experienceSection;
  const stepRefs = useRef<Partial<Record<HighlightId, HTMLElement | null>>>({});

  useEffect(() => {
    if (!enabled) return;

    const nodes = HIGHLIGHT_IDS.map((id) => stepRefs.current[id]).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!nodes.length) return;

    const ratios = new Map<HighlightId, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.experienceStep as HighlightId | undefined;
          if (!id) continue;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best: HighlightId = DEFAULT_HIGHLIGHT;
        let bestRatio = -1;
        for (const id of HIGHLIGHT_IDS) {
          const r = ratios.get(id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        }
        if (bestRatio > 0) onActiveChange(best);
      },
      {
        root: null,
        rootMargin: "-18% 0px -52% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
      },
    );

    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onActiveChange, enabled]);

  return (
    <div className="rounded-[24px] bg-white p-4 sm:rounded-[28px] sm:p-5">
      <p className="text-[12px] font-medium text-slate-500 sm:text-[13px]">{mock.label}</p>

      <div className="mt-3 overflow-hidden rounded-[16px] border border-slate-200/80 bg-white sm:rounded-[18px]">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3.5">
          <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
        </div>

        {/* 데스크톱 왼쪽과 동일한 목업 흐름 — 설명은 active만 */}
        <div className="flex flex-col space-y-5 p-5 sm:p-6">
          <MobileStep id="01" activeId={activeId} stepRefs={stepRefs} />
          <div className="-mt-2 space-y-3">
            <MobileStep id="02" activeId={activeId} stepRefs={stepRefs} />
            <div className="grid gap-3">
              <MobileStep id="03" activeId={activeId} stepRefs={stepRefs} />
              <MobileStep id="04" activeId={activeId} stepRefs={stepRefs} />
            </div>
          </div>
          <MobileStep id="05" activeId={activeId} stepRefs={stepRefs} />
        </div>
      </div>

      <div className="mt-5">
        <ExperienceCta />
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const { eyebrow, title, titleLine2, lead, listEyebrow, listHint, points } = experienceSection;
  const headingId = useId();
  const [isHoverDevice, setIsHoverDevice] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(HOVER_DEVICE_MQ).matches : true,
  );
  const [isDesktopLayout, setIsDesktopLayout] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(DESKTOP_LAYOUT_MQ).matches : true,
  );
  const [activeId, setActiveId] = useState<HighlightId>(DEFAULT_HIGHLIGHT);

  useEffect(() => {
    const hoverMq = window.matchMedia(HOVER_DEVICE_MQ);
    const layoutMq = window.matchMedia(DESKTOP_LAYOUT_MQ);
    const apply = () => {
      setIsHoverDevice(hoverMq.matches);
      setIsDesktopLayout(layoutMq.matches);
    };
    apply();
    hoverMq.addEventListener("change", apply);
    layoutMq.addEventListener("change", apply);
    return () => {
      hoverMq.removeEventListener("change", apply);
      layoutMq.removeEventListener("change", apply);
    };
  }, []);

  const selectPoint = useCallback((id: HighlightId) => {
    setActiveId(id);
  }, []);

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const currentIndex = points.findIndex((p) => p.num === activeId);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      nextIndex = (currentIndex + 1) % points.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      nextIndex = (currentIndex - 1 + points.length) % points.length;
    } else if (event.key === "Home") {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      nextIndex = points.length - 1;
    } else {
      return;
    }

    const nextId = points[nextIndex]?.num as HighlightId | undefined;
    if (!nextId) return;

    selectPoint(nextId);
    const btn = event.currentTarget.querySelector<HTMLButtonElement>(`#experience-q-${nextId}`);
    btn?.focus();
  };

  return (
    <section
      id="experience"
      aria-labelledby={headingId}
      className="flex min-h-[calc(100dvh-4rem)] scroll-mt-16 border-b border-slate-200/80 bg-[#f8f9fb]"
    >
      <div className="zt-container-hero flex w-full min-h-[calc(100dvh-4rem)] flex-col py-16 sm:py-20 lg:py-24">
        <RevealOnScroll variant="fade-up" className="shrink-0">
          <p className="text-[16px] font-bold tracking-wide text-primary">{eyebrow}</p>
          <h2
            id={headingId}
            className="mt-[28px] max-w-[820px] text-[28px] font-extrabold leading-[1.35] tracking-tight [word-break:keep-all] sm:mt-[38px] sm:text-[36px] lg:text-[46px]"
          >
            <span className="text-slate-400">{title}</span>
            <br />
            <span className="text-zinc-900">{titleLine2}</span>
          </h2>
          <p className="mt-4 w-full max-w-none text-[16px] leading-relaxed text-slate-500 sm:mt-5 sm:text-[18px] [word-break:keep-all]">
            {lead}
          </p>
        </RevealOnScroll>

        {/* 모바일·태블릿: 영역 바로 아래 01~05 + 스크롤 스파이 */}
        <div className="mt-[40px] lg:hidden">
          <RevealOnScroll delay={80} variant="fade-up">
            <ExperienceMobileFlow
              activeId={activeId}
              onActiveChange={selectPoint}
              enabled={!isDesktopLayout}
            />
          </RevealOnScroll>
        </div>

        {/* 데스크톱: 좌우 분리 + hover */}
        <div className="mt-[48px] hidden min-h-0 flex-1 items-stretch gap-8 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] xl:gap-10">
          <RevealOnScroll delay={80} variant="fade-up" className="h-full min-h-0">
            <ExperienceMockCard highlight={activeId} />
          </RevealOnScroll>

          <RevealOnScroll delay={140} variant="fade-up" className="h-full min-h-0">
            <aside className="flex h-full min-h-full flex-col rounded-[28px] bg-white p-7 lg:p-8">
              <h3 className="text-[16px] font-semibold leading-snug tracking-tight text-zinc-900 [word-break:keep-all]">
                {listEyebrow}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400 [word-break:keep-all]">
                {listHint}
              </p>

              <ul className="mt-7 flex flex-col gap-3" onKeyDown={onListKeyDown}>
                {points.map((point) => {
                  const id = point.num as HighlightId;
                  return (
                    <li
                      key={point.num}
                      onMouseEnter={() => {
                        if (isHoverDevice) selectPoint(id);
                      }}
                    >
                      <PointExplain
                        id={id}
                        active={activeId === id}
                        interactive
                        onActivate={selectPoint}
                      />
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto">
                <ExperienceCta />
              </div>
            </aside>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
