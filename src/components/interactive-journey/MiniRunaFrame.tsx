import { Bell, ClipboardList, User } from "lucide-react";
import { BrandMark } from "@/components/BrandLogo";
import { cn } from "@/lib/cn";

export function MiniRunaFrame({
  children,
  className,
  activeNav = "tasks",
  showNotification = false,
}: {
  children: React.ReactNode;
  className?: string;
  activeNav?: "dashboard" | "tasks";
  showNotification?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[420px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:min-h-[480px]",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-16 shrink-0 flex-col border-r border-sidebar-border bg-sidebar sm:flex">
          <div className="flex h-12 items-center justify-center">
            <BrandMark size="sm" inverted />
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-1.5 py-2">
            {[
              { id: "dashboard" as const, label: "대시", icon: Bell },
              { id: "tasks" as const, label: "업무", icon: ClipboardList },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg py-2 text-[10px]",
                    active ? "bg-blue-500/90 text-white" : "text-slate-400",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-11 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-3">
            <span className="text-[11px] text-slate-500">ZeroTica Watch</span>
            <div className="flex items-center gap-2">
              <span className="hidden text-[11px] text-slate-600 sm:inline">demo_admin</span>
              <span className="relative rounded-full p-1.5 text-slate-500">
                <Bell className="h-4 w-4" />
                {showNotification ? (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                ) : null}
              </span>
              <User className="h-4 w-4 text-slate-400" />
            </div>
          </header>
          <div className="min-h-0 flex-1 overflow-auto bg-[#F8F9FA] p-3 sm:p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
