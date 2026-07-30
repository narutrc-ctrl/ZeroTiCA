import { useState } from "react";
import { Link } from "react-router-dom";
import { experienceSection, paths } from "@/data/content";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { cn } from "@/lib/cn";

type HighlightId = "01" | "02" | "03" | "04" | "05" | null;

const SKELETON_LINE = "h-[4px] shrink-0 rounded-[2px] bg-slate-200";

function highlightClass(active: boolean) {
  return cn(
    "rounded-xl transition-[box-shadow,border-color] duration-200",
    active && "ring-2 ring-primary/70 ring-offset-2 ring-offset-white",
  );
}

function SkeletonBlock({
  title,
  active,
  onActivate,
  onClear,
}: {
  title: string;
  active: boolean;
  onActivate: () => void;
  onClear: () => void;
}) {
  return (
    <div
      className={cn(
        "cursor-default rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3.5 transition-[box-shadow,border-color] duration-200",
        active && "ring-2 ring-primary/70 ring-offset-2 ring-offset-white",
      )}
      onMouseEnter={onActivate}
      onMouseLeave={onClear}
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
  const clear = () => onHighlightChange(null);

  return (
    <div>
      <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className="space-y-5 p-5 sm:p-6">
          <div
            className={cn("cursor-default p-3", highlightClass(highlight === "01"))}
            onMouseEnter={() => onHighlightChange("01")}
            onMouseLeave={clear}
          >
            <p className="text-[12px] font-medium text-slate-400 sm:text-[13px]">{mock.label}</p>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
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

          <div>
            <div
              className={cn("cursor-default p-3", highlightClass(highlight === "02"))}
              onMouseEnter={() => onHighlightChange("02")}
              onMouseLeave={clear}
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
                onActivate={() => onHighlightChange("03")}
                onClear={clear}
              />
              <SkeletonBlock
                title="조치 방안"
                active={highlight === "04"}
                onActivate={() => onHighlightChange("04")}
                onClear={clear}
              />
            </div>
          </div>

          <div
            className={cn("cursor-default p-3", highlightClass(highlight === "05"))}
            onMouseEnter={() => onHighlightChange("05")}
            onMouseLeave={clear}
          >
            <p className="text-[12px] font-bold text-zinc-800">댓글 2</p>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[10px] font-bold text-white">
                  A
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-700">분석팀</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                    해당 자산의 원격 접근이 예정된 작업인지 확인 부탁드립니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5 rounded-lg bg-sky-50/80 px-3 py-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  C
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-700">고객 담당자</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
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
  const { eyebrow, title, titleLine2, points, ctaLabel } = experienceSection;
  const [highlight, setHighlight] = useState<HighlightId>(null);

  return (
    <section id="experience" className="border-b border-slate-200/80 bg-[#f8f9fb]">
      <div className="zt-container-hero py-20 sm:py-28 lg:py-32">
        <RevealOnScroll variant="fade-up">
          <p className="text-[16px] font-bold tracking-wide text-primary">{eyebrow}</p>
          <h2 className="mt-[32px] max-w-[820px] text-[28px] font-extrabold leading-[1.35] tracking-tight [word-break:keep-all] sm:mt-[40px] sm:text-[36px] lg:text-[46px]">
            <span className="text-slate-300">{title}</span>
            <br />
            <span className="text-zinc-900">{titleLine2}</span>
          </h2>
        </RevealOnScroll>

        <div className="mt-[56px] grid items-stretch gap-10 sm:mt-[72px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20 xl:gap-24">
          <RevealOnScroll delay={80} variant="fade-up">
            <ExperienceMockCard highlight={highlight} onHighlightChange={setHighlight} />
          </RevealOnScroll>

          <RevealOnScroll delay={140} variant="fade-up" className="h-full lg:justify-self-end lg:w-full lg:max-w-[440px]">
            <div className="flex h-full min-h-full flex-col">
              <p className="text-[16px] font-bold tracking-wide text-slate-500">
                RUNA 이슈에 담기는 정보
              </p>
              <ul className="mt-6 flex flex-col gap-5 sm:mt-8 sm:gap-6">
                {points.map((point) => {
                  const id = point.num as Exclude<HighlightId, null>;
                  const active = highlight === id;
                  return (
                    <li
                      key={point.num}
                      className={cn(
                        "-mx-3 cursor-default rounded-xl px-3 py-2 transition-colors duration-200",
                        active && "bg-primary/5",
                      )}
                      onMouseEnter={() => setHighlight(id)}
                      onMouseLeave={() => setHighlight(null)}
                    >
                      <div className="flex gap-4">
                        <span
                          className={cn(
                            "w-8 shrink-0 text-[15px] font-bold tabular-nums sm:text-[16px]",
                            active ? "text-primary" : "text-slate-300",
                          )}
                        >
                          {point.num}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[17px] font-extrabold leading-snug text-zinc-900 [word-break:keep-all] sm:text-[18px]">
                            {point.title}
                          </p>
                          <p className="mt-1.5 text-[14px] leading-relaxed text-slate-500 [word-break:keep-all] sm:text-[15px]">
                            {point.body}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto flex justify-end pt-10 sm:pt-12">
                <Link
                  to={paths.fullTour}
                  className="hero-focus-btn hero-focus-btn-primary !w-auto"
                >
                  {ctaLabel}
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
