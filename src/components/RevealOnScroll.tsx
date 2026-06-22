import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "fade-up" | "fade-left" | "fade-right" | "scale";

const hidden: Record<Variant, string> = {
  "fade-up": "translate-y-10 opacity-0",
  "fade-left": "-translate-x-10 opacity-0",
  "fade-right": "translate-x-10 opacity-0",
  scale: "scale-95 opacity-0",
};

const visible: Record<Variant, string> = {
  "fade-up": "translate-y-0 opacity-100",
  "fade-left": "translate-x-0 opacity-100",
  "fade-right": "translate-x-0 opacity-100",
  scale: "scale-100 opacity-100",
};

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  variant = "fade-up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        show ? visible[variant] : hidden[variant],
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
