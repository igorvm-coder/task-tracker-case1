import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Трекер задач",
  description: "MVP: трекер задач с автоматической отчётностью",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
