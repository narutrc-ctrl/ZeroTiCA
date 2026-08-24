import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { paths } from "@/data/content";
import { markDemoEntrySource } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  size?: "default" | "sm";
};

export function TourCTA({ className, size = "default" }: Props) {
  return (
    <Link
      to={paths.fullTour}
      className={cn("zt-btn-primary", size === "sm" && "px-4 py-2 text-xs", className)}
      onClick={() => markDemoEntrySource("other")}
    >
      <PlayCircle className="h-4 w-4" />
      3분 둘러보기
    </Link>
  );
}
