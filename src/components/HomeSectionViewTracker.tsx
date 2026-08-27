import { useEffect, useRef } from "react";
import { trackSectionView, type HomeSectionId } from "@/lib/analytics";
import { getHeroSceneProgress, HERO_INTRO_TO_PROBLEM_PROGRESS } from "@/lib/scroll";

/** viewport 중앙 50% reading zone */
const READING_ZONE: IntersectionObserverInit = {
  root: null,
  rootMargin: "-25% 0px -25% 0px",
  threshold: 0,
};

const DWELL_MS = 1000;

/** DOM id → section_id (Hero / why_verification 제외) */
const DOM_SECTION_MAP: ReadonlyArray<{ domId: string; sectionId: HomeSectionId }> = [
  { domId: "differentiator", sectionId: "perspectives" },
  { domId: "journey", sectionId: "verification_process" },
  { domId: "outcomes", sectionId: "customer_value" },
  { domId: "experience", sectionId: "demo_experience" },
  { domId: "choose", sectionId: "services" },
  { domId: "faq", sectionId: "faq" },
  { domId: "contact", sectionId: "contact" },
];

function isMobileLayout() {
  return window.matchMedia("(max-width: 640px)").matches;
}

/** StoryProgressIndicator와 동일 — sticky `#top`이 스토리 밴드에 있는지 */
function isHeroSceneInBand(scene: HTMLElement) {
  const rect = scene.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.55 && rect.bottom > window.innerHeight * 0.3;
}

/**
 * 데스크톱 why_verification 활성 여부.
 * Story Indicator의 problem chapter 판정과 동일 임계값(HERO_INTRO_TO_PROBLEM_PROGRESS) 사용.
 */
function isDesktopWhyVerificationActive(): boolean {
  const scene = document.getElementById("top");
  if (!scene) return false;
  const p = getHeroSceneProgress(scene);

  if (isHeroSceneInBand(scene)) {
    return p >= HERO_INTRO_TO_PROBLEM_PROGRESS;
  }
  // sticky 직후·경계 보조 (Story Indicator와 동일)
  if (p > 0 && p < 1) {
    return p >= HERO_INTRO_TO_PROBLEM_PROGRESS;
  }
  return false;
}

/**
 * 홈(`/`) 스토리 섹션 도달 측정.
 * LandingPage mount lifecycle에 dedupe를 묶는다 (SPA 재진입 시 재측정).
 */
export function HomeSectionViewTracker() {
  const firedRef = useRef<Set<HomeSectionId>>(new Set());

  useEffect(() => {
    const fired = firedRef.current;
    const timers = new Map<HomeSectionId, number>();

    const clearTimer = (sectionId: HomeSectionId) => {
      const t = timers.get(sectionId);
      if (t != null) {
        window.clearTimeout(t);
        timers.delete(sectionId);
      }
    };

    const clearAllTimers = () => {
      for (const t of timers.values()) window.clearTimeout(t);
      timers.clear();
    };

    const armTimer = (sectionId: HomeSectionId) => {
      if (fired.has(sectionId) || timers.has(sectionId)) return;
      const t = window.setTimeout(() => {
        timers.delete(sectionId);
        if (fired.has(sectionId)) return;
        fired.add(sectionId);
        trackSectionView(sectionId);
        if (sectionId === "why_verification") {
          stopProblemIo();
          stopDesktopListen();
        }
      }, DWELL_MS);
      timers.set(sectionId, t);
    };

    const onReadingZone = (sectionId: HomeSectionId, intersecting: boolean) => {
      if (fired.has(sectionId)) return;
      if (intersecting) armTimer(sectionId);
      else clearTimer(sectionId);
    };

    /* ── 일반 섹션 (reading zone) ─────────────────────────── */
    const idByElement = new WeakMap<Element, HomeSectionId>();
    const sectionIo = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const sectionId = idByElement.get(entry.target);
        if (!sectionId) continue;
        onReadingZone(sectionId, entry.isIntersecting);
      }
    }, READING_ZONE);

    for (const { domId, sectionId } of DOM_SECTION_MAP) {
      const el = document.getElementById(domId);
      if (!el) continue;
      idByElement.set(el, sectionId);
      sectionIo.observe(el);
    }

    /* ── why_verification ─────────────────────────────────── */
    let problemIo: IntersectionObserver | null = null;
    let desktopListening = false;
    let raf = 0;

    const stopProblemIo = () => {
      problemIo?.disconnect();
      problemIo = null;
    };

    const tickDesktopWhy = () => {
      raf = 0;
      if (fired.has("why_verification")) return;
      onReadingZone("why_verification", isDesktopWhyVerificationActive());
    };

    const onDesktopScrollOrResize = () => {
      if (!raf) raf = requestAnimationFrame(tickDesktopWhy);
    };

    const stopDesktopListen = () => {
      if (!desktopListening) return;
      desktopListening = false;
      window.removeEventListener("scroll", onDesktopScrollOrResize);
      window.removeEventListener("resize", onDesktopScrollOrResize);
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const startDesktopListen = () => {
      if (desktopListening || fired.has("why_verification")) return;
      desktopListening = true;
      window.addEventListener("scroll", onDesktopScrollOrResize, { passive: true });
      window.addEventListener("resize", onDesktopScrollOrResize);
      tickDesktopWhy();
    };

    const startMobileProblemIo = () => {
      if (problemIo || fired.has("why_verification")) return;
      const el = document.getElementById("problem");
      if (!el) return;
      problemIo = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          onReadingZone("why_verification", entry.isIntersecting);
        }
      }, READING_ZONE);
      problemIo.observe(el);
    };

    const syncWhyVerificationMode = () => {
      if (fired.has("why_verification")) {
        stopProblemIo();
        stopDesktopListen();
        return;
      }
      if (isMobileLayout()) {
        stopDesktopListen();
        clearTimer("why_verification");
        startMobileProblemIo();
      } else {
        stopProblemIo();
        clearTimer("why_verification");
        startDesktopListen();
      }
    };

    const mq = window.matchMedia("(max-width: 640px)");
    const onMqChange = () => syncWhyVerificationMode();
    mq.addEventListener("change", onMqChange);
    syncWhyVerificationMode();

    return () => {
      mq.removeEventListener("change", onMqChange);
      stopProblemIo();
      stopDesktopListen();
      sectionIo.disconnect();
      clearAllTimers();
    };
  }, []);

  return null;
}
