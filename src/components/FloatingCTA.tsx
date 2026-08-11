import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
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
        "fixed bottom-5 left-1/2 z-30 hidden w-auto max-w-lg -translate-x-1/2 items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-md transition-all duration-300 sm:flex sm:w-[calc(100%-2rem)] sm:gap-2 sm:p-2 sm:pl-4 lg:bottom-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <p className="hidden flex-1 text-xs text-slate-600 sm:block [word-break:keep-all]">
        실제 서비스 화면을 데모로 체험해 보세요
      </p>
      <Link to={paths.fullTour} className="zt-btn-primary shrink-0 px-5 py-2 text-xs sm:px-6 sm:text-sm">
        데모 체험하기
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
