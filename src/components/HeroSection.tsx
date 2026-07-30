import { useEffect, useRef } from "react";
import { hero, section2Gap } from "@/data/content";

const INSIDE = "#10141d";
const WHEEL_DIAMETER = 6;
/** 1/2 지점 도착(= 상승·hero 페이드 끝) */
const RISE_END = 0.38;
/**
 * 1/2 지점 도착 시 키홀 "원" 지름(px).
 * 이 숫자만 바꿔서 크기를 조절하면 됨. (예: 80 / 120 / 180)
 */
const KEYHOLE_DIAMETER_AT_HALF = 40;
/** 확대가 화면을 덮는 시점 — 낮출수록 이후 원 합류 스크롤 구간이 길어짐 */
const EXPAND_END = 0.78;
/** 키홀이 화면의 이 비율만큼 찼을 때 양쪽 원 등장 */
const CIRCLE_COVER_TRIGGER = 0.8;
/** 원 합류: 키홀 막바지 비중 / 이후 스크롤 비중 (합 1) */
const CIRCLE_COVER_WEIGHT = 0.22;
const CIRCLE_SCROLL_WEIGHT = 0.78;
/** 상승 중 인디케이터(캡슐+키홀) 최대 scale */
const RISE_SCALE = 2.4;

/**
 * 합류 원 — 해상도/비율에 덜 흔들리게 정규화한 값들
 * (크기·이동을 vw가 아니라 vmin / 원 지름 비율로 계산)
 */
/** 원 지름 = min(가로,세로) * 이 값 */
const MERGE_CIRCLE_VMIN = 1.08;
/** 원 지름 상한 = 가로 * 이 값 */
const MERGE_CIRCLE_MAX_VW = 0.92;
/** 시작 시 중심까지 거리 = 원 지름 * 이 값 (클수록 더 바깥에서 등장) */
const MERGE_START_X_OF_CIRCLE = 1.32;
/** 끝(겹침) 시 중심까지 거리 = 원 지름 * 이 값 (작을수록 더 많이 겹침) */
const MERGE_END_X_OF_CIRCLE = 0.34;
/** 하단 잘림(원 높이 %). 50≈절반, 클수록 더 많이 보임 / 작을수록 더 잘림 */
const MERGE_Y_PERCENT = 68;
const MERGE_Y_PERCENT_MOBILE = 40;
/** 섹션2 콘텐츠 세로 위치(아래 +, px) — 가운데 기준에서 얼마나 내릴지 */
const SECTION2_Y_OFFSET = 150;
/** 섹션2 등장 시 추가로 올라오는 거리 */
const SECTION2_ENTER_RISE = 28;
/** 섹션2 1번(eyebrow+title) 등장 시작 — 기존 contentT와 동일 */
const S2_REVEAL_START = 0.46;
/** 각 그룹 페이드/상승 구간 길이 (circleT 기준) */
const S2_REVEAL_DURATION = 0.34;
/** 그룹 간 등장 시차 (circleT 기준) */
const S2_REVEAL_STAGGER = 0.14;
/** 섹션2 완전 등장 후 sticky 유지 구간 (vh). CSS --hero-s2-dwell 과 동기화 */
const S2_DWELL_VH = 0.55;
const S2_DWELL_VH_MOBILE = 0.45;

function clamp(v: number, min = 0, max = 1) {
  return Math.min(Math.max(v, min), max);
}

function map(v: number, a: number, b: number, c: number, d: number) {
  return c + (d - c) * clamp((v - a) / (b - a));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** 로그 보간 — 큰 확대에서도 속도감이 비교적 일정 */
function lerpLog(a: number, b: number, t: number) {
  const min = Math.max(a, 0.001);
  const max = Math.max(b, 0.001);
  return Math.exp(Math.log(min) + clamp(t) * (Math.log(max) - Math.log(min)));
}

export function HeroSection() {
  const sceneRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const expandRef = useRef<SVGSVGElement>(null);
  const circleLeftRef = useRef<HTMLDivElement>(null);
  const circleRightRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section2HeadRef = useRef<HTMLDivElement>(null);
  const section2LeadRef = useRef<HTMLDivElement>(null);
  const section2CardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const heroEl = heroRef.current;
    const indicator = indicatorRef.current;
    const capsule = capsuleRef.current;
    const wheel = wheelRef.current;
    const expand = expandRef.current;
    const circleLeft = circleLeftRef.current;
    const circleRight = circleRightRef.current;
    const stage = stageRef.current;
    const section2 = section2Ref.current;
    const section2Head = section2HeadRef.current;
    const section2Lead = section2LeadRef.current;
    const section2Cards = section2CardsRef.current;
    if (
      !scene ||
      !heroEl ||
      !indicator ||
      !capsule ||
      !wheel ||
      !expand ||
      !circleLeft ||
      !circleRight ||
      !stage ||
      !section2 ||
      !section2Head ||
      !section2Lead ||
      !section2Cards
    ) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ticking = false;

    // viewBox 6×12, 원 중심 (3,3) → 높이의 25%
    const SYMBOL_ASPECT = 12 / 6;

    const sceneProgress = () => {
      const rect = scene.getBoundingClientRect();
      const totalDistance = scene.offsetHeight - window.innerHeight;
      if (totalDistance <= 0) return 0;
      // dwell 구간은 p=1로 고정 → 전환 속도감은 씬 높이(200/170) 기준과 동일
      const dwell =
        window.innerHeight * (window.innerWidth <= 640 ? S2_DWELL_VH_MOBILE : S2_DWELL_VH);
      const animDistance = Math.max(totalDistance - dwell, 1);
      return clamp(-rect.top / animDistance);
    };

    /** 시작 위치 → 화면 높이 1/2 지점까지 올려야 하는 px */
    const riseDistance = () => {
      const styles = getComputedStyle(indicator);
      const bottom = parseFloat(styles.bottom) || 112;
      const height = indicator.offsetHeight || 54;
      const startCenterY = window.innerHeight - bottom - height / 2;
      const targetCenterY = window.innerHeight * 0.5;
      return Math.max(0, startCenterY - targetCenterY);
    };

    const coverDiameter = (centerX: number, centerY: number) => {
      const farthest = Math.max(
        Math.hypot(centerX, centerY),
        Math.hypot(window.innerWidth - centerX, centerY),
        Math.hypot(centerX, window.innerHeight - centerY),
        Math.hypot(window.innerWidth - centerX, window.innerHeight - centerY),
      );
      return farthest * 2 * 1.08;
    };

    const resetExpand = () => {
      expand.style.width = "0px";
      expand.style.height = "0px";
      expand.style.opacity = "0";
      expand.style.left = "";
      expand.style.top = "";
    };

    const resetCircles = () => {
      circleLeft.style.opacity = "0";
      circleRight.style.opacity = "0";
      circleLeft.style.transform = "";
      circleRight.style.transform = "";
      stage.style.background = "";
    };

    const applyReveal = (el: HTMLElement, t: number) => {
      const e = easeInOutCubic(clamp(t));
      el.style.opacity = e.toFixed(3);
      el.style.transform = `translate3d(0, ${(1 - e) * SECTION2_ENTER_RISE}px, 0)`;
    };

    const resetSection2 = () => {
      section2.style.pointerEvents = "none";
      applyReveal(section2Head, 0);
      applyReveal(section2Lead, 0);
      applyReveal(section2Cards, 0);
    };

    const render = () => {
      ticking = false;
      if (reducedMotion.matches) {
        heroEl.style.opacity = "1";
        heroEl.style.transform = "";
        heroEl.style.filter = "";
        indicator.style.transform = "translateX(-50%)";
        capsule.style.opacity = "1";
        capsule.style.filter = "";
        capsule.style.transform = "";
        wheel.style.opacity = "1";
        resetExpand();
        resetCircles();
        applyReveal(section2Head, 1);
        applyReveal(section2Lead, 1);
        applyReveal(section2Cards, 1);
        section2.style.pointerEvents = "auto";
        return;
      }

      const p = sceneProgress();
      const sceneRect = scene.getBoundingClientRect();
      // fixed 확대 레이어 잔상 방지: 히어로 씬이 위로 완전히 벗어나면 즉시 정리
      const pastScene = sceneRect.bottom <= 0;
      if (pastScene) {
        resetExpand();
        stage.style.background = "";
        return;
      }

      const scrolling = p > 0.008;
      indicator.classList.toggle("is-scrolling", scrolling);

      if (!scrolling) {
        heroEl.style.opacity = "";
        heroEl.style.transform = "";
        heroEl.style.filter = "";
        indicator.style.transform = "";
        capsule.style.opacity = "";
        capsule.style.filter = "";
        capsule.style.transform = "";
        wheel.style.opacity = "";
        resetExpand();
        resetCircles();
        resetSection2();
        return;
      }

      // ── 상승 구간(→ 화면 1/2): hero 타이틀은 기존 유지
      const riseT = easeInOutCubic(clamp(p / RISE_END));
      const riseY = -riseT * riseDistance();
      const indicatorScale = 1 + riseT * (RISE_SCALE - 1);

      // 키홀+캡슐: 상승하며 함께 커짐
      indicator.style.transform = `translateX(-50%) translateY(${riseY}px) scale(${indicatorScale})`;

      heroEl.style.opacity = map(riseT, 0.08, 1, 1, 0).toFixed(3);
      heroEl.style.filter = `blur(${map(riseT, 0.08, 1, 0, 14)}px)`;
      heroEl.style.transform = `translate3d(0, ${riseY + map(riseT, 0, 1, 0, -48)}px, 0) scale(${map(riseT, 0, 1, 1, 0.94)})`;

      // 캡슐: 커지면서(부모 scale) 자연스럽게 페이드만
      capsule.style.transform = "";
      capsule.style.filter = "";
      // 기존(0.18→0.88) 대비 약 2배 빠르게 페이드아웃
      capsule.style.opacity = map(riseT, 0.12, 0.48, 1, 0).toFixed(3);

      const stageRect = stage.getBoundingClientRect();
      const wheelRect = wheel.getBoundingClientRect();
      const centerX = wheelRect.left + wheelRect.width / 2;
      const centerY = wheelRect.top + wheelRect.height / 2;
      // absolute 확대 레이어는 stage 기준 좌표
      const localX = centerX - stageRect.left;
      const localY = centerY - stageRect.top;

      // 확대는 스크롤에 선형으로 이어지게 (이징 끊김 = 1/2에서 멈칫하는 원인 제거)
      const startWidth = WHEEL_DIAMETER;
      const halfWidth = Math.max(KEYHOLE_DIAMETER_AT_HALF, startWidth);
      const endWidth = coverDiameter(centerX, centerY);

      let width: number;
      if (p <= RISE_END) {
        // riseT(easeInOut) 쓰지 않음 — 끝에서 속도 0이 되며 멈칫함
        const t = clamp(p / RISE_END);
        width = lerpLog(startWidth, halfWidth, t);
      } else {
        // 이징 없이 스크롤에 선형 연결 → 1/2에서 속도가 0으로 떨어지지 않음
        const t = clamp((p - RISE_END) / (EXPAND_END - RISE_END));
        width = lerpLog(halfWidth, endWidth, t);
      }
      const height = width * SYMBOL_ASPECT;

      expand.style.left = `${localX}px`;
      expand.style.top = `${localY}px`;
      expand.style.width = `${width}px`;
      expand.style.height = `${height}px`;
      expand.style.opacity = width > startWidth + 0.5 ? "1" : "0";

      // 확대 SVG가 보이면 작은 휠은 넘김
      const coverRatio = width / Math.max(endWidth, 1);
      wheel.style.opacity = map(width / Math.max(halfWidth, 1), 0.08, 0.35, 1, 0).toFixed(3);

      // 키홀이 거의 덮으면 sticky 배경도 다크로 (원 레이어 뒤 비침 방지)
      stage.style.background = coverRatio > 0.92 ? INSIDE : "";

      // ── 2단계: 키홀 ~80% 이후 양쪽 원이 가운데로 모여 겹침에서 정지
      let circleT = 0;
      if (coverRatio >= CIRCLE_COVER_TRIGGER) {
        const coverPart = clamp(
          (coverRatio - CIRCLE_COVER_TRIGGER) / (1 - CIRCLE_COVER_TRIGGER),
        );
        const scrollPart =
          p <= EXPAND_END ? 0 : clamp((p - EXPAND_END) / Math.max(1 - EXPAND_END, 0.001));
        circleT = easeInOutCubic(
          clamp(coverPart * CIRCLE_COVER_WEIGHT + scrollPart * CIRCLE_SCROLL_WEIGHT),
        );
      }

      // 해상도 무관: 크기는 vmin 기준, 좌우 이동·겹침은 원 지름 비율
      const vmin = Math.min(window.innerWidth, window.innerHeight);
      const circleSize = Math.min(
        vmin * MERGE_CIRCLE_VMIN,
        window.innerWidth * MERGE_CIRCLE_MAX_VW,
      );
      const startMergeX = circleSize * MERGE_START_X_OF_CIRCLE;
      const endMergeX = circleSize * MERGE_END_X_OF_CIRCLE;
      const mergeX = startMergeX + circleT * (endMergeX - startMergeX);
      const isMobile = window.innerWidth <= 640;
      const mergeY = `-${isMobile ? MERGE_Y_PERCENT_MOBILE : MERGE_Y_PERCENT}%`;
      const circleVisible = coverRatio >= CIRCLE_COVER_TRIGGER ? "1" : "0";
      const sizePx = `${circleSize}px`;

      circleLeft.style.width = sizePx;
      circleLeft.style.height = sizePx;
      circleRight.style.width = sizePx;
      circleRight.style.height = sizePx;
      circleLeft.style.opacity = circleVisible;
      circleRight.style.opacity = circleVisible;
      circleLeft.style.transform = `translate(-50%, ${mergeY}) translateX(${-mergeX}px)`;
      circleRight.style.transform = `translate(-50%, ${mergeY}) translateX(${mergeX}px)`;

      // 원 합류 중후반 — 1 헤드 → 2 리드 → 3 박스 순차 등장
      const headT = clamp((circleT - S2_REVEAL_START) / S2_REVEAL_DURATION);
      const leadT = clamp(
        (circleT - (S2_REVEAL_START + S2_REVEAL_STAGGER)) / S2_REVEAL_DURATION,
      );
      const cardsT = clamp(
        (circleT - (S2_REVEAL_START + S2_REVEAL_STAGGER * 2)) / S2_REVEAL_DURATION,
      );
      applyReveal(section2Head, headT);
      applyReveal(section2Lead, leadT);
      applyReveal(section2Cards, cardsT);
      section2.style.pointerEvents = headT > 0.55 ? "auto" : "none";
    };

    const requestRender = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(render);
      }
    };

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    reducedMotion.addEventListener?.("change", requestRender);
    render();

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      reducedMotion.removeEventListener?.("change", requestRender);
    };
  }, []);

  return (
    <>
      <section ref={sceneRef} className="hero-transition-scene" id="top">
        <div ref={stageRef} className="hero-sticky-stage">
          <section
            ref={heroRef}
            className="hero-focus relative flex h-full items-center justify-center overflow-hidden text-center"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-[210px] -top-[120px] h-[560px] w-[560px] rounded-full border border-primary/14 opacity-45"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-[-170px] right-[120px] h-[300px] w-[300px] rounded-full border border-primary/14 opacity-45"
            />

            <div className="hero-focus-inner zt-container-hero relative z-[1] flex flex-col items-center">
              <p className="hero-focus-eyebrow">{hero.eyebrow}</p>

              <h1 className="hero-focus-title">
                <span className="hero-focus-brand" aria-label="ZeroTiCA">
                  ZeroT
                  <span className="hero-focus-brand-i" aria-hidden="true">
                    ı
                    <span className="hero-focus-brand-idot" />
                  </span>
                  CA
                </span>
                <span className="hero-focus-headline">로</span>
                <br />
                <span className="hero-focus-headline hero-focus-headline-line">
                  <span className="hero-focus-accent">{hero.headlineAccent}</span>
                  {hero.headlineRest}
                </span>
              </h1>

              <p className="hero-focus-lead">{hero.sub}</p>

              <div className="hero-focus-actions">
                <a href={hero.ctaVideo.href} className="hero-focus-btn hero-focus-btn-secondary">
                  {hero.ctaVideo.label}
                </a>
                <a href="#journey" className="hero-focus-btn hero-focus-btn-primary">
                  {hero.ctaFlow.label}
                </a>
              </div>
            </div>
          </section>

          <div ref={indicatorRef} className="hero-indicator" aria-hidden="true">
            <div ref={capsuleRef} className="hero-indicator-capsule" />
            <div ref={wheelRef} className="hero-indicator-wheel" />
          </div>

          <svg
            ref={expandRef}
            className="hero-indicator-expand"
            viewBox="0 0 6 12"
            aria-hidden="true"
          >
            <circle cx="3" cy="3" r="3" fill={INSIDE} />
            <rect x="1.5" y="4" width="3" height="7" rx="1.5" fill={INSIDE} />
          </svg>

          {/* 키홀 ~80% 이후: 좌우 원이 가운데로 모여 겹침 */}
          <div className="hero-merge-circles" aria-hidden="true">
            <div ref={circleLeftRef} className="hero-merge-circle" />
            <div ref={circleRightRef} className="hero-merge-circle" />
          </div>

          {/* 섹션2 콘텐츠 — 원 합류 시 1→2→3 순차 등장 */}
          <div
            ref={section2Ref}
            id="section-2"
            className="pointer-events-none absolute inset-0 z-[7] flex items-center justify-center"
            style={{ transform: `translate3d(0, ${SECTION2_Y_OFFSET}px, 0)` }}
          >
            <div className="zt-container-hero flex w-full flex-col items-stretch text-left">
              <div
                ref={section2HeadRef}
                className="opacity-0"
                style={{ transform: `translate3d(0, ${SECTION2_ENTER_RISE}px, 0)` }}
              >
                <p className="text-[16px] font-bold tracking-wide text-primary">
                  {section2Gap.eyebrow}
                </p>
                <h2 className="mt-[32px] max-w-[820px] text-[28px] font-extrabold leading-[1.35] tracking-tight text-zinc-900 [word-break:keep-all] sm:mt-[40px] sm:text-[36px] lg:text-[46px]">
                  {section2Gap.title}
                  <br />
                  {section2Gap.titleLine2}
                </h2>
              </div>

              <div
                ref={section2LeadRef}
                className="opacity-0"
                style={{ transform: `translate3d(0, ${SECTION2_ENTER_RISE}px, 0)` }}
              >
                <p className="mt-3 max-w-[640px] text-[20px] leading-relaxed text-slate-500 sm:mt-4">
                  {section2Gap.lead}
                </p>
              </div>

              <div
                ref={section2CardsRef}
                className="mt-[56px] w-full overflow-hidden rounded-[28px] bg-white/85 opacity-0 shadow-[0_18px_50px_rgba(171,209,255,0.55)] sm:mt-[72px] sm:rounded-[32px]"
                style={{ transform: `translate3d(0, ${SECTION2_ENTER_RISE}px, 0)` }}
              >
                <div className="grid grid-cols-1 divide-y divide-slate-200/90 md:grid-cols-3 md:divide-y-0">
                  {section2Gap.cards.map((card) => (
                    <article
                      key={card.num}
                      className="relative flex flex-col items-start p-8 text-left sm:p-12 md:[&:not(:first-child)]:before:absolute md:[&:not(:first-child)]:before:bottom-12 md:[&:not(:first-child)]:before:left-0 md:[&:not(:first-child)]:before:top-12 md:[&:not(:first-child)]:before:w-px md:[&:not(:first-child)]:before:bg-slate-200/90"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-[13px] font-bold tracking-wide text-white sm:h-10 sm:w-10 sm:text-[14px]">
                        {card.num}
                      </span>
                      <h3 className="mt-5 text-[18px] font-bold leading-snug tracking-tight text-zinc-900 [word-break:keep-all] sm:text-[26px]">
                        {card.title}
                        <br />
                        {card.titleLine2}
                      </h3>
                      <p className="mt-6 text-[14px] leading-relaxed text-slate-500 [word-break:keep-all] sm:mt-10 sm:text-[18px]">
                        {card.body}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
