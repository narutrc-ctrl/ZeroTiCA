import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlayCircle, X } from "lucide-react";
import { useSectionInView } from "@/components/JourneyProgress";
import { paths } from "@/data/content";
import { cn } from "@/lib/cn";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const journeyInView = useSectionInView("journey", "-80px 0px -80px 0px");

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const ratio = doc.scrollTop / Math.max(doc.scrollHeight - doc.clientHeight, 1);
      setVisible(ratio > 0.12 && ratio < 0.92);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed || !visible || journeyInView) return null;

  return (
    <div
      className={cn(
        "fixed bottom-5 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/95 p-2 pl-4 shadow-xl shadow-slate-900/10 backdrop-blur-md transition-all duration-300 lg:bottom-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <p className="hidden flex-1 text-xs text-slate-600 sm:block [word-break:keep-all]">
        3분 데모로 RUNA 화면을 확인해 보세요
      </p>
      <Link to={paths.fullTour} className="zt-btn-primary shrink-0 px-3 py-2 text-xs sm:text-sm">
        <PlayCircle className="h-4 w-4" /> 데모 시작
      </Link>
      <button
        type="button"
        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        onClick={() => setDismissed(true)}
        aria-label="닫기"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
