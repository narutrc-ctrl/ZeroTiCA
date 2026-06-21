import type { JourneyActor } from "@/data/journey-steps";
import { actorBadgeStyle, actorBadgeStyleLight } from "@/data/journey-steps";
import { cn } from "@/lib/cn";

export function ActorBadge({
  actor,
  label,
  dark,
}: {
  actor: JourneyActor;
  label: string;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        dark ? actorBadgeStyle[actor] : actorBadgeStyleLight[actor],
      )}
    >
      {label}
    </span>
  );
}
