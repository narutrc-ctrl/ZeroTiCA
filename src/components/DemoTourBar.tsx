import { useNavigate } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { fullDemoTour } from "@/data/demo-tour";
import { beginFullGuideAndTrackFirstStep } from "@/lib/analytics";

export function DemoTourBar() {
  const navigate = useNavigate();

  const startFullTour = () => {
    const first = fullDemoTour[0];
    beginFullGuideAndTrackFirstStep({ id: first.id, total: fullDemoTour.length });
    const search = new URLSearchParams(first.search);
    search.set("tour", "full");
    search.set("step", "0");
    navigate({ pathname: first.route, search: search.toString() });
  };

  /** /#experience 로 가면 데모 섹션으로 강제 스크롤됨. 뒤로가기와 같이 이전 스크롤을 복구한다. */
  const goBackToIntro = () => {
    try {
      const ref = document.referrer;
      if (ref && new URL(ref).origin === window.location.origin) {
        window.history.back();
        return;
      }
    } catch {
      /* ignore invalid referrer */
    }
    window.location.assign("/");
  };

  return (
    <div className="border-b border-blue-100 bg-blue-50 px-3 py-2">
      <div className="flex w-full items-center justify-between gap-3 text-sm">
        <div className="min-w-0 flex-1">
          <p className="truncate text-blue-900">
            ZeroTica Watch 고객 화면 데모 · 실제 서비스 UI를 기반으로 구성되었습니다.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="zt-btn-primary px-3 py-1.5 text-xs"
            onClick={startFullTour}
          >
            <PlayCircle className="h-4 w-4" /> 가이드 시작
          </button>
          <button type="button" onClick={goBackToIntro} className="zt-btn-ghost px-3 py-1.5 text-xs">
            소개로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
