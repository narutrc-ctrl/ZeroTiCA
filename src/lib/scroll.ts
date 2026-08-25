/** CSS `scroll-behavior: smooth` 를 잠시 끄고 즉시 상단으로 점프 */
export function jumpToTopInstant() {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;
  requestAnimationFrame(() => {
    html.style.scrollBehavior = prev;
  });
}

/**
 * Hero sticky `#top` 스크롤 progress (0~1).
 * HeroSection 모션의 sceneProgress와 동일 정의.
 */
export function getHeroSceneProgress(scene: HTMLElement): number {
  const total = Math.max(scene.offsetHeight - window.innerHeight, 1);
  const scrolled = Math.max(0, -scene.getBoundingClientRect().top);
  return Math.min(Math.max(scrolled / total, 0), 1);
}

/**
 * sticky 구간에서 「인트로」→「왜 검증인가」전환.
 * 섹션2(보안 운영에 남는 공백) 카피가 보이기 시작하는 ≈0.85 지점.
 */
export const HERO_INTRO_TO_PROBLEM_PROGRESS = 0.85;

/** 인디케이터/deep-link로 「왜 검증인가」로 이동할 때 sticky 목표 progress */
export const HERO_PROBLEM_CLICK_PROGRESS = 0.9;

export function scrollToHeroSceneProgress(progress: number, behavior: ScrollBehavior = "smooth") {
  const scene = document.getElementById("top");
  if (!scene) return;
  const total = Math.max(scene.offsetHeight - window.innerHeight, 0);
  window.scrollTo({ top: scene.offsetTop + total * progress, behavior });
}
