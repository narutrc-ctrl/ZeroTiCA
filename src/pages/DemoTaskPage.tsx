import { useEffect, useMemo, useState } from "react";
import { Calendar, LayoutGrid, List } from "lucide-react";
import {
  KanbanColumn,
  MockRunaShell,
  RunaPageTabs,
  TaskCard,
  taskStatusClass,
} from "@/components/MockRunaShell";
import { TaskDetailSheet } from "@/components/TaskDetailSheet";
import { DEMO_DATE_RANGE, demoTasks, type DemoTask } from "@/data/demo-runa-data";
import { useDemoTour } from "@/hooks/useDemoTour";

import { ISSUE_MENU, KANBAN_COLUMNS } from "@/data/issue-ui-labels";

const COLUMN_META = {
  pre_request: { title: KANBAN_COLUMNS.pre_request, titleClass: "text-slate-600", headerClass: "bg-slate-100" },
  in_request: { title: KANBAN_COLUMNS.in_request, titleClass: "text-blue-500", headerClass: "bg-sky-50" },
  done: { title: KANBAN_COLUMNS.done, titleClass: "text-green-500", headerClass: "bg-emerald-50" },
} as const;

export function DemoTaskPage() {
  const { active: tourActive, ui: tourUi, step: tourStep } = useDemoTour();
  const [selectedId, setSelectedId] = useState("t3");
  const [sheetOpen, setSheetOpen] = useState(false);
  const selected = demoTasks.find((t) => t.id === selectedId) ?? demoTasks[2];

  useEffect(() => {
    if (!tourActive) return;
    setSheetOpen(tourUi.taskSheetOpen);
    if (tourUi.taskSheetOpen) setSelectedId("t3");
  }, [tourActive, tourUi.taskSheetOpen]);

  const bySection = useMemo(() => {
    const map: Record<DemoTask["section"], DemoTask[]> = {
      pre_request: [],
      in_request: [],
      done: [],
    };
    demoTasks.forEach((t) => map[t.section].push(t));
    return map;
  }, []);

  const openTask = (id: string) => {
    setSelectedId(id);
    if (!tourActive || tourUi.taskSheetOpen) setSheetOpen(true);
  };

  return (
    <MockRunaShell>
      <div className="runa-page relative">
        <RunaPageTabs tabs={[{ id: "tasks", label: ISSUE_MENU }]} active="tasks" />

        <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
          <div data-tour="task-toolbar" className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                {DEMO_DATE_RANGE.start} ~ {DEMO_DATE_RANGE.end}
              </div>
              <div className="runa-segment">
                <span className="runa-segment-item">
                  <List className="mr-1 inline h-4 w-4" />
                  리스트
                </span>
                <span className="runa-segment-item runa-segment-item-active">
                  <LayoutGrid className="mr-1 inline h-4 w-4" />
                  칸반
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {[
                { label: "전체", count: demoTasks.length, active: true },
                { label: KANBAN_COLUMNS.pre_request, count: bySection.pre_request.length },
                { label: KANBAN_COLUMNS.in_request, count: bySection.in_request.length },
                { label: KANBAN_COLUMNS.done, count: bySection.done.length },
              ].map((g) => (
                <span
                  key={g.label}
                  className={
                    g.active
                      ? "rounded-xl bg-white px-3 py-1.5 font-medium text-blue-600 shadow-sm"
                      : "rounded-xl px-3 py-1.5 text-slate-500"
                  }
                >
                  {g.label} {g.count}
                </span>
              ))}
            </div>
          </div>

          <div data-tour="task-kanban" className="flex min-w-0 gap-4 overflow-x-auto pb-2">
            {(["pre_request", "in_request", "done"] as const).map((section, i, arr) => {
              const meta = COLUMN_META[section];
              const tasks = bySection[section];
              return (
                <KanbanColumn
                  key={section}
                  title={meta.title}
                  titleClass={meta.titleClass}
                  headerClass={meta.headerClass}
                  count={tasks.length}
                  showArrow={i < arr.length - 1}
                >
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      title={task.title}
                      code={task.code}
                      author={task.author}
                      status={task.statusLabel}
                      statusClass={taskStatusClass(task.status)}
                      highlight={
                        task.id === selectedId &&
                        (!tourActive || tourStep?.id === "task-2" || tourStep?.id === "task-3")
                      }
                      onClick={() => openTask(task.id)}
                      dataTaskOpenSwitch
                    />
                  ))}
                </KanbanColumn>
              );
            })}
          </div>
        </div>

        <TaskDetailSheet
          task={selected}
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          hideBackdrop={tourActive}
        />
      </div>
    </MockRunaShell>
  );
}
