import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { DEFAULT_LOCALE, isSupportedLocale } from "@/i18n/site-locales";

function homePath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const locale = isSupportedLocale(parts[0]) ? parts[0] : null;
  return locale && locale !== DEFAULT_LOCALE ? `/${locale}` : "/";
}

/** CSS scroll-behavior:smooth 를 잠시 끄고 즉시 상단으로 점프 */
function jumpToTopInstant() {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;
  // 다음 프레임까지 유지한 뒤 복구 (해시/레이아웃 스크롤 간섭 방지)
  requestAnimationFrame(() => {
    html.style.scrollBehavior = prev;
  });
}

export function BrandLogo({ className, linked = true }: { className?: string; linked?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const home = homePath(location.pathname);
  const onHome =
    location.pathname === home ||
    location.pathname === `${home}/` ||
    (home === "/" && location.pathname === "/");

  const inner = (
    <span className={cn("inline-flex items-center", className)}>
      <BrandMark size="lg" />
    </span>
  );

  if (!linked) return inner;

  return (
    <Link
      to={home}
      className="shrink-0"
      aria-label="맨 위로"
      onClick={(e) => {
        e.preventDefault();
        if (onHome) {
          if (location.hash) {
            navigate(home, { replace: true });
          }
          jumpToTopInstant();
          return;
        }
        navigate(home);
        // 라우트 전환 직후 즉시 상단
        requestAnimationFrame(jumpToTopInstant);
      }}
    >
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
  const main = inverted ? "text-white" : "text-zinc-800";
  const accent = inverted ? "text-cyan-300" : "text-blue-600";

  return (
    <span className={cn("inline-flex font-extrabold tracking-tight", sizeClass, className)}>
      <span className={main}>Zero</span>
      <span className={accent}>Ti</span>
      <span className={main}>CA</span>
    </span>
  );
}
