import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../types";
import { Badge } from "./ui/badge";
import { Calendar, User } from "lucide-react";

interface Props { task: Task; onClick: () => void; }

const priorityVariant: Record<string, "high" | "medium" | "low"> = {
  high: "high", medium: "medium", low: "low",
};

function fmtDate(d: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

function isOverdue(d: string) {
  if (!d) return false;
  return new Date(d) < new Date();
}

export default function StickyCard({ task, onClick }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.25 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    touchAction: "none",
  };

  const tags = task.tags ? task.tags.split(",").filter(Boolean) : [];
  const overdue = isOverdue(task.dueDate);

  // Only fire click if we didn't actually drag
  function handleClick(e: React.MouseEvent) {
    // dnd-kit sets pointer capture during drag; if element is being dragged, skip
    if (isDragging) return;
    onClick();
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`sticky-note note-${task.color} mb-3 select-none`}
      onClick={handleClick}
    >
      {/* Title */}
      <p className="font-note-heading text-xl text-zinc-900 mb-2 line-clamp-2">
        {task.title}
      </p>

      {/* Description */}
      {task.description && (
        <p className="font-note-body text-zinc-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.slice(0, 2).map(t => (
            <span key={t} className="text-xs text-zinc-600 px-2 py-1 bg-black/5 rounded-full">
              {t.trim()}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="text-xs text-zinc-500">+{tags.length - 2}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-1 gap-2">
        <Badge variant={priorityVariant[task.priority] ?? "medium"}>
          {task.priority}
        </Badge>
        <div className="flex items-center gap-2">
          {task.assignee && (
            <span className="flex items-center gap-1 text-xs text-zinc-600">
              <User size={12} />
              <span className="truncate max-w-[72px]">{task.assignee}</span>
            </span>
          )}
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-xs ${overdue ? "text-red-600" : "text-zinc-600"}`}>
              <Calendar size={12} />
              {fmtDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
