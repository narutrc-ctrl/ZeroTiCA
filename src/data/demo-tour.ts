export type TourStep = {
  id: string;
  route: string;
  search?: string;
  target: string;
  title: string;
  body: string;
  placement?: "top" | "bottom" | "left" | "right";
  /** 시트·뷰어 등 UI 전환 후 하이라이트 재측정 대기(ms) */
  measureDelay?: number;
};

export type TourUiState = {
  taskSheetOpen: boolean;
  reportDialogOpen: boolean;
};

export function resolveTour(pathname: string, tour: string | null, tab: string | null): TourStep[] | null {
  if (tour === "full") return fullDemoTour;
  if (tour !== "1") return null;
  if (pathname.startsWith("/demo/task")) return demoTours.task;
  if (pathname.startsWith("/demo/event")) {
    if (tab === "reports") return demoTours.report;
    return demoTours.event;
  }
  return null;
}

export function resolveTourUiState(stepId: string | undefined): TourUiState {
  if (!stepId) return { taskSheetOpen: false, reportDialogOpen: false };

  switch (stepId) {
    case "task-3":
      return { taskSheetOpen: true, reportDialogOpen: false };
    case "report-2":
    case "report-3":
      return { taskSheetOpen: false, reportDialogOpen: true };
    default:
      return { taskSheetOpen: false, reportDialogOpen: false };
  }
}

export const demoTours: Record<string, TourStep[]> = {
  task: [
    {
      id: "task-1",
      route: "/demo/task",
      target: "[data-tour='task-toolbar']",
      title: "업무 관리",
      body: "고객 계정의 업무 관리 화면입니다. 기간·목록/칸반 보기로 진행 중인 업무를 확인합니다.",
      placement: "bottom",
    },
    {
      id: "task-2",
      route: "/demo/task",
      target: "[data-tour='task-kanban']",
      title: "업무 요청 · 확인 · 완료",
      body: "고객에게는 업무 요청 → 업무 확인 → 업무 완료 단계로 표시됩니다. 실제 RUNA 칸반과 동일한 구조입니다.",
      placement: "top",
    },
    {
      id: "task-3",
      route: "/demo/task",
      target: "[data-task-detail-sheet]",
      title: "업무 상세 Sheet",
      body: "업무 카드를 선택하면 우측에서 Sheet가 열립니다. 요청일시·위협 내역·분석 본문·댓글을 한곳에서 확인합니다.",
      placement: "left",
      measureDelay: 420,
    },
  ],
  event: [
    {
      id: "event-1",
      route: "/demo/event",
      target: "[data-tour='event-tabs']",
      title: "대시보드 탭",
      body: "고객은 단계별 요약과 침해 평가 보고서 탭만 이용합니다.",
      placement: "bottom",
    },
    {
      id: "event-2",
      route: "/demo/event",
      target: "[data-tour='event-sidebar']",
      title: "단계별 필터",
      body: "현황 또는 1~3단계(아웃바운드·인바운드·측면이동)를 선택해 집계를 봅니다.",
      placement: "right",
    },
    {
      id: "event-3",
      route: "/demo/event",
      target: "[data-tour='event-table']",
      title: "단계별 집계표",
      body: "발생 이벤트·위협 의심·유효 위협 건수를 Stage별로 확인합니다.",
      placement: "top",
    },
  ],
  report: [
    {
      id: "report-1",
      route: "/demo/event",
      search: "tab=reports",
      target: "[data-tour='report-list']",
      title: "보고서 목록",
      body: "기간별 침해 평가 보고서를 조회합니다. 발행 완료된 보고서를 선택해 내용을 확인합니다.",
      placement: "bottom",
    },
    {
      id: "report-2",
      route: "/demo/event",
      search: "tab=reports",
      target: "[data-tour='report-preview']",
      title: "보고서 미리보기",
      body: "목록에서 보고서를 선택하면 전체 화면 뷰어가 열립니다. 평가 개요·결과 요약이 A4 형식으로 제공됩니다.",
      placement: "left",
      measureDelay: 320,
    },
    {
      id: "report-3",
      route: "/demo/event",
      search: "tab=reports",
      target: "[data-tour='report-threat-summary']",
      title: "위협 분석 결과 요약",
      body: "기간 내 업무(Task)를 날짜순으로 요약합니다. 이슈·원인과 결과·상태를 한눈에 볼 수 있습니다.",
      placement: "top",
    },
  ],
};

export const fullTourOrder = ["task", "event", "report"] as const;

export const fullDemoTour: TourStep[] = fullTourOrder.flatMap((key) => demoTours[key]);
