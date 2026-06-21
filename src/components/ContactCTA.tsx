import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { site } from "@/data/content";
import { cn } from "@/lib/cn";

type Props = {
  variant?: "primary" | "banner" | "inline";
  className?: string;
};

export function ContactCTA({ variant = "primary", className }: Props) {
  if (variant === "banner") {
    return (
      <section
        id="contact"
        className={cn("border-y border-blue-100 bg-gradient-to-r from-blue-600 to-blue-500 text-white", className)}
      >
        <div className="zt-container flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">도입·상담 문의</h2>
            <p className="mt-2 max-w-xl text-sm text-blue-100">
              인사이트·와치 서비스 도입, PoC, 견적 문의를 남겨 주시면 담당자가 연락드립니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact" className="zt-btn bg-white text-blue-700 hover:bg-blue-50">
              도입 문의하기
            </Link>
            <a href={`mailto:${site.contactEmail}`} className="zt-btn border border-white/40 text-white hover:bg-white/10">
              <Mail className="h-4 w-4" /> {site.contactEmail}
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-wrap gap-3", className)}>
        <Link to="/contact" className="zt-btn-primary">
          도입 문의
        </Link>
        <a href={`mailto:${site.contactEmail}`} className="zt-btn-ghost">
          <Mail className="h-4 w-4" /> 이메일 문의
        </a>
      </div>
    );
  }

  return (
    <Link to="/contact" className={cn("zt-btn-primary", className)}>
      도입 문의
    </Link>
  );
}

export function ContactInfo({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={cn("space-y-2 text-sm text-slate-600", compact && "text-slate-400")}>
      <li className="flex items-center gap-2">
        <Mail className="h-4 w-4 shrink-0" />
        <a href={`mailto:${site.contactEmail}`} className="hover:text-blue-600">
          {site.contactEmail}
        </a>
      </li>
      <li className="flex items-center gap-2">
        <Phone className="h-4 w-4 shrink-0" />
        <a href={`tel:${site.contactPhone.replace(/-/g, "")}`} className="hover:text-blue-600">
          {site.contactPhone}
        </a>
      </li>
    </ul>
  );
}
