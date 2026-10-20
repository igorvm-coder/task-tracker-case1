import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { countUsers } from "@/lib/tasks";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/tasks");

  const usersExist = countUsers() > 0;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Трекер задач</h1>
        <p className="mt-1 mb-6 text-sm text-slate-500">
          Войдите, чтобы перейти к списку задач и отчётам.
        </p>

        {!usersExist && (
          <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            База пуста. Выполните <code>npm run seed</code>, чтобы создать
            тестовых пользователей.
          </p>
        )}

        <LoginForm />

        <div className="mt-6 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Тестовые учётные записи</p>
          <p className="mt-1">admin@test.ru · ivanov@test.ru · petrova@test.ru · sidorov@test.ru</p>
          <p>Пароль для всех: <code>password123</code></p>
        </div>
      </div>
    </main>
  );
}
