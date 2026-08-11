import { useEffect, useRef, useState } from "react";
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

/** 미세 스크롤·바운스 무시 */
const DIRECTION_DELTA = 8;

/** 섹션2부터 노출 → 클릭 시 최상단으로. 내릴 때 숨김, 올릴 때 다시 표시 */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const lastYRef = useRef(0);
  const inRangeRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    lastYRef.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      const hero = document.getElementById("top");
      const inRange = hero
        ? heroSceneProgress(hero) >= SHOW_FROM_PROGRESS
        : y > 320;

      const delta = y - lastYRef.current;
      const scrollingDown = delta > DIRECTION_DELTA;
      const scrollingUp = delta < -DIRECTION_DELTA;

      if (scrollingDown || scrollingUp) {
        lastYRef.current = y;
      }

      inRangeRef.current = inRange;

      if (!inRange) {
        setVisible(false);
        return;
      }

      // 범위 진입 직후·맨 위 근처에서는 올리기 동작이 없어도 표시
      if (y < 80) {
        setVisible(false);
        return;
      }

      if (scrollingDown) {
        setVisible(false);
      } else if (scrollingUp) {
        setVisible(true);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    // 첫 진입 시 이미 범위 안이면 표시 (새로고침·앵커 등)
    if (inRangeRef.current && window.scrollY >= 80) {
      setVisible(true);
    }

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
        "fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-[0_8px_28px_rgba(171,209,255,0.65)] transition-all duration-300 hover:shadow-[0_10px_32px_rgba(171,209,255,0.8)] sm:bottom-8 sm:right-8 sm:h-14 sm:w-14",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="h-5 w-5 stroke-[2.25] sm:h-6 sm:w-6" />
    </button>
  );
}
