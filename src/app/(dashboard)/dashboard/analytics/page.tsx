import { ArrowUpRight, BarChart3, Eye, Flame, Globe, MousePointerClick, TrendingUp, Users } from "lucide-react";

import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { getSessionUser } from "@/lib/auth-server";
import { getCreatorAnalytics, getLinksByUserId } from "@/lib/data";

const statConfig = [
  { key: "uniqueVisitors" as const, label: "Unique Visitors", icon: Users, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { key: "totalViews" as const, label: "Total Views", icon: Eye, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { key: "totalClicks" as const, label: "Total Clicks", icon: MousePointerClick, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20" },
  { key: "ctr" as const, label: "Click-Through Rate", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", suffix: "%" },
];

export default async function AnalyticsPage() {
  const user = await getSessionUser();
  const uid = user?.uid ?? "demo-user-id";

  const [analytics, links] = await Promise.all([
    getCreatorAnalytics(uid),
    getLinksByUserId(uid),
  ]);

  const hasData = analytics.totalViews > 0 || analytics.totalClicks > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Real-time data from your public profile visits and link clicks.
        </p>
      </div>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map(({ key, label, icon: Icon, color, bg, border, suffix }) => {
          const raw = analytics[key];
          const value = suffix ? `${raw}${suffix}` : String(raw);
          return (
            <div
              key={key}
              className={`rounded-2xl border ${border} bg-zinc-900/40 p-5 transition-colors hover:border-zinc-700`}
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                {hasData && (
                  <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                    <ArrowUpRight className="h-3 w-3" />
                    Live
                  </div>
                )}
              </div>
              <p className="mt-4 text-3xl font-bold">{value}</p>
              <p className="mt-1 text-sm text-zinc-400">{label}</p>
            </div>
          );
        })}
      </section>

      {/* 24h Link Heatmap */}
      {analytics.heatmap24h && analytics.heatmap24h.length > 0 && (
        <section className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-zinc-800/60 px-5 py-4">
            <Flame className="h-4 w-4 text-orange-400" />
            <h2 className="font-semibold text-sm">24h Link Heatmap</h2>
            <span className="ml-auto rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400">
              Live · Last 24h
            </span>
          </div>
          <div className="divide-y divide-zinc-800/40">
            {analytics.heatmap24h
              .sort((a, b) => b.clicks - a.clicks)
              .map((item, idx) => {
                const max = analytics.heatmap24h[0]?.clicks || 1;
                const pct = Math.max(4, Math.round((item.clicks / max) * 100));
                return (
                  <div key={item.linkId} className="flex items-center gap-4 px-5 py-3">
                    <span className="w-5 text-right text-xs font-bold text-zinc-600">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        {item.isHot && (
                          <span className="flex items-center gap-0.5 rounded-full bg-orange-500/15 px-2 py-0.5 text-[11px] font-semibold text-orange-400">
                            <Flame className="h-3 w-3" /> Hot
                          </span>
                        )}
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-zinc-800">
                        <div
                          className={`h-1.5 rounded-full transition-all ${item.isHot ? "bg-orange-400" : "bg-violet-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${item.isHot ? "text-orange-400" : "text-zinc-300"}`}>
                      {item.clicks}
                    </span>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Charts */}
      {hasData ? (
        <section className="grid gap-6 lg:grid-cols-2">
          {analytics.linkClicks.some((l) => l.clicks > 0) && (
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
              <AnalyticsChart
                title="Link Clicks"
                data={analytics.linkClicks
                  .filter((item) => item.clicks > 0)
                  .map((item) => ({ link: item.title, clicks: item.clicks }))}
                xKey="link"
                yKey="clicks"
                color="#8b5cf6"
              />
            </div>
          )}

          {analytics.referrers.length > 0 && (
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
              <AnalyticsChart
                title="Traffic Sources"
                data={analytics.referrers.map((item) => ({ source: item.source, visits: item.value }))}
                xKey="source"
                yKey="visits"
                color="#06b6d4"
              />
            </div>
          )}

          {analytics.countryBreakdown && analytics.countryBreakdown.length > 0 && (
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-400" />
                <p className="text-sm font-semibold">Top Countries</p>
              </div>
              <div className="space-y-2">
                {analytics.countryBreakdown.slice(0, 8).map((item) => {
                  const max = analytics.countryBreakdown[0]?.value || 1;
                  const pct = Math.max(6, Math.round((item.value / max) * 100));
                  return (
                    <div key={item.country} className="flex items-center gap-3">
                      <span className="w-24 truncate text-xs text-zinc-400">{item.country}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-zinc-800">
                        <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-xs font-semibold text-zinc-300">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-12 text-center">
          <BarChart3 className="mx-auto mb-3 h-10 w-10 text-zinc-700" />
          <p className="text-sm font-medium text-zinc-300">No data yet</p>
          <p className="mt-1 text-xs text-zinc-500">
            Share your profile link — visits and clicks will appear here in real time.
          </p>
        </div>
      )}

      {/* All links table */}
      {links.length > 0 && (
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden">
          <div className="border-b border-zinc-800/60 px-5 py-4">
            <h2 className="font-semibold text-sm">Link Performance</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800/60">
                <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500">Link</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500">URL</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => {
                const clickData = analytics.linkClicks.find((l) => l.linkId === link.id);
                return (
                  <tr key={link.id} className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-800/20">
                    <td className="px-5 py-3 font-medium">{link.title}</td>
                    <td className="px-5 py-3 max-w-[200px] truncate text-zinc-400">{link.url}</td>
                    <td className="px-5 py-3 text-right font-semibold text-violet-400">
                      {clickData?.clicks ?? 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
