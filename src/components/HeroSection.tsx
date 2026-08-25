import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { YouTubeVideoModal } from "@/components/YouTubeVideoModal";
import { CTA, trackCtaClick } from "@/lib/analytics";
import { hero, keyholeBridge, paths, section2Gap } from "@/data/content";

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
  const section2FlowRef = useRef<HTMLElement>(null);
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
    const mobileLayout = window.matchMedia("(max-width: 640px)");
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
      circleLeft.style.width = "";
      circleRight.style.width = "";
      circleLeft.style.height = "";
      circleRight.style.height = "";
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

    /** 모션 감소: sticky 연출 없이 섹션2까지 고정 노출 (데스크톱 패널) */
    const applyStaticLayout = () => {
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
    };

    const render = () => {
      ticking = false;
      if (reducedMotion.matches) {
        applyStaticLayout();
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
      const isMobile = mobileLayout.matches;
      indicator.classList.toggle("is-scrolling", scrolling);

      /**
       * 모바일
       * — 히어로와 키홀 레이어 분리(CTA 위 겹침 없음)
       * — 중간 전까지 크기 거의 고정 → 이후 완만하게 확대
       * — 확대 progress는 상승 종료 이후 스크롤로만 계산(급확대 방지)
       */
      const KEY_START_W = 12;
      const KEY_MID_W = 18;
      const KEY_GROW_W = 72; // 중간 직후 1차 목표(갑자기 풀스크린 X)

      if (!scrolling) {
        heroEl.style.opacity = "";
        heroEl.style.transform = "";
        heroEl.style.filter = "";
        heroEl.style.pointerEvents = "";
        capsule.style.opacity = "";
        capsule.style.filter = "";
        capsule.style.transform = "";
        indicator.style.opacity = "";
        indicator.style.transform = "";
        wheel.style.opacity = "";
        expand.style.zIndex = "";
        resetExpand();
        resetBridge();
        resetCircles();
        resetSection2();
        return;
      }

      const riseEnd = RISE_END;
      const expandMid = EXPAND_MID;
      const expandEnd = EXPAND_END;
      const riseT = easeInOutCubic(clamp(p / riseEnd));
      const riseY = -riseT * riseDistance();
      const indicatorScale = 1 + riseT * (RISE_SCALE - 1);

      const stageRect = stage.getBoundingClientRect();
      const startWidth = WHEEL_DIAMETER;
      const halfWidth = Math.max(KEYHOLE_DIAMETER_AT_HALF, startWidth);
      const vmin = Math.min(window.innerWidth, window.innerHeight);

      let centerX: number;
      let centerY: number;
      let localX: number;
      let localY: number;
      let width: number;

      if (isMobile) {
        const stageH = stage.offsetHeight;
        const animDistance = Math.max(scene.offsetHeight - window.innerHeight, 1);
        const scrolled = Math.max(0, -sceneRect.top);

        // 키홀 시작점: stage 밖(아래) → 중앙. hero CTA와 겹치지 않음
        const startY = stageH + 36;
        const endY = stageH * 0.5;
        const risePx = startY - endY;
        const keyRise = clamp(scrolled / Math.max(risePx, 1));

        // 히어로: 위치(1:1 상승)는 유지 + 올라가면서 페이드아웃만 추가
        const heroY = -Math.min(scrolled, stageH);
        const heroFadeT = easeInOutCubic(clamp(scrolled / Math.max(stageH, 1)));
        heroEl.style.opacity = (1 - heroFadeT).toFixed(3);
        heroEl.style.filter = "";
        heroEl.style.transform = `translate3d(0, ${heroY}px, 0)`;
        heroEl.style.pointerEvents = heroFadeT > 0.45 ? "none" : "";

        indicator.style.opacity = "0";
        wheel.style.opacity = "0";
        capsule.style.opacity = "0";

        localX = stageRect.width / 2;
        localY = startY + (endY - startY) * keyRise;
        centerX = stageRect.left + localX;
        centerY = stageRect.top + localY;

        const endWidth = coverDiameter(centerX, centerY);
        const midWidth = Math.min(FILL_AT_MID * vmin, endWidth);

        // 상승 이후 스크롤만으로 확대 (p 절대값 충돌로 급점프 하던 문제 제거)
        const expandScrolled = Math.max(0, scrolled - risePx);
        const expandDistance = Math.max(animDistance - risePx, 1);
        const expandT = clamp(expandScrolled / expandDistance);

        if (keyRise < 1) {
          width = KEY_START_W + keyRise * (KEY_MID_W - KEY_START_W);
        } else if (expandT < 0.38) {
          // 1차: 아주 천천히 커짐
          const t = easeInOutCubic(expandT / 0.38);
          width = KEY_MID_W + t * (KEY_GROW_W - KEY_MID_W);
        } else if (expandT < 0.72) {
          // 2차: 화면을 거의 채움 (문구1 구간)
          const t = easeInOutCubic((expandT - 0.38) / 0.34);
          width = KEY_GROW_W + t * (midWidth - KEY_GROW_W);
        } else {
          // 3차: 코너까지 덮어 다크
          const t = clamp((expandT - 0.72) / 0.28);
          width = midWidth + t * (endWidth - midWidth);
        }

        // 첫 화면(스크롤 전)엔 완전 숨김 — CTA와 분리
        const appearT = scrolled <= 2 ? 0 : easeOutCubic(clamp(scrolled / 28));
        // 히어로가 충분히 떠난 뒤에만 키홀을 앞으로
        expand.style.zIndex = keyRise > 0.75 ? "5" : "0";

        const height = width * SYMBOL_ASPECT;
        expand.style.left = `${localX}px`;
        expand.style.top = `${localY}px`;
        expand.style.width = `${width}px`;
        expand.style.height = `${height}px`;
        expand.style.opacity = appearT.toFixed(3);

        const coverRatio = width / Math.max(endWidth, 1);
        const screenFill = width / Math.max(vmin, 1);
        stage.style.background = coverRatio > 0.96 ? INSIDE : "";

        /**
         * 문구 타이밍 (원인/수정)
         * 1) 예전: expandT 초반(키홀 작을 때)에 phraseT가 올라감 → 문구가 너무 일찍 등장
         *    → 키홀이 화면을 충분히 채운 뒤(screenFill)에만 시작
         * 2) 예전: 페이드아웃을 phraseT 1→0으로 되감음 → applyPhrase가 피크로 역재생되며
         *    문구1이 문구2와 겹쳐 다시 보임
         *    → 각 문구 localT는 0→1 단방향만. 끝나면 1로 고정(완전 투명)
         */
        const P1_FILL0 = 0.92;
        const P1_FILL1 = 1.32;
        const P2_FILL0 = 1.4; // 문구1 완전 종료 후 간격
        const P2_FILL1 = 1.78;

        let phrase1T = 0;
        let phrase2T = 0;
        if (screenFill < P1_FILL0) {
          phrase1T = 0;
          phrase2T = 0;
        } else if (screenFill < P1_FILL1) {
          phrase1T = (screenFill - P1_FILL0) / (P1_FILL1 - P1_FILL0);
          phrase2T = 0;
        } else if (screenFill < P2_FILL0) {
          phrase1T = 1; // 종료 상태 유지 (되감기 금지)
          phrase2T = 0;
        } else if (screenFill < P2_FILL1) {
          phrase1T = 1;
          phrase2T = (screenFill - P2_FILL0) / (P2_FILL1 - P2_FILL0);
        } else {
          phrase1T = 1;
          phrase2T = 1;
        }

        applyPhrase(phrase1, phrase1T);
        applyPhrase(phrase2, phrase2T);

        const bridgeVisible =
          (phrase1T > 0 && phrase1T < 1) || (phrase2T > 0 && phrase2T < 1);
        bridge.style.opacity = bridgeVisible ? "1" : "0";
        bridge.style.zIndex = "6";

        circleLeft.style.opacity = "0";
        circleRight.style.opacity = "0";
        circleLeft.style.transform = "";
        circleRight.style.transform = "";
        resetSection2();
        return;
      }

      // ── 데스크톱
      indicator.style.opacity = "";
      indicator.style.transform = `translateX(-50%) translateY(${riseY}px) scale(${indicatorScale})`;
      heroEl.style.opacity = map(riseT, 0.08, 1, 1, 0).toFixed(3);
      heroEl.style.filter = `blur(${map(riseT, 0.08, 1, 0, 14)}px)`;
      heroEl.style.transform = `translate3d(0, ${riseY + map(riseT, 0, 1, 0, -48)}px, 0) scale(${map(riseT, 0, 1, 1, 0.94)})`;
      heroEl.style.pointerEvents = "";

      capsule.style.transform = "";
      capsule.style.filter = "";
      capsule.style.opacity = map(riseT, 0.12, 0.48, 1, 0).toFixed(3);

      const wheelRect = wheel.getBoundingClientRect();
      centerX = wheelRect.left + wheelRect.width / 2;
      centerY = wheelRect.top + wheelRect.height / 2;
      localX = centerX - stageRect.left;
      localY = centerY - stageRect.top;

      const endWidth = coverDiameter(centerX, centerY);
      const midWidth = Math.min(FILL_AT_MID * vmin, endWidth);

      if (p <= riseEnd) {
        const t = clamp(p / riseEnd);
        width = lerpLog(startWidth, halfWidth, t);
      } else if (p <= expandMid) {
        const t = clamp((p - riseEnd) / (expandMid - riseEnd));
        width = halfWidth + t * (midWidth - halfWidth);
      } else if (p <= expandEnd) {
        const t = clamp((p - expandMid) / (expandEnd - expandMid));
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

      // ── 원 합류 (데스크톱 sticky만 — 모바일은 섹션2로 바로 이어짐)
      if (mobileLayout.matches) {
        // 모바일: 원 합류 없음 — 키홀 다크 직후 섹션2로 이어짐
        circleLeft.style.opacity = "0";
        circleRight.style.opacity = "0";
        circleLeft.style.transform = "";
        circleRight.style.transform = "";
        resetSection2();
      } else {
        const circleStartP =
          PHRASE2_START + CIRCLE_AT_PHRASE2 * (PHRASE2_END - PHRASE2_START);
        const circleT =
          p <= circleStartP
            ? 0
            : easeOutCubic(clamp((p - circleStartP) / Math.max(1 - circleStartP, 0.001)));

        const vmin = Math.min(window.innerWidth, window.innerHeight);
        const circleSize =
          Math.min(vmin * MERGE_CIRCLE_VMIN, window.innerWidth * MERGE_CIRCLE_MAX_VW) *
          MERGE_COMPOSITION_SCALE;
        const startMergeX = circleSize * MERGE_START_X_OF_CIRCLE;
        const endMergeX = circleSize * MERGE_END_X_OF_CIRCLE;
        const mergeX = startMergeX + circleT * (endMergeX - startMergeX);
        const mergeY = `-${MERGE_Y_PERCENT}%`;
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
      }
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
    mobileLayout.addEventListener?.("change", requestRender);
    render();

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      reducedMotion.removeEventListener?.("change", requestRender);
      mobileLayout.removeEventListener?.("change", requestRender);
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
                <img
                  src="/ZeroTiCA-BI-web.svg"
                  alt="ZeroTiCA"
                  width={238}
                  height={44}
                  className="hero-focus-brand"
                  decoding="async"
                  fetchPriority="high"
                />
              </h1>

              <div className="hero-focus-actions">
                <Link
                  to={paths.perspectives}
                  className="hero-focus-btn hero-focus-btn-primary"
                  onClick={() => trackCtaClick(CTA.perspectivesHero)}
                >
                  {hero.ctaFlow.label}
                </Link>
                <button
                  type="button"
                  className="hero-focus-btn hero-focus-btn-secondary"
                  onClick={() => {
                    trackCtaClick(CTA.serviceVideo);
                    setVideoOpen(true);
                  }}
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
          {/* 시각 모션용 레이어는 aria-hidden; 동일 문구는 아래 스크린리더용으로 제공 */}
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
          <div className="sr-only">
            <p>{keyholeBridge.line1.replace(/\n/g, " ")}</p>
            <p>{keyholeBridge.line2.replace(/\n/g, " ")}</p>
          </div>

          {/* 2번 문구 이후: 좌우 원 합류 (데스크톱 sticky) */}
          <div className="hero-merge-circles" aria-hidden="true">
            <div ref={circleLeftRef} className="hero-merge-circle" />
            <div ref={circleRightRef} className="hero-merge-circle" />
          </div>

          {/* 섹션2 — 데스크톱: sticky 안 오버레이 */}
          <div
            ref={section2Ref}
            className="hero-section2-panel pointer-events-none absolute inset-0 z-[7] hidden justify-center sm:flex"
            aria-labelledby="problem-heading"
          >
            <div className="zt-container-hero flex w-full flex-col items-stretch text-left">
              <div
                ref={section2HeadRef}
                className="opacity-0"
                style={{ transform: `translate3d(0, ${SECTION2_ENTER_RISE}px, 0)` }}
              >
                <p className="text-[15px] font-bold tracking-wide text-primary sm:text-[16px]">
                  {section2Gap.eyebrow}
                </p>
                <h2
                  id="problem-heading"
                  className="hero-section2-title mt-5 max-w-[820px] text-[24px] font-extrabold leading-[1.35] tracking-tight text-zinc-900 [word-break:keep-all] sm:mt-[40px] sm:text-[36px] lg:text-[46px]"
                >
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
                <p className="mt-2.5 max-w-[640px] text-[16px] leading-relaxed text-slate-500 sm:mt-4 sm:text-[20px]">
                  {section2Gap.lead}
                </p>
              </div>

              <div
                ref={section2CardsRef}
                className="hero-section2-cards mt-6 w-full overflow-hidden rounded-[24px] bg-white/85 opacity-0 shadow-[0_18px_50px_rgba(171,209,255,0.55)] sm:mt-[72px] sm:rounded-[32px]"
                style={{ transform: `translate3d(0, ${SECTION2_ENTER_RISE}px, 0)` }}
              >
                <div className="grid grid-cols-1 divide-y divide-slate-200/90 md:grid-cols-3 md:divide-y-0">
                  {section2Gap.cards.map((card) => (
                    <article
                      key={card.num}
                      className="hero-section2-card relative flex w-full min-w-0 flex-col items-stretch p-3.5 text-left sm:p-12 md:[&:not(:first-child)]:before:absolute md:[&:not(:first-child)]:before:bottom-12 md:[&:not(:first-child)]:before:left-0 md:[&:not(:first-child)]:before:top-12 md:[&:not(:first-child)]:before:w-px md:[&:not(:first-child)]:before:bg-slate-200/90"
                    >
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold tracking-wide text-white sm:h-10 sm:w-10 sm:text-[14px]">
                        {card.num}
                      </span>
                      <h3 className="mt-2 w-full text-[15px] font-bold leading-snug tracking-tight text-zinc-900 [word-break:keep-all] sm:mt-5 sm:text-[26px]">
                        {card.title}
                        <br />
                        <span className="text-primary">{card.titleLine2Accent}</span>
                        {card.titleLine2Rest}
                      </h3>
                      <p className="mt-1.5 w-full min-w-0 self-stretch text-[12px] leading-relaxed text-slate-500 [word-break:keep-all] sm:mt-10 sm:text-[18px]">
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

      {/* 섹션2 — 모바일: 다크 배경 + 일반 페이지 스크롤 (원 합류 없음) */}
      <section
        ref={section2FlowRef}
        id="problem"
        className="hero-section2-flow"
        aria-labelledby="problem-heading-mobile"
      >
        <div className="zt-container-hero flex w-full flex-col items-stretch text-left">
          <div>
            <p className="text-[15px] font-bold tracking-wide text-[#7eb6ff]">
              {section2Gap.eyebrow}
            </p>
            <h2
              id="problem-heading-mobile"
              className="hero-section2-title mt-3 max-w-[820px] text-[22px] font-extrabold leading-[1.3] tracking-tight text-white [word-break:keep-all]"
            >
              {section2Gap.title}
              <br />
              {section2Gap.titleLine2}
            </h2>
          </div>
          <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-slate-300">
            {section2Gap.lead}
          </p>
          <div className="hero-section2-cards mt-4 w-full overflow-hidden rounded-[20px] bg-white/85">
                <div className="grid grid-cols-1 divide-y divide-slate-200/90 md:grid-cols-3 md:divide-y-0">
                  {section2Gap.cards.map((card) => (
                    <article
                      key={card.num}
                      className="hero-section2-card relative flex w-full min-w-0 flex-col items-stretch p-3.5 text-left sm:p-12 md:[&:not(:first-child)]:before:absolute md:[&:not(:first-child)]:before:bottom-12 md:[&:not(:first-child)]:before:left-0 md:[&:not(:first-child)]:before:top-12 md:[&:not(:first-child)]:before:w-px md:[&:not(:first-child)]:before:bg-slate-200/90"
                    >
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold tracking-wide text-white sm:h-10 sm:w-10 sm:text-[14px]">
                        {card.num}
                      </span>
                      <h3 className="mt-2 w-full text-[15px] font-bold leading-snug tracking-tight text-zinc-900 [word-break:keep-all] sm:mt-5 sm:text-[26px]">
                        {card.title}
                        <br />
                        <span className="text-primary">{card.titleLine2Accent}</span>
                        {card.titleLine2Rest}
                      </h3>
                      <p className="mt-1.5 w-full min-w-0 self-stretch text-[12px] leading-relaxed text-slate-500 [word-break:keep-all] sm:mt-10 sm:text-[18px]">
                        {card.body}
                      </p>
                    </article>
                  ))}
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
