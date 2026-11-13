import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import {
  perspectivesPage,
  type PerspectiveBodyPart,
  type PerspectiveDetail,
  type PerspectiveItem,
} from "@/data/perspectives";
import { trackPerspectiveOpen } from "@/lib/analytics";
import { cn } from "@/lib/cn";

function PerspectiveBody({ parts }: { parts: readonly PerspectiveBodyPart[] }) {
  return (
    <p className="mt-2 text-[14px] font-normal leading-relaxed text-slate-500 [word-break:keep-all] sm:text-[16px]">
      {parts.map((part, i) =>
        part.emphasis ? (
          <span
            key={i}
            className="rounded-sm bg-blue-100/60 px-0.5 font-semibold text-slate-700 box-decoration-clone"
          >
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </p>
  );
}

function PerspectiveDetailPanel({
  detail,
  labelledBy,
}: {
  detail: PerspectiveDetail;
  labelledBy: string;
}) {
  const sectionLabelClassName =
    "text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400 sm:text-[12px]";

  return (
    <div
      role="region"
      aria-labelledby={labelledBy}
      className="border-t border-slate-100 pt-6 sm:pt-7 pr-8 sm:pr-9"
    >
      <div className="grid gap-6 sm:gap-7 lg:grid-cols-[168px_minmax(0,1fr)] lg:gap-x-6">
        <p className={sectionLabelClassName}>이 관점이 필요한 이유</p>
        <p className="text-[14px] leading-relaxed text-slate-500 [word-break:keep-all] sm:text-[15px]">
          {detail.reason}
        </p>
      </div>

      <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:mt-7 sm:pt-7 lg:grid-cols-[168px_minmax(0,1fr)] lg:gap-x-6">
        <p className={cn(sectionLabelClassName, "leading-[1.4]")}>무엇을 보는가</p>
        <ul>
          {detail.looks.map((look, i) => (
            <li
              key={look.title}
              className={cn(
                "grid gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4 lg:grid-cols-[32px_minmax(0,1fr)]",
                i > 0 && "border-t border-slate-100",
              )}
            >
              <span className="text-[15px] font-bold tabular-nums text-primary sm:text-[16px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-zinc-800 [word-break:keep-all] sm:text-[15px]">
                  {look.title}
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-slate-500 [word-break:keep-all] sm:text-[15px]">
                  {look.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:mt-7 sm:pt-7 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-x-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary sm:text-[12px]">
          이 관점에서 확인할 수 있는 것
        </p>
        <ul className="space-y-3 sm:space-y-4">
          {detail.confirms.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-[14px] leading-relaxed text-slate-600 [word-break:keep-all] sm:text-[15px]"
            >
              <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PerspectiveItemCard({
  item,
  open,
  onToggle,
}: {
  item: PerspectiveItem;
  open: boolean;
  onToggle: () => void;
}) {
  const triggerId = `perspective-q-${item.num}`;
  const panelId = `perspective-a-${item.num}`;

  return (
    <li className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-5 sm:rounded-[28px] sm:px-7 sm:py-6">
      <div className="flex gap-4 sm:gap-5">
        <span className="w-8 shrink-0 text-[15px] font-bold tabular-nums text-primary sm:w-9 sm:text-[16px]">
          {item.num}
        </span>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            id={triggerId}
            className="flex w-full items-start gap-3 text-left sm:gap-4"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-[18px] font-extrabold leading-snug text-zinc-900 [word-break:keep-all] sm:text-[20px]">
                {item.title}
              </h3>
              <PerspectiveBody parts={item.bodyParts} />
            </div>
            <ChevronDown
              className={cn(
                "mt-1 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 motion-reduce:transition-none",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          <div
            id={panelId}
            className={cn(
              "grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              <div className="pt-5 sm:pt-6">
                <PerspectiveDetailPanel
                  detail={item.detail}
                  labelledBy={triggerId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function PerspectivesPage() {
  const { eyebrow, titleAccent, titleAfter, titleLine2, lead, closing, backLabel, groups } =
    perspectivesPage;
  const [openNum, setOpenNum] = useState<string | null>(null);

  const handleToggle = (item: PerspectiveItem) => {
    const willOpen = openNum !== item.num;
    if (willOpen) {
      trackPerspectiveOpen(item.id);
    }
    setOpenNum(willOpen ? item.num : null);
  };

  return (
    <div className="border-b border-slate-200/80 bg-[#f8f9fb]">
      <div className="zt-container-hero py-16 sm:py-20 lg:py-24">
        <p className="text-[16px] font-bold tracking-wide text-primary">{eyebrow}</p>
        <h1 className="mt-5 w-full max-w-none text-[28px] font-extrabold leading-[1.35] tracking-tight text-zinc-900 [word-break:keep-all] sm:mt-7 sm:text-[36px] lg:text-[46px]">
          <span className="text-primary">{titleAccent}</span>
          {titleAfter}
          <br />
          {titleLine2}
        </h1>
        <p className="mt-4 w-full max-w-none text-[16px] leading-relaxed text-slate-500 [word-break:keep-all] sm:mt-5 sm:text-[18px]">
          {lead[0]}
          <br />
          {lead[1]}
        </p>

        <div className="mt-16 flex flex-col gap-12 sm:mt-20 sm:gap-16 lg:mt-24 lg:gap-20">
          {groups.map((group) => (
            <section key={group.label}>
              <p className="text-[12px] font-bold tracking-wide text-primary sm:text-[13px]">
                {group.label}
              </p>
              <h2 className="mt-2 text-[22px] font-extrabold leading-snug tracking-tight text-zinc-900 [word-break:keep-all] sm:mt-2.5 sm:text-[26px] lg:text-[28px]">
                {group.heading}
              </h2>
              <ol className="mt-5 flex flex-col gap-3 sm:mt-6 sm:gap-4">
                {group.items.map((item) => (
                  <PerspectiveItemCard
                    key={item.num}
                    item={item}
                    open={openNum === item.num}
                    onToggle={() => handleToggle(item)}
                  />
                ))}
              </ol>
            </section>
          ))}
        </div>

        <section className="mt-8 py-10 text-center sm:mt-10 sm:py-12 lg:mt-12 lg:py-16">
          <div className="mx-auto mb-10 h-0.5 w-16 bg-primary sm:mb-12 sm:w-20" aria-hidden />
          <h2 className="text-[22px] font-extrabold leading-snug tracking-tight text-zinc-900 [word-break:keep-all] sm:text-[26px] lg:text-[28px]">
            {closing.titleLine1}
            <br />
            {closing.titleLine2}
          </h2>
          <div className="mt-4 space-y-1.5 text-[16px] leading-relaxed text-slate-500 [word-break:keep-all] sm:mt-5 sm:text-[18px]">
            {closing.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>

        <Link
          to="/#differentiator"
          className={cn(
            "mt-12 inline-flex items-center gap-1.5 text-[14px] font-medium text-slate-500 underline-offset-4",
            "transition-colors hover:text-primary hover:underline sm:mt-16 sm:text-[15px]",
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
