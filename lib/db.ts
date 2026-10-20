import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import fixtures from "./fixtures.json";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "app.db");

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

declare global {
  // eslint-disable-next-line no-var
  var __trackerDb: Database.Database | undefined;
}

function createDb(): Database.Database {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  seedUsersIfEmpty(db);
  return db;
}

/** Создаёт тестовых пользователей, если таблица users пуста. */
function seedUsersIfEmpty(db: Database.Database): void {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM users").get() as {
    count: number;
  };
  if (count > 0) return;

  const insert = db.prepare(
    "INSERT INTO users (email, name, password_hash) VALUES (@email, @name, @hash)",
  );
  const insertMany = db.transaction(() => {
    for (const user of fixtures.users) {
      insert.run({
        email: user.email,
        name: user.name,
        hash: bcrypt.hashSync(user.password, 10),
      });
    }
  });
  insertMany();
}

export function getDb(): Database.Database {
  if (!global.__trackerDb) {
    global.__trackerDb = createDb();
  }
  return global.__trackerDb;
}
