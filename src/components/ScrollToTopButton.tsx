import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * 히어로 스크롤 장면(#top) 안에서의 progress.
 * HeroSection 의 p 계산과 동일: 0=장면 시작, 1=장면 끝.
 */
function heroSceneProgress(hero: HTMLElement) {
  const scrollable = Math.max(hero.offsetHeight - window.innerHeight, 1);
  return Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / scrollable));
}

/** 브릿지 문구 이후·섹션2 등장 구간 */
const SHOW_FROM_PROGRESS = 0.84;

/** 섹션2부터 노출 → 클릭 시 최상단으로 */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const hero = document.getElementById("top");
      if (!hero) {
        setVisible(window.scrollY > 320);
        return;
      }
      // 히어로 장면 progress가 섹션2 구간에 들어오면 표시 (이후 페이지에서도 유지)
      setVisible(heroSceneProgress(hero) >= SHOW_FROM_PROGRESS);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="맨 위로"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-6 right-6 z-40 hidden h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-[0_8px_28px_rgba(171,209,255,0.65)] transition-all duration-300 hover:shadow-[0_10px_32px_rgba(171,209,255,0.8)] sm:bottom-8 sm:right-8 sm:flex sm:h-14 sm:w-14",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="h-5 w-5 stroke-[2.25] sm:h-6 sm:w-6" />
    </button>
  );
}
