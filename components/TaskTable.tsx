import Link from "next/link";
import DeleteTaskButton from "@/components/DeleteTaskButton";
import StatusSelect from "@/components/StatusSelect";
import { isOverdue, todayISO } from "@/lib/date";
import type { TaskWithAssignee } from "@/lib/types";

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}.${month}.${year}`;
}

export default function TaskTable({ tasks }: { tasks: TaskWithAssignee[] }) {
  const today = todayISO();

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
        Задач не найдено. Измените фильтры или создайте новую задачу.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[820px] text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Название</th>
            <th className="px-4 py-3 font-medium">Исполнитель</th>
            <th className="px-4 py-3 font-medium">Дедлайн</th>
            <th className="px-4 py-3 font-medium">Статус</th>
            <th className="px-4 py-3 font-medium">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const overdue = isOverdue(task.deadline, task.status, today);
            return (
              <tr
                key={task.id}
                className={overdue ? "bg-red-50" : "hover:bg-slate-50"}
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/tasks/${task.id}/edit`}
                    className="font-medium text-blue-700 hover:underline"
                  >
                    {task.title}
                  </Link>
                  {overdue && (
                    <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-700">
                      просрочена
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {task.assignee_name}
                </td>
                <td
                  className={`px-4 py-3 ${
                    overdue ? "font-semibold text-red-700" : "text-slate-700"
                  }`}
                >
                  {formatDate(task.deadline)}
                </td>
                <td className="px-4 py-3">
                  <StatusSelect taskId={task.id} status={task.status} />
                </td>
                <td className="px-4 py-3">
                  <DeleteTaskButton taskId={task.id} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
