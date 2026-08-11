import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PlayCircle, X } from "lucide-react";
import { fullDemoTour } from "@/data/demo-tour";
// TODO: 도입 문의 CTA — 요청 시 주석 해제
// import { useContactModal } from "@/components/ContactModal";
const STORAGE_KEY = "zerotica-demo-prompt-dismissed";

export function DemoTourPrompt() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (params.get("tour")) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = window.setTimeout(() => setOpen(true), 400);
    return () => window.clearTimeout(t);
  }, [params]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const startTour = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
    const first = fullDemoTour[0];
    const search = new URLSearchParams(first.search);
    search.set("tour", "full");
    search.set("step", "0");
    navigate({ pathname: first.route, search: search.toString() });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">서비스 데모</p>
            <h2 className="mt-1 text-xl font-bold text-zinc-800">가이드로 둘러보시겠습니까?</h2>
          </div>
          <button type="button" onClick={dismiss} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          이슈 관리 → 대시보드 → 침해 평가 보고서 순으로 약 3분 안에 제로티카 고객 화면을 안내해 드립니다.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={startTour} className="zt-btn-primary flex-1">
            <PlayCircle className="h-4 w-4" /> 가이드로 둘러보기
          </button>
          <button type="button" onClick={dismiss} className="zt-btn-ghost flex-1">
            직접 탐색하기
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          언제든 상단 「가이드 시작」으로 다시 시작할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

export function TourCompleteModal({ onClose }: { onClose: () => void }) {
  // TODO: 도입 문의 CTA — 요청 시 주석 해제
  // const { openContactModal } = useContactModal();

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">둘러보기 완료</p>
        <h2 className="mt-1 text-xl font-bold text-zinc-800">제로티카 서비스를 확인하셨습니다</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          도입·PoC·견적 상담이 필요하시면 문의를 남겨 주세요. 담당자가 연락드립니다.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          {/* TODO: 도입 문의 CTA — 요청 시 주석 해제
          <button
            type="button"
            className="zt-btn-primary flex-1"
            onClick={() => {
              onClose();
              openContactModal();
            }}
          >
            도입 문의하기
          </button>
          */}
          <Link to="/" className="zt-btn-ghost flex-1 text-center" onClick={onClose}>
            소개 페이지로
          </Link>
        </div>
        <button type="button" onClick={onClose} className="mt-3 w-full text-center text-sm text-slate-500 hover:text-slate-700">
          데모 계속 탐색
        </button>
      </div>
    </div>
  );
}
