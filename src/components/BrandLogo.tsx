import { Link } from "react-router-dom";
import { site } from "@/data/content";
import { cn } from "@/lib/cn";

export function BrandLogo({ className, linked = true }: { className?: string; linked?: boolean }) {
  const inner = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img src="/zerotica-logo.svg" alt={`${site.brandKo} (${site.brandEn})`} className="h-8 w-auto" />
    </span>
  );

  if (!linked) return inner;
  return (
    <Link to="/" className="shrink-0">
      {inner}
    </Link>
  );
}
