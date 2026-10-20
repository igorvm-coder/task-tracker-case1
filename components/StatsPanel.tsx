import type { AssigneeStat, Stats } from "@/lib/types";

function Card({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "slate" | "amber" | "blue" | "green" | "red";
}) {
  const tones = {
    slate: "text-slate-900",
    amber: "text-amber-600",
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
  } as const;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${tones[tone]}`}>{value}</p>
    </div>
  );
}

export default function StatsPanel({
  stats,
  assigneeStats,
}: {
  stats: Stats;
  assigneeStats: AssigneeStat[];
}) {
  return (
    <section className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card label="Всего задач" value={stats.total} tone="slate" />
        <Card label="Новые" value={stats.new} tone="amber" />
        <Card label="В работе" value={stats.inProgress} tone="blue" />
        <Card label="Выполнено" value={stats.done} tone="green" />
        <Card label="из них — Просрочено" value={stats.overdue} tone="red" />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Разбивка по исполнителям
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Исполнитель</th>
              <th className="px-4 py-2 font-medium">Всего задач</th>
              <th className="px-4 py-2 font-medium">Выполнено</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assigneeStats.map((row) => (
              <tr key={row.userId}>
                <td className="px-4 py-2 text-slate-800">{row.name}</td>
                <td className="px-4 py-2 text-slate-700">{row.total}</td>
                <td className="px-4 py-2 text-slate-700">{row.done}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
