import { whatsDifferentSection } from "@/data/content";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { cn } from "@/lib/cn";
import section3Bg from "@/assets/section_3.png";

const INSIDE = "#10141d";

export function ProblemDifferentiatorSection() {
  const { eyebrow, titleBefore, titleAccent, titleAfter, lead, cards } =
    whatsDifferentSection;

  return (
    <section
      id="differentiator"
      className="relative flex min-h-[80vh] scroll-mt-20 items-center overflow-hidden"
      style={{ background: INSIDE }}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 h-full" aria-hidden>
        <img
          src={section3Bg}
          alt=""
          className="h-full w-auto max-w-none object-contain object-right opacity-10 mix-blend-screen"
        />
        {/* 이미지 왼쪽 끊김 → 배경색으로 페이드 */}
        <div
          className="absolute inset-y-0 left-0 w-[55%]"
          style={{
            background: `linear-gradient(to right, ${INSIDE} 0%, ${INSIDE}cc 40%, transparent 100%)`,
          }}
        />
      </div>
      <div className="zt-container-hero relative z-10 w-full py-20 sm:py-28 lg:py-32">
        <RevealOnScroll variant="fade-up">
          <p className="text-[16px] font-bold tracking-wide text-[#7eb6ff]">
            {eyebrow}
          </p>
          <h2 className="mt-[32px] max-w-[920px] text-[28px] font-extrabold leading-[1.35] tracking-tight text-white [word-break:keep-all] sm:mt-[40px] sm:text-[36px] lg:text-[46px]">
            {titleBefore}
            <br />
            <span className="text-primary">{titleAccent}</span>
            {titleAfter}
          </h2>
          <p className="mt-3 max-w-[640px] text-[20px] leading-relaxed text-slate-300 sm:mt-4">
            {lead}
          </p>
        </RevealOnScroll>

        <div className="mt-[56px] grid grid-cols-1 gap-5 sm:mt-[72px] sm:gap-8 lg:grid-cols-2 lg:gap-16">
          {cards.map((card, i) => (
            <RevealOnScroll key={card.eyebrow} delay={120 + i * 100} variant="fade-up">
              <article
                className={cn(
                  "flex h-full flex-col items-start rounded-[28px] p-8 text-left sm:rounded-[32px] sm:p-12",
                  card.tone === "accent"
                    ? "bg-gradient-to-br from-white to-[#abd1ff]"
                    : "bg-[#f4f5f7]",
                )}
              >
                <p
                  className={cn(
                    "text-[16px] font-bold tracking-wide",
                    card.tone === "accent" ? "text-primary" : "text-slate-500",
                  )}
                >
                  {card.eyebrow}
                </p>
                <h3
                  className={cn(
                    "mt-5 text-[18px] font-extrabold leading-snug tracking-tight [word-break:keep-all] sm:text-[26px]",
                    card.tone === "neutral" ? "text-zinc-700" : "text-zinc-900",
                  )}
                >
                  {card.title}
                  <br />
                  {card.titleLine2}
                </h3>
                <ul className="mt-6 flex w-full flex-col gap-1.5 sm:mt-10 sm:gap-2">
                  {card.points.map((parts) => (
                    <li
                      key={parts.map((p) => p.text).join("")}
                      className="flex items-start gap-3 text-[14px] leading-relaxed [word-break:keep-all] sm:text-[18px]"
                    >
                      <span
                        className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"
                        aria-hidden
                      />
                      <span>
                        {parts.map((part) => (
                          <span
                            key={part.text}
                            className={
                              part.accent
                                ? cn(
                                    "font-medium",
                                    card.tone === "accent"
                                      ? "text-primary"
                                      : "text-zinc-700",
                                  )
                                : "text-slate-500"
                            }
                          >
                            {part.text}
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
