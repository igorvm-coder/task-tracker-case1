"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { createTask, deleteTask, updateTask, updateTaskStatus } from "@/lib/tasks";
import { STATUS, isStatus, type Status } from "@/lib/types";

export interface TaskFormState {
  error?: string;
}

function parseForm(formData: FormData) {
  return {
    id: String(formData.get("id") ?? ""),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    assignee_id: String(formData.get("assignee_id") ?? ""),
    deadline: String(formData.get("deadline") ?? "").trim(),
    status: String(formData.get("status") ?? STATUS.NEW),
  };
}

function validate(values: ReturnType<typeof parseForm>): string | null {
  if (!values.title) return "Укажите название задачи.";
  if (!values.description) return "Укажите описание задачи.";
  const assigneeId = Number(values.assignee_id);
  if (!values.assignee_id || !Number.isInteger(assigneeId) || assigneeId <= 0) {
    return "Выберите исполнителя из списка.";
  }
  if (!values.deadline || !/^\d{4}-\d{2}-\d{2}$/.test(values.deadline)) {
    return "Укажите корректный дедлайн.";
  }
  if (!isStatus(values.status)) return "Недопустимый статус задачи.";
  return null;
}

export async function saveTaskAction(
  _prev: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const values = parseForm(formData);
  const error = validate(values);
  if (error) return { error };

  const assigneeId = Number(values.assignee_id);
  const status = values.status as Status;

  if (values.id) {
    updateTask(Number(values.id), {
      title: values.title,
      description: values.description,
      assigneeId,
      deadline: values.deadline,
      status,
    });
  } else {
    createTask({
      title: values.title,
      description: values.description,
      assigneeId,
      deadline: values.deadline,
      status,
    });
  }

  revalidatePath("/tasks");
  redirect("/tasks");
}

export async function setStatusAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const taskId = Number(formData.get("taskId"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isInteger(taskId) || taskId <= 0 || !isStatus(status)) {
    return;
  }

  updateTaskStatus(taskId, status);
  revalidatePath("/tasks");
}

export async function deleteTaskAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const taskId = Number(formData.get("taskId"));
  if (!Number.isInteger(taskId) || taskId <= 0) {
    return;
  }

  deleteTask(taskId);
  revalidatePath("/tasks");
}
