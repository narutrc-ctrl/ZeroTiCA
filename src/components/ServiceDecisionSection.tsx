import { RevealOnScroll } from "@/components/RevealOnScroll";
import { serviceDecision, services } from "@/data/content";

export function ServiceDecisionSection() {
  return (
    <section id="choose" className="border-b border-slate-200/80 bg-gradient-to-b from-slate-50 to-white">
      <div className="zt-container-hero py-20 sm:py-28 lg:py-32">
        <RevealOnScroll variant="fade-up" className="text-center">
          <p className="text-[16px] font-bold tracking-wide text-primary">서비스 선택</p>
          <h2 className="mx-auto mt-[32px] max-w-[900px] text-[28px] font-extrabold leading-[1.35] tracking-tight text-zinc-900 [word-break:keep-all] sm:mt-[40px] sm:text-[36px] lg:text-[46px]">
            {serviceDecision.title}
            <br />
            {serviceDecision.titleLine2}
          </h2>
        </RevealOnScroll>

        <div className="mt-[48px] grid gap-5 sm:mt-[64px] sm:gap-6 lg:grid-cols-2 lg:gap-8">
          {services.map((svc, i) => (
            <RevealOnScroll key={svc.id} delay={i * 100} variant="fade-up">
              <article className="flex h-full flex-col rounded-[24px] border border-slate-200/80 bg-white p-7 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_16px_40px_rgba(171,209,255,0.45)] sm:rounded-[28px] sm:p-8 lg:p-10">
                <p className="text-[16px] font-bold tracking-wide text-primary sm:text-[18px]">
                  {svc.name}
                </p>
                <h3 className="mt-5 text-[22px] font-extrabold leading-snug tracking-tight text-zinc-900 [word-break:keep-all] sm:mt-6 sm:text-[26px] lg:text-[28px]">
                  {svc.title}
                  <br />
                  {svc.titleLine2}
                </h3>
                <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-slate-500 [word-break:keep-all] sm:mt-5 sm:text-[16px]">
                  {svc.description}
                </p>
                <div className="mt-auto grid grid-cols-2 gap-3 pt-8 sm:gap-4 sm:pt-10">
                  {svc.meta.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl bg-slate-50 px-4 py-4 text-center sm:px-5 sm:py-5"
                    >
                      <p className="text-[12px] font-medium text-slate-400 sm:text-[13px]">
                        {item.label}
                      </p>
                      <p className="mt-1.5 text-[14px] font-semibold leading-snug text-zinc-800 [word-break:keep-all] sm:text-[15px]">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
