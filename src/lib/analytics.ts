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
  verificationProcess: {
    cta_name: "verification_process",
    cta_location: "hero",
    cta_text: "검증 과정 확인하기",
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
