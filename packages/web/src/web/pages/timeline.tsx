import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Task, COLUMNS } from "../types";
import { ChevronLeft, ChevronRight } from "lucide-react";

function noteColorHex(c: string) {
  const m: Record<string, string> = {
    yellow: "#fef9c3", pink: "#fce7f3", blue: "#dbeafe",
    green: "#dcfce7",  orange: "#ffedd5", purple: "#f3e8ff",
  };
  return m[c] ?? "#fef9c3";
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function TimelinePage() {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [picked, setPicked] = useState<Task | null>(null);

  const { data } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.tasks.$get();
      return res.json() as Promise<{ tasks: Task[] }>;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const tasks: Task[] = (data as any)?.tasks ?? [];

  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const firstWeekDay = new Date(year, month, 1).getDay();

  function tasksForDay(d: number) {
    const ds = `${year}-${String(month + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return tasks.filter(t => t.dueDate?.startsWith(ds));
  }

  function prevMonth() { month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1); }
  function nextMonth() { month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1); }

  const isToday = (d: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

  const noDueDate = tasks.filter(t => !t.dueDate);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#fafaf8]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 h-12 border-b border-zinc-200 flex-shrink-0 bg-[#fafaf8]">
        <h1 className="font-nav text-lg">Timeline</h1>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="calendar-nav h-9 w-9 flex items-center justify-center border border-zinc-200 hover:bg-zinc-100 transition-colors text-zinc-500 hover:text-black">
            <ChevronLeft size={18} />
          </button>
          <span className="font-nav text-lg w-44 text-center">
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} className="calendar-nav h-9 w-9 flex items-center justify-center border border-zinc-200 hover:bg-zinc-100 transition-colors text-zinc-500 hover:text-black">
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
            className="text-sm border border-zinc-300 px-4 py-2 ml-2 hover:border-black hover:text-black transition-colors text-zinc-500"
          >
            Today
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <>
          {/* Calendar */}
            <div className="timeline-panel border border-zinc-200 bg-white overflow-hidden">
              {/* Weekday row */}
              <div className="grid grid-cols-7 border-b border-zinc-200">
                {DAYS.map(d => (
                  <div key={d} className="text-center py-3 label-caps text-base border-r last:border-r-0 border-zinc-100">
                    {d}
                  </div>
                ))}
              </div>
              {/* Day cells */}
              <div className="grid grid-cols-7">
                {Array.from({ length: firstWeekDay }).map((_, i) => (
                  <div key={`e${i}`} className="min-h-[112px] border-r border-b border-zinc-100" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const dayTasks = tasksForDay(d);
                  const today_ = isToday(d);
                  return (
                    <div
                      key={d}
                      className="calendar-day min-h-[112px] p-2.5 border-r border-b border-zinc-100 last:border-r-0"
                      style={{ background: today_ ? "#fafaf8" : "white" }}
                    >
                      <div
                        className="day-number text-sm w-7 h-7 flex items-center justify-center mb-2"
                        style={{
                          background: today_ ? "#0a0a0a" : "transparent",
                          color: today_ ? "#fafaf8" : "#6b6b6b",
                        }}
                      >
                        {d}
                      </div>
                      <div className="space-y-0.5">
                        {dayTasks.slice(0, 3).map(t => (
                          <div
                            key={t.id}
                            onClick={() => setPicked(picked?.id === t.id ? null : t)}
                            className="calendar-task font-note-heading text-sm px-2 py-1.5 truncate cursor-pointer hover:opacity-70 transition-opacity"
                            style={{ background: noteColorHex(t.color), color: "#1a1a1a" }}
                            title={t.title}
                          >
                            {t.title}
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="label-caps px-1">+{dayTasks.length - 3}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Task list by status */}
            <div className="timeline-panel border border-zinc-200 bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-200">
                <span className="font-nav text-lg">All Tasks</span>
              </div>
              <div className="divide-y divide-zinc-100">
                {COLUMNS.map(col => {
                  const ct = tasks.filter(t => t.status === col.id);
                  if (!ct.length) return null;
                  return (
                    <div key={col.id} className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: col.color }} />
                        <span className="font-nav text-base">{col.label}</span>
                        <span className="text-sm text-zinc-400">{ct.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ct.map(t => (
                          <div
                            key={t.id}
                            onClick={() => setPicked(picked?.id === t.id ? null : t)}
                            className="timeline-task font-note-heading text-base px-3 py-2 cursor-pointer hover:opacity-70 transition-opacity"
                            style={{ background: noteColorHex(t.color), color: "#1a1a1a" }}
                          >
                            {t.title}
                            {t.dueDate && (
                              <span className="text-xs ml-2 opacity-60">
                                {new Date(t.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {tasks.length === 0 && (
                  <div className="px-6 py-8 label-caps text-base text-zinc-300">No tasks yet</div>
                )}
              </div>
            </div>

            {noDueDate.length > 0 && (
              <div className="timeline-panel border border-zinc-200 bg-white overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-200">
                  <span className="font-nav text-lg">No Due Date</span>
                  <span className="text-sm text-zinc-400 ml-2">{noDueDate.length}</span>
                </div>
                <div className="px-5 py-3 flex flex-wrap gap-1.5">
                  {noDueDate.map(t => (
                    <div
                      key={t.id}
                    className="timeline-task font-note-heading text-base px-3 py-2 opacity-80"
                      style={{ background: noteColorHex(t.color), color: "#1a1a1a" }}
                    >
                      {t.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </>
      </div>

      {/* Floating task detail */}
      {picked && (
        <div
          className="timeline-detail fixed bottom-6 right-6 w-80 border border-zinc-300 bg-white shadow-lg animate-modal p-5"
        >
          <div className="flex items-start justify-between mb-2">
            <div
              className="w-full h-0.5 mb-2"
              style={{ background: noteColorHex(picked.color) }}
            />
          </div>
          <p className="font-note-heading text-xl text-zinc-900 mb-2">
            {picked.title}
          </p>
          <div className="space-y-0.5">
            <p className="label-caps">{COLUMNS.find(c => c.id === picked.status)?.label}</p>
            {picked.assignee && <p className="label-caps">Assignee: {picked.assignee}</p>}
            {picked.dueDate && (
              <p className="label-caps">
                Due: {new Date(picked.dueDate).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            )}
          </div>
          <button
            onClick={() => setPicked(null)}
            className="absolute top-3 right-3 text-[10px] text-zinc-400 hover:text-black"
          >×</button>
        </div>
      )}
    </div>
  );
}
