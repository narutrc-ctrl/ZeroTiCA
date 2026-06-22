import { Link, useLocation } from "react-router-dom";
import { AppWindow, Bell, ChevronRight, ClipboardList, User } from "lucide-react";
import { BrandMark } from "@/components/BrandLogo";
import { cn } from "@/lib/cn";

const sideNav = [
  { to: "/demo/event", label: "대시보드", icon: AppWindow, match: (p: string) => p.startsWith("/demo/event") },
  { to: "/demo/task", label: "업무관리", icon: ClipboardList, match: (p: string) => p.startsWith("/demo/task") },
];

export function MockRunaShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-white">
      <aside className="flex w-20 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-16 shrink-0 items-center justify-center">
          <BrandMark size="sm" inverted />
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
          {sideNav.map((item) => {
            const Icon = item.icon;
            const active = item.match(location.pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl pb-3 pt-1 text-sidebar-foreground",
                  !active && "hover:bg-slate-700/60",
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl [&>svg]:h-6 [&>svg]:w-6",
                    active ? "bg-blue-500 text-white" : "text-inherit",
                  )}
                >
                  <Icon />
                </span>
                <span className="line-clamp-2 w-full text-center text-[11px] leading-tight text-slate-400">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
          <div className="text-sm text-slate-500">ZeroTica Watch · 데모 고객 계정</div>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              <span className="font-semibold">demo_admin</span>님 환영합니다
            </span>
            <button type="button" className="rounded-full p-2 text-slate-600 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
            </button>
            <button type="button" className="rounded-full p-2 text-slate-600 hover:bg-slate-100">
              <User className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

export function RunaPageTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange?: (id: string) => void;
}) {
  return (
    <div data-tour="event-tabs" className="runa-page-tabs px-6">
      <div className="flex gap-6">
        {tabs.map((tab) =>
          onChange ? (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "px-1 py-3 text-sm font-semibold",
                tab.id === active ? "runa-tab-active" : "runa-tab-inactive",
              )}
            >
              {tab.label}
            </button>
          ) : (
            <span
              key={tab.id}
              className={cn(
                "cursor-default px-1 py-3 text-sm font-semibold",
                tab.id === active ? "runa-tab-active" : "runa-tab-inactive",
              )}
            >
              {tab.label}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export function KanbanColumn({
  title,
  titleClass,
  headerClass,
  count,
  children,
  showArrow,
}: {
  title: string;
  titleClass: string;
  headerClass: string;
  count: number;
  children: React.ReactNode;
  showArrow?: boolean;
}) {
  return (
    <>
      <div className="flex min-w-[300px] flex-1 flex-col">
        <div className={cn("mb-3 flex items-center gap-2 rounded-xl px-4 py-2.5", headerClass)}>
          <span className={cn("text-sm font-semibold", titleClass)}>{title}</span>
          <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-600">
            {count}
          </span>
        </div>
        <div className="space-y-3">{children}</div>
      </div>
      {showArrow && (
        <div className="flex shrink-0 items-center self-center text-slate-300">
          <ChevronRight className="h-6 w-6" />
        </div>
      )}
    </>
  );
}

export function TaskCard({
  title,
  code,
  author,
  status,
  statusClass,
  highlight,
  onClick,
  dataTaskOpenSwitch,
}: {
  title: string;
  code: string;
  author: string;
  status: string;
  statusClass: string;
  highlight?: boolean;
  onClick?: () => void;
  dataTaskOpenSwitch?: boolean;
}) {
  return (
    <button
      type="button"
      data-task-open-switch={dataTaskOpenSwitch ? "" : undefined}
      onClick={onClick}
      className={cn(
        "runa-card w-full p-4 text-left transition hover:shadow-lg",
        highlight && "ring-2 ring-blue-500/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <span className={cn("shrink-0 rounded-xl border px-2 py-0.5 text-[11px] font-semibold", statusClass)}>
          {status}
        </span>
      </div>
      <p className="mt-2 flex flex-wrap gap-x-3 text-sm">
        <span className="font-medium tabular-nums text-blue-500">{code}</span>
        <span className="text-slate-600">{author}</span>
      </p>
    </button>
  );
}

const STATUS_CLASS: Record<string, string> = {
  writing: "bg-white border-slate-200 text-slate-600",
  requested: "bg-white border-blue-300 text-blue-600",
  checking: "bg-sky-50 border-sky-300 text-sky-700",
  completed: "bg-green-50 border-green-300 text-green-600",
};

export function taskStatusClass(status: string) {
  return STATUS_CLASS[status] ?? STATUS_CLASS.writing;
}
