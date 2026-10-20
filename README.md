# Task Tracker

Трекер задач с отчётностью. Приложение для постановки, назначения и отслеживания задач с авторизацией и разграничением доступа.

## Стек технологий

- [Next.js 15](https://nextjs.org/) — фреймворк для React
- [TypeScript](https://www.typescriptlang.org/) — типизация
- [Tailwind CSS 4](https://tailwindcss.com/) — стилизация
- [SQLite](https://www.sqlite.org/) — база данных (better-sqlite3)

## Как запустить локально

1. Установить зависимости:
```bash
npm install
```

2. Заполнить базу демо-данными:
```bash
npm run seed
```

3. Запустить приложение в режиме разработки:
```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

## Тестовые аккаунты для входа

| Email | Пароль |
| :--- | :--- |
| admin@test.ru | password123 |
| ivanov@test.ru | password123 |
| petrova@test.ru | password123 |
| sidorov@test.ru | password123 |

## Скриншоты

![Скриншот главной страницы](./screenshots/home.png)

![Скриншот страницы задачи](./screenshots/task.png)

![Скриншот панели управления](./screenshots/dashboard.png)

## Деплой на Railway

Проект настроен для деплоя на [Railway](https://railway.app/). База данных SQLite создаётся автоматически в директории `data/` при старте приложения. Команда `npm run seed` добавлена в `start` скрипт для автоматического заполнения демо-данными при деплое.
