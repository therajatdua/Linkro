import { ArrowUpRight, BarChart3, Eye, MousePointerClick, Users } from "lucide-react";

import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { EmptyState } from "@/components/shared/empty-state";
import { getSessionUser } from "@/lib/auth-server";
import { getCreatorAnalytics } from "@/lib/data";

const statConfig = [
  { key: "uniqueVisitors" as const, label: "Unique Visitors", icon: Users, color: "text-violet-400", bg: "bg-violet-500/10" },
  { key: "totalViews" as const, label: "Total Views", icon: Eye, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { key: "totalClicks" as const, label: "Total Clicks", icon: MousePointerClick, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10" },
  { key: "ctr" as const, label: "Click-Through Rate", icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-500/10", suffix: "%" },
];

export default async function DashboardPage() {
  const user = await getSessionUser();
  const ownerId = user?.uid ?? "demo-user-id";
  const analytics = await getCreatorAnalytics(ownerId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-zinc-400">Your profile performance at a glance.</p>
      </div>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map(({ key, label, icon: Icon, color, bg, suffix }) => {
          const raw = analytics[key];
          const value = suffix ? `${raw}${suffix}` : String(raw);
          return (
            <div
              key={key}
              className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                  +12%
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold">{value}</p>
              <p className="mt-1 text-sm text-zinc-400">{label}</p>
            </div>
          );
        })}
      </section>

      {/* Charts */}
      {analytics.linkClicks.length ? (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
            <AnalyticsChart
              title="Link Performance"
              data={analytics.linkClicks.map((item) => ({ link: item.title, clicks: item.clicks }))}
              xKey="link"
              yKey="clicks"
            />
          </div>
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
            <AnalyticsChart
              title="Referrer Data"
              data={analytics.referrers.map((item) => ({ source: item.source, count: item.value }))}
              xKey="source"
              yKey="count"
            />
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
          <EmptyState
            title="No analytics yet"
            description="Once your profile starts receiving traffic, views and clicks will appear here."
          />
        </div>
      )}
    </div>
  );
}
