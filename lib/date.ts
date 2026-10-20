import { STATUS, type Status } from "./types";

const APP_TIMEZONE = process.env.APP_TIMEZONE || "Europe/Moscow";

/**
 * Текущая календарная дата приложения в формате YYYY-MM-DD.
 * Расчёт просрочки ведётся по календарной дате в часовом поясе приложения.
 */
export function todayISO(timeZone: string = APP_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Задача просрочена, если её дедлайн раньше текущей календарной даты
 * и статус не «Выполнена». Дедлайн «сегодня» просрочкой не считается.
 */
export function isOverdue(
  deadline: string,
  status: Status,
  today: string = todayISO(),
): boolean {
  if (status === STATUS.DONE) return false;
  return deadline < today;
}
