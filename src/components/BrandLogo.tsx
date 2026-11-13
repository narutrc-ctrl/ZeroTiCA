import { cn } from "@/lib/cn";
import { DEFAULT_LOCALE, isSupportedLocale } from "@/i18n/site-locales";
import { jumpToTopInstant } from "@/lib/scroll";

function homePath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const locale = isSupportedLocale(parts[0]) ? parts[0] : null;
  return locale && locale !== DEFAULT_LOCALE ? `/${locale}` : "/";
}

function isOnHome(pathname: string, home: string) {
  return (
    pathname === home ||
    pathname === `${home}/` ||
    (home === "/" && pathname === "/")
  );
}

export function BrandLogo({ className, linked = true }: { className?: string; linked?: boolean }) {
  const inner = (
    <img
      src="/ZeroTiCA-BI-02.svg"
      alt="ZeroTiCA"
      width={88}
      height={16}
      className={cn("h-4 w-auto sm:h-5", className)}
      decoding="async"
    />
  );

  if (!linked) return inner;

  return (
    <a
      href="/"
      className="inline-flex shrink-0 items-center"
      aria-label="맨 위로"
      onClick={(e) => {
        const pathname = window.location.pathname;
        const home = homePath(pathname);
        if (!isOnHome(pathname, home)) return;
        e.preventDefault();
        if (window.location.hash) {
          window.history.replaceState(null, "", home);
        }
        jumpToTopInstant();
      }}
    >
      {inner}
    </a>
  );
}

/** 데모·목업 UI용 텍스트 워드마크 (헤더/히어로/푸터 BI 이미지와 별개) */
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
  const main = inverted ? "text-white" : "text-zinc-800";

  return (
    <span
      className={cn("zt-brand-mark inline-block", sizeClass, main, className)}
      aria-label="ZeroTiCA"
    >
      ZeroT
      <span className="zt-brand-mark-i" aria-hidden="true">
        ı
        <span
          className={cn("zt-brand-mark-idot", inverted && "zt-brand-mark-idot-inverted")}
        />
      </span>
      CA
    </span>
  );
}
