export const STATUS = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  DONE: "Выполнена",
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

export const STATUSES: Status[] = [STATUS.NEW, STATUS.IN_PROGRESS, STATUS.DONE];

export function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUSES as string[]).includes(value);
}

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface UserWithHash extends User {
  password_hash: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assignee_id: number;
  deadline: string;
  status: Status;
  created_at: string;
}

export interface TaskWithAssignee extends Task {
  assignee_name: string;
  assignee_email: string;
}

export interface Stats {
  total: number;
  new: number;
  inProgress: number;
  done: number;
  overdue: number;
}

export const OVERDUE_FILTER = "overdue";

export interface AssigneeStat {
  userId: number;
  name: string;
  email: string;
  total: number;
  done: number;
}
