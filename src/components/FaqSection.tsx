import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems, faqSection } from "@/data/faq";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { cn } from "@/lib/cn";

function FaqParagraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n\n+/)
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => (
          <p
            key={part}
            className="mt-1.5 text-[15px] leading-relaxed text-slate-500 [word-break:keep-all] first:mt-0 sm:text-[16px]"
          >
            {part}
          </p>
        ))}
    </>
  );
}

function FaqAccordionItem({
  id,
  question,
  answer,
  bullets,
  answerAfter,
  open,
  onToggle,
}: {
  id: string;
  question: string;
  answer: string;
  bullets?: string[];
  answerAfter?: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        id={`faq-q-${id}`}
        className="flex w-full items-start justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:py-6"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-a-${id}`}
      >
        <span className="text-[16px] font-semibold leading-snug text-zinc-900 [word-break:keep-all] sm:text-[17px]">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200",
            !open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <div
        id={`faq-a-${id}`}
        role="region"
        aria-labelledby={`faq-q-${id}`}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-5 pr-8 sm:pb-6">
            <FaqParagraphs text={answer} />
            {bullets && bullets.length > 0 ? (
              <ul className="mt-6 space-y-2 sm:mt-7">
                {bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-[15px] text-slate-500 sm:text-[16px]">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span className="leading-relaxed [word-break:keep-all]">{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {answerAfter ? (
              <div className="mt-6 sm:mt-7">
                <FaqParagraphs text={answerAfter} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);
  const faqJsonLd = useMemo(() => {
    const entities = faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: [item.answer, ...(item.bullets ?? []), item.answerAfter]
          .filter(Boolean)
          .join(" "),
      },
    }));
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: entities,
    };
  }, []);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-20 border-b border-slate-200/80 bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="zt-container-hero py-20 sm:py-28 lg:py-32">
        <RevealOnScroll variant="fade-up">
          <h2
            id="faq-heading"
            className="max-w-[900px] text-[18px] font-bold leading-[1.35] tracking-tight text-primary [word-break:keep-all] sm:text-[20px] lg:text-[22px]"
          >
            {faqSection.title}
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={80} variant="fade-up">
          <div className="mt-[28px] rounded-[24px] border border-slate-200/80 bg-white px-5 sm:mt-[36px] sm:rounded-[28px] sm:px-8 lg:px-10">
            {faqItems.map((item) => (
              <FaqAccordionItem
                key={item.id}
                {...item}
                open={openId === item.id}
                onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
              />
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
