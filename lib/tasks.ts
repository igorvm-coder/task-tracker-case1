import { getDb } from "./db";
import { isOverdue, todayISO } from "./date";
import {
  STATUS,
  isStatus,
  type AssigneeStat,
  type Stats,
  type Status,
  type Task,
  type TaskWithAssignee,
  type User,
  type UserWithHash,
} from "./types";

export interface TaskFilters {
  status?: string;
  assigneeId?: number;
  overdue?: boolean;
}

export function listUsers(): User[] {
  return getDb()
    .prepare("SELECT id, email, name, created_at FROM users ORDER BY name")
    .all() as User[];
}

export function countUsers(): number {
  const { count } = getDb()
    .prepare("SELECT COUNT(*) AS count FROM users")
    .get() as { count: number };
  return count;
}

export function getUserByEmail(email: string): UserWithHash | null {
  const row = getDb()
    .prepare("SELECT * FROM users WHERE lower(email) = lower(?)")
    .get(email) as UserWithHash | undefined;
  return row ?? null;
}

const TASK_SELECT = `
  SELECT t.*, u.name AS assignee_name, u.email AS assignee_email
  FROM tasks t
  JOIN users u ON u.id = t.assignee_id
`;

export function listTasks(filters: TaskFilters = {}): TaskWithAssignee[] {
  const where: string[] = [];
  const params: Array<string | number> = [];

  if (filters.status && isStatus(filters.status)) {
    where.push("t.status = ?");
    params.push(filters.status);
  }
  if (filters.overdue) {
    where.push("t.deadline < ? AND t.status != ?");
    params.push(todayISO(), STATUS.DONE);
  }
  if (filters.assigneeId && Number.isInteger(filters.assigneeId)) {
    where.push("t.assignee_id = ?");
    params.push(filters.assigneeId);
  }

  const sql =
    TASK_SELECT +
    (where.length ? ` WHERE ${where.join(" AND ")}` : "") +
    " ORDER BY t.created_at DESC, t.id DESC";

  return getDb()
    .prepare(sql)
    .all(...params) as TaskWithAssignee[];
}

export function getTask(id: number): TaskWithAssignee | null {
  const row = getDb()
    .prepare(`${TASK_SELECT} WHERE t.id = ?`)
    .get(id) as TaskWithAssignee | undefined;
  return row ?? null;
}

export interface TaskInput {
  title: string;
  description: string;
  assigneeId: number;
  deadline: string;
  status?: Status;
}

export function createTask(input: TaskInput): Task {
  const info = getDb()
    .prepare(
      `INSERT INTO tasks (title, description, assignee_id, deadline, status)
       VALUES (@title, @description, @assigneeId, @deadline, @status)`,
    )
    .run({
      title: input.title,
      description: input.description,
      assigneeId: input.assigneeId,
      deadline: input.deadline,
      status: input.status ?? STATUS.NEW,
    });
  return getTask(Number(info.lastInsertRowid))!;
}

export function updateTask(id: number, input: TaskInput): void {
  getDb()
    .prepare(
      `UPDATE tasks
       SET title = @title,
           description = @description,
           assignee_id = @assigneeId,
           deadline = @deadline,
           status = @status
       WHERE id = @id`,
    )
    .run({
      id,
      title: input.title,
      description: input.description,
      assigneeId: input.assigneeId,
      deadline: input.deadline,
      status: input.status ?? STATUS.NEW,
    });
}

export function updateTaskStatus(id: number, status: Status): void {
  getDb().prepare("UPDATE tasks SET status = ? WHERE id = ?").run(status, id);
}

export function deleteTask(id: number): void {
  getDb().prepare("DELETE FROM tasks WHERE id = ?").run(id);
}

export function computeStats(tasks: TaskWithAssignee[]): Stats {
  const today = todayISO();
  return {
    total: tasks.length,
    new: tasks.filter((t) => t.status === STATUS.NEW).length,
    inProgress: tasks.filter((t) => t.status === STATUS.IN_PROGRESS).length,
    done: tasks.filter((t) => t.status === STATUS.DONE).length,
    overdue: tasks.filter((t) => isOverdue(t.deadline, t.status, today)).length,
  };
}

export function computeAssigneeStats(tasks: TaskWithAssignee[]): AssigneeStat[] {
  const users = listUsers();
  return users.map((user) => {
    const own = tasks.filter((t) => t.assignee_id === user.id);
    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      total: own.length,
      done: own.filter((t) => t.status === STATUS.DONE).length,
    };
  });
}
