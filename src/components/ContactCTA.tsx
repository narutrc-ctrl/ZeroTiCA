import { Mail, Phone } from "lucide-react";
import { contactBanner, site } from "@/data/content";
import { cn } from "@/lib/cn";

type Props = {
  variant?: "primary" | "banner" | "inline";
  className?: string;
};

const telHref = `tel:${site.contactPhone.replace(/-/g, "")}`;
const mailHref = `mailto:${site.contactEmail}`;

export function ContactCTA({ variant = "primary", className }: Props) {
  if (variant === "banner") {
    return (
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className={cn("scroll-mt-20 bg-[#3b82f6] text-white", className)}
      >
        <div className="zt-container-hero flex flex-col items-center px-6 py-14 text-center sm:py-16">
          <p className="text-[15px] font-medium tracking-wide text-white/95 sm:text-[16px]">
            {contactBanner.eyebrow}
          </p>
          <h2
            id="contact-heading"
            className="mt-4 max-w-[720px] text-[28px] font-extrabold leading-[1.4] tracking-tight text-white [word-break:keep-all] sm:mt-5 sm:text-[36px] lg:text-[42px]"
          >
            {contactBanner.title}
            <br />
            {contactBanner.titleLine2}
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-9 sm:gap-4">
            <a
              href={mailHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-[#3b82f6] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3b82f6] sm:px-8 sm:py-3.5 sm:text-base"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {site.contactEmail}
            </a>
            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white bg-transparent px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3b82f6] sm:px-8 sm:py-3.5 sm:text-base"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {site.contactPhone}
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-wrap gap-3", className)}>
        <a href={mailHref} className="zt-btn-primary">
          <Mail className="h-4 w-4" aria-hidden /> 이메일 문의
        </a>
        <a href={telHref} className="zt-btn-ghost">
          <Phone className="h-4 w-4" aria-hidden /> {site.contactPhone}
        </a>
      </div>
    );
  }

  return (
    <a href={mailHref} className={cn("zt-btn-primary", className)}>
      이메일 문의
    </a>
  );
}

export function ContactInfo({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={cn("space-y-2 text-sm text-slate-600", compact && "text-slate-400")}>
      <li className="flex items-center gap-2">
        <Mail className="h-4 w-4 shrink-0" aria-hidden />
        <a href={mailHref} className="hover:text-blue-600">
          {site.contactEmail}
        </a>
      </li>
      <li className="flex items-center gap-2">
        <Phone className="h-4 w-4 shrink-0" aria-hidden />
        <a href={telHref} className="hover:text-blue-600">
          {site.contactPhone}
        </a>
      </li>
    </ul>
  );
}
