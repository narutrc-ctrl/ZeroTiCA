import { useCallback, useEffect, useRef, useState } from "react";
import { YouTubeVideoModal } from "@/components/YouTubeVideoModal";
import { hero, keyholeBridge, section2Gap } from "@/data/content";

const INSIDE = "#10141d";
const WHEEL_DIAMETER = 6;
/** 1/2 지점 도착(= 상승·hero 페이드 끝) */
const RISE_END = 0.26;
/**
 * 1/2 지점 도착 시 키홀 "원" 지름(px).
 * 이 숫자만 바꿔서 크기를 조절하면 됨. (예: 80 / 120 / 180)
 */
const KEYHOLE_DIAMETER_AT_HALF = 40;
/**
 * 확대 구간을 화면 채움(screenFill = 지름/vmin) 기준으로 나눔.
 * — RISE→EXPAND_MID: 작은 키홀 → 화면을 거의 채움 (1번 문구는 여기 중간)
 * — EXPAND_MID→EXPAND_END: 코너까지 덮어 완전 다크
 */
const EXPAND_MID = 0.58;
const EXPAND_END = 0.7;
/** 2번 문구 시작/종료 (스크롤 progress) — 시작은 풀커버보다 살짝 앞 */
const PHRASE2_START = 0.64;
const PHRASE2_END = 0.84;
/**
 * 2번 문구 localT가 이 값에 닿을 때 섹션2 원 합류 시작.
 * (페이드아웃이 거의 끝난 직후 — PHRASE_PEAK 이후 opacity≈0 근처)
 */
const CIRCLE_AT_PHRASE2 = 0.9;
/** 1번 문구 시작/종료 시점의 화면 채움 비율(vmin 대비 키홀 지름) */
const PHRASE1_FILL_START = 0.90;
const PHRASE1_FILL_END = 1.50;
/** EXPAND_MID 에서의 목표 화면 채움 (1 = 짧은 변과 동일 지름) */
const FILL_AT_MID = 1.05;
/** 상승 중 인디케이터(캡슐+키홀) 최대 scale */
const RISE_SCALE = 2.4;
/** 문구 모션 */
const PHRASE_PEAK = 0.3;
const PHRASE_SCALE_FROM = 0.92;
const PHRASE_SCALE_TO = 1.42;
/**
 * 줄별 순차 페이드인 — 페이드인 구간(PHRASE_PEAK) 안에서
 * 다음 줄이 시작되기까지의 비율. 키우면 줄 간 딜레이↑
 */
const PHRASE_LINE_STAGGER = 0.65;

/**
 * 합류 원 — 해상도/비율에 덜 흔들리게 정규화한 값들
 * (크기·이동을 vw가 아니라 vmin / 원 지름 비율로 계산)
 * START/END X는 지름 비율이라 스케일만 키워도 겹침 비율이 유지됨
 */
/** 합쳐진 구도 전체 배율 (지름·중심거리 함께 확대) */
const MERGE_COMPOSITION_SCALE = 1.1;
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
const SECTION2_Y_OFFSET = 100;
/** 섹션2 등장 시 추가로 올라오는 거리 */
const SECTION2_ENTER_RISE = 28;
/** 섹션2 1번(eyebrow+title) 등장 시작 — 기존 contentT와 동일 */
const S2_REVEAL_START = 0.46;
/** 각 그룹 페이드/상승 구간 길이 (circleT 기준) */
const S2_REVEAL_DURATION = 0.34;
/** 그룹 간 등장 시차 (circleT 기준) */
const S2_REVEAL_STAGGER = 0.14;
/** 섹션2 완전 등장 후 sticky 유지 구간 (vh). 0 = 붙잡지 않고 바로 다음 섹션으로 */
const S2_DWELL_VH = 0;
const S2_DWELL_VH_MOBILE = 0;

function clamp(v: number, min = 0, max = 1) {
  return Math.min(Math.max(v, min), max);
}

function map(v: number, a: number, b: number, c: number, d: number) {
  return c + (d - c) * clamp((v - a) / (b - a));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/** 로그 보간 — 큰 확대에서도 속도감이 비교적 일정 */
function lerpLog(a: number, b: number, t: number) {
  const min = Math.max(a, 0.001);
  const max = Math.max(b, 0.001);
  return Math.exp(Math.log(min) + clamp(t) * (Math.log(max) - Math.log(min)));
}

export function HeroSection() {
  const [videoOpen, setVideoOpen] = useState(false);
  const closeVideo = useCallback(() => setVideoOpen(false), []);
  const sceneRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const expandRef = useRef<SVGSVGElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const phrase1Ref = useRef<HTMLParagraphElement>(null);
  const phrase2Ref = useRef<HTMLParagraphElement>(null);
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
    const bridge = bridgeRef.current;
    const phrase1 = phrase1Ref.current;
    const phrase2 = phrase2Ref.current;
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
      !bridge ||
      !phrase1 ||
      !phrase2 ||
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

    /**
     * localT 0→1: 줄별 순차 페이드인 → 함께 확대하며 페이드아웃
     * (줄은 .hero-keyhole-bridge-line-row)
     */
    const applyPhrase = (el: HTMLElement, localT: number) => {
      const t = clamp(localT);
      const lines = el.querySelectorAll<HTMLElement>(".hero-keyhole-bridge-line-row");
      const n = Math.max(lines.length, 1);
      const scale = PHRASE_SCALE_FROM + t * (PHRASE_SCALE_TO - PHRASE_SCALE_FROM);
      el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(4)})`;

      if (t <= 0) {
        el.style.opacity = "0";
        lines.forEach((line) => {
          line.style.opacity = "0";
        });
        return;
      }

      // 피크 이후: 줄은 모두 보인 채 블록 전체 페이드아웃
      if (t >= PHRASE_PEAK) {
        const out = 1 - easeInOutCubic((t - PHRASE_PEAK) / Math.max(1 - PHRASE_PEAK, 0.001));
        el.style.opacity = clamp(out).toFixed(3);
        lines.forEach((line) => {
          line.style.opacity = "1";
        });
        return;
      }

      // 페이드인: 부모는 보이고, 줄만 순차 등장
      el.style.opacity = "1";
      const fadeInT = t / PHRASE_PEAK;
      const stagger = n <= 1 ? 0 : PHRASE_LINE_STAGGER;
      const lineFade = Math.max(1 - (n - 1) * stagger, 0.2);
      lines.forEach((line, i) => {
        const lineT = clamp((fadeInT - i * stagger) / lineFade);
        line.style.opacity = easeInOutCubic(lineT).toFixed(3);
      });
    };

    const resetBridge = () => {
      bridge.style.opacity = "0";
      applyPhrase(phrase1, 0);
      applyPhrase(phrase2, 0);
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
        resetBridge();
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
        resetBridge();
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
        resetBridge();
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

      // 상승: 로그
      // 확대: 화면 채움(screenFill) 기준 선형 → 체감상 고르게 커지고, 중간에 문구 노출
      const startWidth = WHEEL_DIAMETER;
      const halfWidth = Math.max(KEYHOLE_DIAMETER_AT_HALF, startWidth);
      const endWidth = coverDiameter(centerX, centerY);
      const vmin = Math.min(window.innerWidth, window.innerHeight);
      const midWidth = Math.min(FILL_AT_MID * vmin, endWidth);

      let width: number;
      if (p <= RISE_END) {
        const t = clamp(p / RISE_END);
        width = lerpLog(startWidth, halfWidth, t);
      } else if (p <= EXPAND_MID) {
        // 작은 키홀 → 화면을 거의 채울 때까지 (라이트 배경이 주변에 남음)
        const t = clamp((p - RISE_END) / (EXPAND_MID - RISE_END));
        width = halfWidth + t * (midWidth - halfWidth);
      } else if (p <= EXPAND_END) {
        // 코너까지 덮어 완전 다크
        const t = clamp((p - EXPAND_MID) / (EXPAND_END - EXPAND_MID));
        width = midWidth + t * (endWidth - midWidth);
      } else {
        width = endWidth;
      }
      const height = width * SYMBOL_ASPECT;

      expand.style.left = `${localX}px`;
      expand.style.top = `${localY}px`;
      expand.style.width = `${width}px`;
      expand.style.height = `${height}px`;
      expand.style.opacity = width > startWidth + 0.5 ? "1" : "0";

      const coverRatio = width / Math.max(endWidth, 1);
      const screenFill = width / Math.max(vmin, 1);
      wheel.style.opacity = map(width / Math.max(halfWidth, 1), 0.08, 0.35, 1, 0).toFixed(3);

      // 절대 stage 전체를 일찍 칠하지 않음 — 그게 "풀스크린 점프"처럼 보였음.
      // 키홀 SVG가 거의 덮은 뒤에만 sticky 배경을 다크로.
      stage.style.background = coverRatio > 0.96 ? INSIDE : "";

      // ── 1번 문구: 키홀이 화면 중간쯤일 때 페이드인 → 키홀과 같이 커지며 페이드아웃
      const fillRange = Math.max(PHRASE1_FILL_END - PHRASE1_FILL_START, 0.001);
      const phrase1T = clamp((screenFill - PHRASE1_FILL_START) / fillRange);
      applyPhrase(phrase1, phrase1T);

      // ── 2번 문구: 풀커버 직전부터 페이드인 → 확대+페이드아웃
      const phrase2T =
        p <= PHRASE2_START
          ? 0
          : clamp((p - PHRASE2_START) / Math.max(PHRASE2_END - PHRASE2_START, 0.001));
      applyPhrase(phrase2, phrase2T);

      const bridgeVisible =
        (phrase1T > 0 && phrase1T < 1) || (phrase2T > 0 && phrase2T < 1);
      bridge.style.opacity = bridgeVisible ? "1" : "0";

      // ── 섹션2: 2번 문구 페이드아웃이 끝날 때 바로 원 합류
      const circleStartP =
        PHRASE2_START + CIRCLE_AT_PHRASE2 * (PHRASE2_END - PHRASE2_START);
      const circleT =
        p <= circleStartP
          ? 0
          : easeOutCubic(clamp((p - circleStartP) / Math.max(1 - circleStartP, 0.001)));

      // 해상도 무관: 크기는 vmin 기준, 좌우 이동·겹침은 원 지름 비율
      const circleSize =
        Math.min(vmin * MERGE_CIRCLE_VMIN, window.innerWidth * MERGE_CIRCLE_MAX_VW) *
        MERGE_COMPOSITION_SCALE;
      // 중심 거리도 지름 비율 → 스케일과 함께 커져 겹침 비율 유지
      const startMergeX = circleSize * MERGE_START_X_OF_CIRCLE;
      const endMergeX = circleSize * MERGE_END_X_OF_CIRCLE;
      const mergeX = startMergeX + circleT * (endMergeX - startMergeX);
      const isMobile = window.innerWidth <= 640;
      const mergeY = `-${isMobile ? MERGE_Y_PERCENT_MOBILE : MERGE_Y_PERCENT}%`;
      const circleVisible = circleT > 0.001 ? "1" : "0";
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
              <h1 className="hero-focus-title">
                <span className="hero-focus-headline hero-focus-headline-accent">
                  {hero.eyebrow}
                </span>
                <span className="hero-focus-headline">{hero.headline}</span>
                <span className="hero-focus-brand" aria-label="ZeroTiCA">
                  ZeroT
                  <span className="hero-focus-brand-i" aria-hidden="true">
                    ı
                    <span className="hero-focus-brand-idot" />
                  </span>
                  CA
                </span>
              </h1>

              <div className="hero-focus-actions">
                <a href="#journey" className="hero-focus-btn hero-focus-btn-primary">
                  {hero.ctaFlow.label}
                </a>
                <button
                  type="button"
                  className="hero-focus-btn hero-focus-btn-secondary"
                  onClick={() => setVideoOpen(true)}
                >
                  {hero.ctaVideo.label}
                </button>
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

          {/* 키홀 확대 중 1번 문구 → 다크 배경 후 2번 문구 (줄별 순차 페이드인) */}
          <div ref={bridgeRef} className="hero-keyhole-bridge" aria-hidden="true" style={{ opacity: 0 }}>
            <p
              ref={phrase1Ref}
              className="hero-keyhole-bridge-line"
              style={{ opacity: 0, transform: "translate(-50%, -50%) scale(0.94)" }}
            >
              {keyholeBridge.line1.split("\n").map((row, i) => (
                <span key={i} className="hero-keyhole-bridge-line-row" style={{ opacity: 0 }}>
                  {row}
                </span>
              ))}
            </p>
            <p
              ref={phrase2Ref}
              className="hero-keyhole-bridge-line hero-keyhole-bridge-line-emphasis"
              style={{ opacity: 0, transform: "translate(-50%, -50%) scale(0.94)" }}
            >
              {keyholeBridge.line2.split("\n").map((row, i) => (
                <span key={i} className="hero-keyhole-bridge-line-row" style={{ opacity: 0 }}>
                  {row}
                </span>
              ))}
            </p>
          </div>

          {/* 2번 문구 이후: 좌우 원이 가운데로 모여 겹침 */}
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
                <h2 className="hero-section2-title mt-[32px] max-w-[820px] text-[28px] font-extrabold leading-[1.35] tracking-tight text-zinc-900 [word-break:keep-all] sm:mt-[40px] sm:text-[36px] lg:text-[46px]">
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
                      className="relative flex w-full min-w-0 flex-col items-stretch p-8 text-left sm:p-12 md:[&:not(:first-child)]:before:absolute md:[&:not(:first-child)]:before:bottom-12 md:[&:not(:first-child)]:before:left-0 md:[&:not(:first-child)]:before:top-12 md:[&:not(:first-child)]:before:w-px md:[&:not(:first-child)]:before:bg-slate-200/90"
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-[13px] font-bold tracking-wide text-white sm:h-10 sm:w-10 sm:text-[14px]">
                        {card.num}
                      </span>
                      <h3 className="mt-5 w-full text-[18px] font-bold leading-snug tracking-tight text-zinc-900 [word-break:keep-all] sm:text-[26px]">
                        {card.title}
                        <br />
                        <span className="text-primary">{card.titleLine2Accent}</span>
                        {card.titleLine2Rest}
                      </h3>
                      <p className="mt-6 w-full min-w-0 self-stretch text-[14px] leading-relaxed text-slate-500 [word-break:keep-all] sm:mt-10 sm:text-[18px]">
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

      <YouTubeVideoModal
        open={videoOpen}
        onClose={closeVideo}
        videoId={hero.ctaVideo.youtubeId}
        title={hero.ctaVideo.label}
      />
    </>
  );
}
