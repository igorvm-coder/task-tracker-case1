import Link from "next/link";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Filters from "@/components/Filters";
import StatsPanel from "@/components/StatsPanel";
import TaskTable from "@/components/TaskTable";
import { getSession } from "@/lib/session";
import {
  computeAssigneeStats,
  computeStats,
  listTasks,
  listUsers,
} from "@/lib/tasks";
import { isStatus, OVERDUE_FILTER } from "@/lib/types";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; assignee?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const overdueFilter = params.status === OVERDUE_FILTER;
  const status =
    params.status && !overdueFilter && isStatus(params.status)
      ? params.status
      : undefined;
  const assignee = Number(params.assignee);
  const assigneeId =
    params.assignee && Number.isInteger(assignee) && assignee > 0
      ? assignee
      : undefined;

  const allTasks = listTasks();
  const tasks =
    status || overdueFilter || assigneeId
      ? listTasks({ status, assigneeId, overdue: overdueFilter })
      : allTasks;
  const users = listUsers();

  const stats = computeStats(allTasks);
  const assigneeStats = computeAssigneeStats(allTasks);

  return (
    <>
      <AppHeader user={session} />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <StatsPanel stats={stats} assigneeStats={assigneeStats} />

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Задачи команды
            </h2>
            <Link
              href="/tasks/new"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Создать задачу
            </Link>
          </div>

          <Filters users={users} />
          <TaskTable tasks={tasks} />
        </section>
      </main>
    </>
  );
}
