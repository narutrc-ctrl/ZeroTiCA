import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function ScrollProgress({ retracted = false }: { retracted?: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed left-0 top-16 z-50 h-0.5 bg-blue-500 transition-[width,transform] duration-150 motion-reduce:transition-none",
        "duration-300 ease-out",
        retracted && "max-sm:-translate-y-[4.25rem]",
      )}
      style={{ width: `${progress}%` }}
      aria-hidden
    />
  );
}
