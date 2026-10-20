"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveTaskAction, type TaskFormState } from "@/app/actions/tasks";
import { STATUSES, type TaskWithAssignee, type User } from "@/lib/types";

const initialState: TaskFormState = {};

export default function TaskForm({
  users,
  task,
}: {
  users: User[];
  task?: TaskWithAssignee;
}) {
  const [state, formAction, pending] = useActionState(
    saveTaskAction,
    initialState,
  );

  const isEdit = Boolean(task);

  return (
    <form action={formAction} className="space-y-4">
      {task && <input type="hidden" name="id" value={task.id} />}

      <div>
        <label htmlFor="title">Название</label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={task?.title ?? ""}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={task?.description ?? ""}
          required
        />
      </div>

      <div>
        <label htmlFor="assignee_id">Исполнитель</label>
        <select
          id="assignee_id"
          name="assignee_id"
          defaultValue={task?.assignee_id ? String(task.assignee_id) : ""}
          required
        >
          <option value="" disabled>
            Выберите исполнителя
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="deadline">Дедлайн</label>
        <input
          id="deadline"
          name="deadline"
          type="date"
          defaultValue={task?.deadline ?? ""}
          required
        />
      </div>

      {isEdit && (
        <div>
          <label htmlFor="status">Статус</label>
          <select
            id="status"
            name="status"
            defaultValue={task?.status ?? STATUSES[0]}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      )}

      {state.error && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Сохранение…" : isEdit ? "Сохранить" : "Создать задачу"}
        </button>
        <Link
          href="/tasks"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
