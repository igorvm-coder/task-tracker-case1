"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { OVERDUE_FILTER, STATUSES, type User } from "@/lib/types";

export default function Filters({ users }: { users: User[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "";
  const currentAssignee = searchParams.get("assignee") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const hasFilters = Boolean(currentStatus || currentAssignee);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-48">
        <label htmlFor="filter-status">Статус</label>
        <select
          id="filter-status"
          value={currentStatus}
          onChange={(event) => update("status", event.target.value)}
        >
          <option value="">Все статусы</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
          <option value={OVERDUE_FILTER}>Просроченные</option>
        </select>
      </div>

      <div className="w-56">
        <label htmlFor="filter-assignee">Исполнитель</label>
        <select
          id="filter-assignee"
          value={currentAssignee}
          onChange={(event) => update("assignee", event.target.value)}
        >
          <option value="">Все исполнители</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => router.replace(pathname)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}
