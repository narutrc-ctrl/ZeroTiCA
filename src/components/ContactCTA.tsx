import { Mail, Phone } from "lucide-react";
import { site } from "@/data/content";
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
        className={cn("border-t border-blue-100 bg-gradient-to-r from-blue-600 to-blue-500 text-white", className)}
      >
        <div className="zt-container-hero flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 id="contact-heading" className="text-2xl font-bold">
              도입·상담 문의
            </h2>
            <p className="mt-2 max-w-xl text-sm text-blue-100">
              Insight·Watch 서비스 도입, PoC, 견적 문의는 이메일 또는 전화로 연락해 주세요.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <a
              href={mailHref}
              className="zt-btn w-full justify-center bg-white text-blue-700 hover:bg-blue-50 sm:w-auto"
            >
              <Mail className="h-4 w-4" aria-hidden /> {site.contactEmail}
            </a>
            <a
              href={telHref}
              className="zt-btn w-full justify-center border border-white/40 text-white hover:bg-white/10 sm:w-auto"
            >
              <Phone className="h-4 w-4" aria-hidden /> {site.contactPhone}
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
