import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import TaskForm from "@/components/TaskForm";
import { getSession } from "@/lib/session";
import { getTask, listUsers } from "@/lib/tasks";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const taskId = Number(id);
  if (!Number.isInteger(taskId) || taskId <= 0) notFound();

  const task = getTask(taskId);
  if (!task) notFound();

  const users = listUsers();

  return (
    <>
      <AppHeader user={session} />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="mb-1 text-xl font-bold text-slate-900">
            Редактирование задачи
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            Измените данные задачи или её статус.
          </p>

          <TaskForm users={users} task={task} />

          <div className="mt-6">
            <Link
              href="/tasks"
              className="text-sm font-medium text-blue-700 hover:underline"
            >
              ← К списку задач
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
