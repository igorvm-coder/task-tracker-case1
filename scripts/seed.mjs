import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "data");
const dbPath = path.join(dataDir, "app.db");

const fixtures = JSON.parse(
  fs.readFileSync(path.join(root, "lib", "fixtures.json"), "utf8"),
);

const timezone = process.env.APP_TIMEZONE || "Europe/Moscow";

function todayISO() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(iso, days) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE,
  name          TEXT    NOT NULL,
  password_hash TEXT    NOT NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT    NOT NULL,
  assignee_id INTEGER NOT NULL REFERENCES users(id),
  deadline    TEXT    NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'Новая',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status   ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
`;

fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(SCHEMA);

db.exec("DELETE FROM tasks; DELETE FROM users;");
db.exec("DELETE FROM sqlite_sequence WHERE name IN ('tasks','users');");

const insertUser = db.prepare(
  "INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)",
);
const userIds = new Map();
const seed = db.transaction(() => {
  for (const user of fixtures.users) {
    const info = insertUser.run(
      user.email,
      user.name,
      bcrypt.hashSync(user.password, 10),
    );
    userIds.set(user.email, Number(info.lastInsertRowid));
  }

  const insertTask = db.prepare(
    `INSERT INTO tasks (title, description, assignee_id, deadline, status)
     VALUES (?, ?, ?, ?, ?)`,
  );
  const today = todayISO();
  for (const task of fixtures.tasks) {
    const assigneeId = userIds.get(task.assignee);
    if (!assigneeId) continue;
    insertTask.run(
      task.title,
      task.description,
      assigneeId,
      addDays(today, task.deadlineOffsetDays ?? 0),
      task.status ?? "Новая",
    );
  }
});

seed();

const { count: users } = db
  .prepare("SELECT COUNT(*) AS count FROM users")
  .get();
const { count: tasks } = db
  .prepare("SELECT COUNT(*) AS count FROM tasks")
  .get();

console.log(`База данных подготовлена: ${dbPath}`);
console.log(`Пользователей: ${users}, задач: ${tasks}`);
console.log("Учётные записи: " + fixtures.users.map((u) => u.email).join(", "));
console.log(`Пароль для всех: ${fixtures.users[0].password}`);

db.close();
