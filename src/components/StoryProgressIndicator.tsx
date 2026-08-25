import { useEffect, useState } from "react";
import { storyProgressChapters } from "@/data/content";
import { cn } from "@/lib/cn";
import {
  getHeroSceneProgress,
  HERO_INTRO_TO_PROBLEM_PROGRESS,
  HERO_PROBLEM_CLICK_PROGRESS,
  scrollToHeroSceneProgress,
} from "@/lib/scroll";

type ChapterId = (typeof storyProgressChapters)[number]["id"];

const LATER_CHAPTER_IDS = storyProgressChapters
  .map((c) => c.id)
  .filter((id): id is ChapterId => id !== "intro" && id !== "problem");

function preferReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobileLayout() {
  return window.matchMedia("(max-width: 640px)").matches;
}

function scrollToChapter(id: ChapterId) {
  const behavior: ScrollBehavior = preferReducedMotion() ? "auto" : "smooth";

  if (id === "intro") {
    const scene = document.getElementById("top");
    if (scene) {
      window.scrollTo({ top: scene.offsetTop, behavior });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
    return;
  }

  if (id === "problem") {
    if (isMobileLayout()) {
      document.getElementById("problem")?.scrollIntoView({ behavior, block: "start" });
      return;
    }
    scrollToHeroSceneProgress(HERO_PROBLEM_CLICK_PROGRESS, behavior);
    return;
  }

  document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
}

/** sticky `#top`이 아직 스토리 밴드에 있는지 */
function isHeroSceneInBand(scene: HTMLElement) {
  const rect = scene.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.55 && rect.bottom > window.innerHeight * 0.3;
}

/**
 * 홈(`/`) 전용 Story Progress — Desktop (xl+) only.
 * 클릭 시 scroll만 수행 (hash / history / navigate 변경 없음).
 */
export function StoryProgressIndicator() {
  const [activeId, setActiveId] = useState<ChapterId>("intro");

  useEffect(() => {
    const ratios = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
      },
      {
        rootMargin: "-18% 0px -55% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
      },
    );

    for (const id of LATER_CHAPTER_IDS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    const problemEl = document.getElementById("problem");
    if (problemEl) io.observe(problemEl);
    const topEl = document.getElementById("top");
    if (topEl) io.observe(topEl);

    let raf = 0;
    const resolveActive = (): ChapterId => {
      const scene = document.getElementById("top");
      const mobile = isMobileLayout();

      if (scene && isHeroSceneInBand(scene)) {
        if (mobile) {
          const problemRatio = ratios.get("problem") ?? 0;
          const topRatio = ratios.get("top") ?? 0;
          if (problemRatio > 0.05 && problemRatio >= topRatio) return "problem";
          return "intro";
        }
        const p = getHeroSceneProgress(scene);
        return p >= HERO_INTRO_TO_PROBLEM_PROGRESS ? "problem" : "intro";
      }

      let bestId: ChapterId | null = null;
      let bestRatio = 0;
      for (const id of LATER_CHAPTER_IDS) {
        const r = ratios.get(id) ?? 0;
        if (r > bestRatio) {
          bestRatio = r;
          bestId = id;
        }
      }
      if (mobile) {
        const problemRatio = ratios.get("problem") ?? 0;
        if (problemRatio > bestRatio) {
          bestRatio = problemRatio;
          bestId = "problem";
        }
      }
      if (bestId && bestRatio > 0) return bestId;

      // sticky 직후·경계: progress로 intro/problem 보조
      if (scene) {
        const p = getHeroSceneProgress(scene);
        if (p > 0 && p < 1) {
          return p >= HERO_INTRO_TO_PROBLEM_PROGRESS ? "problem" : "intro";
        }
      }
      return "intro";
    };

    const tick = () => {
      raf = 0;
      const next = resolveActive();
      setActiveId((prev) => (prev === next ? prev : next));
    };

    const onScrollOrResize = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav
      className="pointer-events-none fixed right-12 top-1/2 z-20 hidden -translate-y-1/2 xl:block 2xl:right-16"
      aria-label="페이지 스토리 진행"
    >
      <ol className="pointer-events-auto flex flex-col items-end gap-0">
        {storyProgressChapters.map((chapter, index) => {
          const active = chapter.id === activeId;
          const isLast = index === storyProgressChapters.length - 1;
          return (
            <li key={chapter.id} className="relative flex flex-col items-end">
              <div className="group relative z-[1] flex items-center justify-end">
                <span
                  className={cn(
                    "mr-3 flex h-6 max-w-[7.5rem] items-center truncate text-right text-[11px] font-medium leading-none tracking-wide transition-opacity duration-200",
                    active
                      ? "text-primary opacity-100"
                      : "text-slate-400 opacity-0 group-hover:opacity-100",
                  )}
                  aria-hidden={!active}
                >
                  {chapter.label}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    scrollToChapter(chapter.id);
                    e.currentTarget.blur();
                  }}
                  aria-label={chapter.label}
                  aria-current={active ? "true" : undefined}
                  className="relative flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <span
                    className={cn(
                      "block rounded-full ring-2 ring-white/90 transition-all duration-200",
                      active
                        ? "h-2.5 w-2.5 bg-primary shadow-[0_0_0_3px_rgba(59,130,246,0.2)]"
                        : "h-2 w-2 bg-slate-200 group-hover:bg-slate-300",
                    )}
                  />
                </button>
              </div>
              {!isLast && (
                <>
                  <span className="h-2 w-px" aria-hidden />
                  <span
                    className="pointer-events-none absolute right-[11px] top-3 z-0 h-8 w-0.5 bg-slate-200"
                    aria-hidden
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
