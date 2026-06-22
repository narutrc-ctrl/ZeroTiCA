import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

export function BrandLogo({ className, linked = true }: { className?: string; linked?: boolean }) {
  const inner = (
    <span className={cn("inline-flex items-center", className)}>
      <BrandMark size="lg" />
    </span>
  );

  if (!linked) return inner;
  return (
    <Link to="/" className="shrink-0">
      {inner}
    </Link>
  );
}

export function BrandMark({
  className,
  size = "md",
  inverted = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}) {
  const sizeClass = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-base";
  const main = inverted ? "text-white" : "text-slate-900";
  const accent = inverted ? "text-cyan-300" : "text-blue-600";

  return (
    <span className={cn("inline-flex font-extrabold tracking-tight", sizeClass, className)}>
      <span className={main}>Zero</span>
      <span className={accent}>Ti</span>
      <span className={main}>CA</span>
    </span>
  );
}
