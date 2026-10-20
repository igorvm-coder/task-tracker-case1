import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import type { SessionPayload } from "@/lib/auth";

export default function AppHeader({ user }: { user: SessionPayload }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/tasks" className="text-lg font-bold text-slate-900">
          Трекер задач
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-right text-sm leading-tight">
            <p className="font-medium text-slate-800">{user.name}</p>
            <p className="text-slate-500">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Выйти
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
