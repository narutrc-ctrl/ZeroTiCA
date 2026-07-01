import { Bell, ClipboardList } from "lucide-react";
import { BrandMark } from "@/components/BrandLogo";
import { cn } from "@/lib/cn";

export function MiniRunaFrame({
  children,
  className,
  activeNav = "tasks",
  showNotification = false,
  variant = "full",
}: {
  children: React.ReactNode;
  className?: string;
  activeNav?: "dashboard" | "tasks";
  showNotification?: boolean;
  variant?: "full" | "cropped";
}) {
  const cropped = variant === "cropped";

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "hidden w-12 shrink-0 flex-col border-r border-sidebar-border bg-sidebar sm:flex",
            cropped && "opacity-35 blur-[0.3px]",
          )}
        >
          <div className="flex h-10 items-center justify-center">
            <BrandMark size="sm" inverted />
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-1 py-2">
            {[
              { id: "dashboard" as const, icon: Bell },
              { id: "tasks" as const, icon: ClipboardList },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-center rounded-lg py-2",
                    active ? "bg-blue-500/90 text-white" : "text-slate-500",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header
            className={cn(
              "flex h-9 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-3",
              cropped && "opacity-60",
            )}
          >
            <span className="text-[10px] font-medium text-slate-500">RUNA · 이슈 관리</span>
            <span className="relative rounded-full p-1 text-slate-400">
              <Bell className="h-3.5 w-3.5" />
              {showNotification ? (
                <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
              ) : null}
            </span>
          </header>
          <div className={cn("min-h-0 flex-1 overflow-hidden bg-[#F8F9FA] p-3", cropped && "p-2.5")}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
