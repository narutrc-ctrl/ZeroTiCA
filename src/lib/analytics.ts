export type CtaClickPayload = {
  event: "cta_click";
  cta_name: string;
  cta_location: string;
  cta_text: string;
};

export type TrackCtaClickInput = {
  cta_name: string;
  cta_location: string;
  cta_text: string;
};

/** 측정 대상 CTA — UI 라벨과 payload cta_text를 분리해 고정한다. */
export const CTA = {
  perspectivesHero: {
    cta_name: "perspectives",
    cta_location: "hero",
    cta_text: "8가지 검증 관점 보기",
  },
  perspectivesHeader: {
    cta_name: "perspectives",
    cta_location: "header",
    cta_text: "검증 관점",
  },
  perspectivesSection: {
    cta_name: "perspectives",
    cta_location: "perspective_section",
    cta_text: "ZeroTiCA의 8가지 검증 관점 보기",
  },
  serviceVideo: {
    cta_name: "service_video",
    cta_location: "hero",
    cta_text: "서비스 영상 보기",
  },
  demoHeader: {
    cta_name: "demo",
    cta_location: "header",
    cta_text: "데모 체험하기",
  },
  demoFloating: {
    cta_name: "demo",
    cta_location: "floating",
    cta_text: "데모 체험하기",
  },
} as const satisfies Record<string, TrackCtaClickInput>;

export function pushDataLayer(payload: Record<string, unknown>): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function trackCtaClick(input: TrackCtaClickInput): void {
  const payload: CtaClickPayload = {
    event: "cta_click",
    cta_name: input.cta_name,
    cta_location: input.cta_location,
    cta_text: input.cta_text,
  };
  pushDataLayer(payload);
}

/* ── Demo GA4 ─────────────────────────────────────────────── */

export type DemoEntrySource = "header" | "floating" | "direct" | "other";
export type DemoExplorationMode = "guide" | "self";
export type DemoGuideGroup = "task" | "event" | "report";

const DEMO_ENTRY_SOURCE_KEY = "zerotica-demo-entry-source";

/** SPA 문서 수명 동안 Demo 영역 방문 여부 (새로고침 시 초기화) */
let demoVisitActive = false;

/** 현재 full guide 실행에서 이미 보낸 step.id */
let fullGuideVisitedSteps = new Set<string>();
let fullGuideRunActive = false;

export function isDemoPathname(pathname: string): boolean {
  return /(?:^|\/)demo(?:\/|$)/.test(pathname);
}

export function guideGroupFromStepId(stepId: string): DemoGuideGroup {
  if (stepId.startsWith("event")) return "event";
  if (stepId.startsWith("report")) return "report";
  return "task";
}

/** CTA 클릭 직후 Demo 진입 전 source 보관 (consume-once) */
export function markDemoEntrySource(source: Exclude<DemoEntrySource, "direct">): void {
  try {
    sessionStorage.setItem(DEMO_ENTRY_SOURCE_KEY, source);
  } catch {
    /* private mode 등 */
  }
}

function consumeDemoEntrySource(): DemoEntrySource {
  try {
    const raw = sessionStorage.getItem(DEMO_ENTRY_SOURCE_KEY);
    if (raw) {
      sessionStorage.removeItem(DEMO_ENTRY_SOURCE_KEY);
      if (raw === "header" || raw === "floating" || raw === "other") return raw;
    }
  } catch {
    /* ignore */
  }
  return "direct";
}

/**
 * 비-Demo → Demo 최초 진입(또는 이탈 후 재진입) 시 1회.
 * Demo 내부 route/query 이동에서는 재발생하지 않음.
 */
export function trackDemoStartIfNeeded(pathname: string): void {
  const inDemo = isDemoPathname(pathname);
  if (!inDemo) {
    demoVisitActive = false;
    endFullGuideRun();
    return;
  }
  if (demoVisitActive) return;
  demoVisitActive = true;
  pushDataLayer({
    event: "demo_start",
    entry_source: consumeDemoEntrySource(),
  });
}

/** full guide 새 실행 시작 — visited step reset */
export function beginFullGuideRun(): void {
  fullGuideRunActive = true;
  fullGuideVisitedSteps = new Set();
}

export function endFullGuideRun(): void {
  fullGuideRunActive = false;
  fullGuideVisitedSteps = new Set();
}

export type DemoGuideStepViewPayload = {
  event: "demo_guide_step_view";
  guide_type: "full";
  guide_step: number;
  guide_step_id: string;
  guide_group: DemoGuideGroup;
  guide_total: number;
};

export function trackDemoGuideStepView(input: {
  guide_step: number;
  guide_step_id: string;
  guide_group: DemoGuideGroup;
  guide_total: number;
}): void {
  if (!fullGuideRunActive) beginFullGuideRun();
  if (fullGuideVisitedSteps.has(input.guide_step_id)) return;
  fullGuideVisitedSteps.add(input.guide_step_id);
  const payload: DemoGuideStepViewPayload = {
    event: "demo_guide_step_view",
    guide_type: "full",
    guide_step: input.guide_step,
    guide_step_id: input.guide_step_id,
    guide_group: input.guide_group,
    guide_total: input.guide_total,
  };
  pushDataLayer(payload);
}

export function trackDemoGuideNavigation(input: {
  action: "next" | "previous";
  from_step: number;
  to_step: number;
  from_step_id: string;
  to_step_id: string;
}): void {
  pushDataLayer({
    event: "demo_guide_navigation",
    action: input.action,
    from_step: input.from_step,
    to_step: input.to_step,
    from_step_id: input.from_step_id,
    to_step_id: input.to_step_id,
  });
}

export function trackDemoGuideComplete(guideTotal: number): void {
  pushDataLayer({
    event: "demo_guide_complete",
    guide_type: "full",
    guide_total: guideTotal,
  });
}

export function trackDemoGuideAction(action: "back_to_intro" | "continue_demo"): void {
  pushDataLayer({
    event: "demo_guide_action",
    action,
  });
}

export function trackDemoIssueOpen(input: {
  issue_id: string;
  exploration_mode: DemoExplorationMode;
}): void {
  pushDataLayer({
    event: "demo_issue_open",
    issue_id: input.issue_id,
    exploration_mode: input.exploration_mode,
  });
}

export function trackDemoThreatDetailView(input: {
  issue_id: string;
  threat_id: string;
  exploration_mode: DemoExplorationMode;
}): void {
  pushDataLayer({
    event: "demo_threat_detail_view",
    issue_id: input.issue_id,
    threat_id: input.threat_id,
    exploration_mode: input.exploration_mode,
  });
}

export function trackDemoReportView(view_source: "guide" | "manual"): void {
  pushDataLayer({
    event: "demo_report_view",
    view_source,
  });
}

/** guide가 뷰어를 연 연속 구간당 1회 (StrictMode remount 대비 모듈 플래그) */
let guideReportOpenTracked = false;

export function trackDemoReportViewFromGuide(): void {
  if (guideReportOpenTracked) return;
  guideReportOpenTracked = true;
  trackDemoReportView("guide");
}

export function resetGuideReportViewTracking(): void {
  guideReportOpenTracked = false;
}

/** full guide 시작 버튼/프롬프트용 — visited reset + step 1 측정 */
export function beginFullGuideAndTrackFirstStep(firstStep: {
  id: string;
  total: number;
}): void {
  beginFullGuideRun();
  trackDemoGuideStepView({
    guide_step: 1,
    guide_step_id: firstStep.id,
    guide_group: guideGroupFromStepId(firstStep.id),
    guide_total: firstStep.total,
  });
}
