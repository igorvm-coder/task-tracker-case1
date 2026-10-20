"use client";

import { STATUSES, type Status } from "@/lib/types";
import { setStatusAction } from "@/app/actions/tasks";

export default function StatusSelect({
  taskId,
  status,
}: {
  taskId: number;
  status: Status;
}) {
  return (
    <form action={setStatusAction}>
      <input type="hidden" name="taskId" value={taskId} />
      <select
        name="status"
        defaultValue={status}
        aria-label="Изменить статус"
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="w-36"
      >
        {STATUSES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </form>
  );
}
