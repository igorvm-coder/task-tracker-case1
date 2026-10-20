"use client";

import { deleteTaskAction } from "@/app/actions/tasks";

export default function DeleteTaskButton({ taskId }: { taskId: number }) {
  return (
    <form
      action={deleteTaskAction}
      onSubmit={(event) => {
        if (!window.confirm("Вы уверены, что хотите удалить задачу?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="taskId" value={taskId} />
      <button
        type="submit"
        className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50"
      >
        Удалить
      </button>
    </form>
  );
}
