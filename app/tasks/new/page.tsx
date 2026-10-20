import Link from "next/link";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import TaskForm from "@/components/TaskForm";
import { getSession } from "@/lib/session";
import { listUsers } from "@/lib/tasks";

export default async function NewTaskPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const users = listUsers();

  return (
    <>
      <AppHeader user={session} />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="mb-1 text-xl font-bold text-slate-900">
            Новая задача
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            Заполните обязательные поля. Статус новой задачи — «Новая».
          </p>

          {users.length === 0 ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Нет доступных исполнителей. Создайте пользователя, прежде чем
              назначать задачи.
            </div>
          ) : (
            <TaskForm users={users} />
          )}

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
