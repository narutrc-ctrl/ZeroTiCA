import { useState } from "react";
import { Link } from "react-router-dom";
import { experienceSection, paths } from "@/data/content";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { cn } from "@/lib/cn";

type HighlightId = "01" | "02" | "03" | "04" | "05";

const DEFAULT_HIGHLIGHT: HighlightId = "01";
const SKELETON_LINE = "h-[4px] shrink-0 rounded-[2px] bg-slate-200";

function highlightClass(active: boolean, dimmed: boolean) {
  return cn(
    "rounded-xl transition-[box-shadow,border-color,opacity] duration-200",
    active && "ring-2 ring-primary/70 ring-offset-2 ring-offset-white",
    dimmed && "opacity-35",
  );
}

function SkeletonBlock({
  title,
  active,
  dimmed,
  onActivate,
}: {
  title: string;
  active: boolean;
  dimmed: boolean;
  onActivate: () => void;
}) {
  return (
    <div
      className={cn(
        "cursor-default rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3.5 transition-[box-shadow,border-color,opacity] duration-200",
        active && "ring-2 ring-primary/70 ring-offset-2 ring-offset-white",
        dimmed && "opacity-35",
      )}
      onMouseEnter={onActivate}
    >
      <p className="text-[12px] font-semibold text-slate-500">{title}</p>
      <div className="mt-3 flex flex-col gap-3.5">
        <div className={`${SKELETON_LINE} w-[78%]`} />
        <div className={`${SKELETON_LINE} w-[55%]`} />
      </div>
    </div>
  );
}

function ExperienceMockCard({
  highlight,
  onHighlightChange,
}: {
  highlight: HighlightId;
  onHighlightChange: (id: HighlightId) => void;
}) {
  const { mock } = experienceSection;
  const isDimmed = (id: HighlightId) => highlight !== id;

  return (
    <div className="flex h-full flex-col rounded-[24px] bg-white p-4 sm:rounded-[28px] sm:p-5">
      <p className="shrink-0 text-[12px] font-medium text-slate-500 sm:text-[13px]">
        {mock.label}
      </p>

      <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-slate-200/80 bg-white sm:rounded-[18px]">
        <div className="flex shrink-0 items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-4 sm:px-5 sm:py-[18px]">
          <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
        </div>

        <div className="flex min-h-0 flex-1 flex-col space-y-5 overflow-auto p-6 sm:p-7">
          <div>
            <div
              className={cn(
                "cursor-default p-3",
                highlightClass(highlight === "01", isDimmed("01")),
              )}
              onMouseEnter={() => onHighlightChange("01")}
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
          </div>

          <div className="-mt-2">
            <div
              className={cn(
                "cursor-default p-3",
                highlightClass(highlight === "02", isDimmed("02")),
              )}
              onMouseEnter={() => onHighlightChange("02")}
            >
              <p className="text-[12px] font-bold text-zinc-800">분석 내용</p>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-500 [word-break:keep-all] sm:text-[13px]">
                평소와 다른 원격 접근 패턴이 확인되어 업무 맥락 확인이 필요합니다.
              </p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <SkeletonBlock
                title="통신 흐름 분석"
                active={highlight === "03"}
                dimmed={isDimmed("03")}
                onActivate={() => onHighlightChange("03")}
              />
              <SkeletonBlock
                title="조치 방안"
                active={highlight === "04"}
                dimmed={isDimmed("04")}
                onActivate={() => onHighlightChange("04")}
              />
            </div>
          </div>

          <div
            className={cn(
              "cursor-default p-3",
              highlightClass(highlight === "05", isDimmed("05")),
            )}
            onMouseEnter={() => onHighlightChange("05")}
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
        </div>
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const {
    eyebrow,
    title,
    titleLine2,
    lead,
    listEyebrow,
    listHint,
    points,
    footerNote,
    ctaLabel,
  } = experienceSection;
  const [highlight, setHighlight] = useState<HighlightId>(DEFAULT_HIGHLIGHT);

  return (
    <section
      id="experience"
      className="flex min-h-[calc(100dvh-4rem)] scroll-mt-16 border-b border-slate-200/80 bg-[#f8f9fb]"
    >
      <div className="zt-container-hero flex w-full min-h-[calc(100dvh-4rem)] flex-col py-16 sm:py-20 lg:py-24">
        <RevealOnScroll variant="fade-up" className="shrink-0">
          <p className="text-[16px] font-bold tracking-wide text-primary">{eyebrow}</p>
          <h2 className="mt-[28px] max-w-[820px] text-[28px] font-extrabold leading-[1.35] tracking-tight [word-break:keep-all] sm:mt-[38px] sm:text-[36px] lg:text-[46px]">
            <span className="text-slate-400">{title}</span>
            <br />
            <span className="text-zinc-900">{titleLine2}</span>
          </h2>
          <p className="mt-4 w-full max-w-none text-[16px] leading-relaxed text-slate-500 sm:mt-5 sm:text-[18px] [word-break:keep-all]">
            {lead}
          </p>
        </RevealOnScroll>

        <div className="mt-[40px] grid min-h-0 flex-1 items-stretch gap-5 sm:mt-[48px] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-8 xl:gap-10">
          <RevealOnScroll delay={80} variant="fade-up" className="h-full min-h-0">
            <ExperienceMockCard highlight={highlight} onHighlightChange={setHighlight} />
          </RevealOnScroll>

          <RevealOnScroll delay={140} variant="fade-up" className="h-full min-h-0">
            <aside className="flex h-full min-h-full flex-col rounded-[24px] bg-white p-6 sm:rounded-[28px] sm:p-7 lg:p-8">
              <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-zinc-900 [word-break:keep-all] sm:text-[16px]">
                {listEyebrow}
              </h3>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-400 [word-break:keep-all] sm:text-[13px]">
                {listHint}
              </p>

              <ul className="mt-6 flex flex-col gap-3 sm:mt-7 sm:gap-3.5">
                {points.map((point) => {
                  const id = point.num as HighlightId;
                  const active = highlight === id;
                  return (
                    <li
                      key={point.num}
                      className={cn(
                        "cursor-default rounded-2xl px-3.5 py-3 transition-colors duration-200 sm:px-4 sm:py-3.5",
                        active && "bg-primary/[0.07]",
                      )}
                      onMouseEnter={() => setHighlight(id)}
                    >
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
                          <div
                            className={cn(
                              "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                              active
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0",
                            )}
                          >
                            <div className="overflow-hidden">
                              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 [word-break:keep-all] sm:text-[14px]">
                                {point.body}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto border-t border-slate-200/80 pt-5 sm:pt-6">
                <p className="text-center text-[12px] leading-relaxed text-slate-400 [word-break:keep-all] sm:text-[13px]">
                  {footerNote}
                </p>
                <Link
                  to={paths.fullTour}
                  className="mt-4 flex w-full items-center justify-center rounded-full bg-primary px-5 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-primary/90 sm:mt-5 sm:py-4 sm:text-[16px]"
                >
                  {ctaLabel}
                  <span className="ml-1.5" aria-hidden>
                    →
                  </span>
                </Link>
              </div>
            </aside>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
