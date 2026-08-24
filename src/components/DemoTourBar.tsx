import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { tourPhases } from "@/data/content";
import { fullDemoTour } from "@/data/demo-tour";
import { beginFullGuideAndTrackFirstStep } from "@/lib/analytics";

function getPhaseLabel(stepIndex: number) {
  const phase = tourPhases.find((p) => stepIndex >= p.stepRange[0] && stepIndex <= p.stepRange[1]);
  return phase?.label ?? "서비스 데모";
}

export function DemoTourBar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const tour = params.get("tour");
  const step = Number(params.get("step") ?? 0);
  const isFullTour = tour === "full";
  const total = isFullTour ? fullDemoTour.length : null;
  const phaseLabel = isFullTour ? getPhaseLabel(step) : null;

  const startFullTour = () => {
    const first = fullDemoTour[0];
    beginFullGuideAndTrackFirstStep({ id: first.id, total: fullDemoTour.length });
    const search = new URLSearchParams(first.search);
    search.set("tour", "full");
    search.set("step", "0");
    navigate({ pathname: first.route, search: search.toString() });
  };

  return (
    <div className="border-b border-blue-100 bg-blue-50 px-3 py-2">
      <div className="flex w-full items-center justify-between gap-3 text-sm">
        <div className="min-w-0 flex-1">
          <p className="truncate text-blue-900">
            ZeroTica Watch 고객 화면 데모 · 실제 서비스 UI를 기반으로 구성되었습니다.
          </p>
          {isFullTour && total !== null && (
            <p className="mt-0.5 truncate text-xs text-blue-700">
              전체 둘러보기 {step + 1}/{total} · {phaseLabel}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="zt-btn-primary px-3 py-1.5 text-xs"
            onClick={startFullTour}
          >
            <PlayCircle className="h-4 w-4" /> 가이드 시작
          </button>
          <Link to="/#experience" className="zt-btn-ghost px-3 py-1.5 text-xs">
            소개로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
