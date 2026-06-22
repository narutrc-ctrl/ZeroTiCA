import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { faqGroups, faqSection } from "@/data/faq";
import { paths } from "@/data/content";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { cn } from "@/lib/cn";

function FaqAccordionItem({
  id,
  question,
  answer,
  bullets,
  open,
  onToggle,
}: {
  id: string;
  question: string;
  answer: string;
  bullets?: string[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        type="button"
        id={`faq-q-${id}`}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-a-${id}`}
      >
        <span className="text-base font-semibold leading-snug text-slate-900 [word-break:keep-all]">{question}</span>
        <ChevronDown
          className={cn("mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <div
        id={`faq-a-${id}`}
        role="region"
        aria-labelledby={`faq-q-${id}`}
        className={cn("grid transition-[grid-template-rows] duration-200", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
      >
        <div className="overflow-hidden">
          <div className="pb-5 pr-8">
            <p className="text-sm leading-relaxed text-slate-600 [word-break:keep-all]">{answer}</p>
            {bullets && bullets.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-slate-600">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                    <span className="leading-relaxed [word-break:keep-all]">{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(faqGroups[0]?.items[0]?.id ?? null);

  return (
    <section id="faq" className="border-b border-slate-200 bg-slate-50">
      <div className="zt-container zt-section">
        <RevealOnScroll>
          <p className="text-sm font-semibold text-blue-600">{faqSection.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl [word-break:keep-all]">
            {faqSection.title}
            <span className="text-blue-600"> {faqSection.titleAccent}</span>
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">{faqSection.lead}</p>
        </RevealOnScroll>

        <div className="mt-10 space-y-10 lg:space-y-12">
          {faqGroups.map((group, gi) => (
            <RevealOnScroll key={group.id} delay={gi * 60} variant="fade-up">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{group.label}</p>
                <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-5 sm:px-6">
                  {group.items.map((item) => (
                    <FaqAccordionItem
                      key={item.id}
                      {...item}
                      open={openId === item.id}
                      onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                    />
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={80} className="mt-10 flex flex-wrap gap-3">
          <Link to={paths.contact} className="zt-btn-primary">
            도입·PoC 상담
          </Link>
          <a href="#experience" className="zt-btn-ghost">
            RUNA 3분 데모 보기
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
