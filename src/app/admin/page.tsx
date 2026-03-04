import { redirect } from "next/navigation";
import { BarChart3, DollarSign, TrendingDown, TrendingUp, Users, Zap } from "lucide-react";

import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { requireAdminUser } from "@/lib/auth-server";
import { getAdminMetrics } from "@/lib/data";

export default async function AdminPage() {
  try {
    await requireAdminUser();
  } catch {
    redirect("/sign-in");
  }

  const metrics = await getAdminMetrics();

  const planTotal = (metrics.planBreakdown?.free ?? 0) + (metrics.planBreakdown?.pro ?? 0) || 1;
  const proPct = Math.round(((metrics.planBreakdown?.pro ?? 0) / planTotal) * 100);
  const freePct = 100 - proPct;

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Command Center</h1>
        <p className="mt-1 text-sm text-zinc-400">Platform health, revenue signals, and user intelligence.</p>
      </div>

      {/* Quick stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Users",    value: metrics.totalUsers,           sub: "all time"        },
          { label: "Active 24h",     value: metrics.users24h,             sub: "last 24 hours"   },
          { label: "Active 7d",      value: metrics.users7d,              sub: "last 7 days"     },
          { label: "Pro Members",    value: metrics.activeProMemberships, sub: "active subs"     },
          { label: "MRR",            value: `$${metrics.mrr.toFixed(0)}`, sub: "monthly rev"     },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
            <p className="text-xs font-medium text-zinc-500">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-zinc-600">{sub}</p>
          </div>
        ))}
      </section>

      {/* Revenue Intelligence */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
          <DollarSign className="h-4 w-4 text-emerald-400" /> Revenue Intelligence
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* MRR */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-400">Monthly Recurring Revenue</p>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-3 text-4xl font-bold text-emerald-400">${metrics.mrr.toFixed(0)}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {metrics.activeProMemberships} active subs × $9/mo
            </p>
          </div>

          {/* Churn Rate */}
          <div className={`rounded-2xl border p-5 ${
            (metrics.churnRate ?? 0) > 15
              ? "border-red-500/20 bg-red-500/5"
              : "border-zinc-800/60 bg-zinc-900/40"
          }`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-400">Churn Rate</p>
              <TrendingDown className={`h-4 w-4 ${(metrics.churnRate ?? 0) > 15 ? "text-red-400" : "text-zinc-500"}`} />
            </div>
            <p className={`mt-3 text-4xl font-bold ${(metrics.churnRate ?? 0) > 15 ? "text-red-400" : "text-zinc-200"}`}>
              {metrics.churnRate ?? 0}%
            </p>
            <p className="mt-1 text-xs text-zinc-500">users inactive &gt;30 days</p>
          </div>

          {/* Plan breakdown */}
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
            <p className="text-xs font-medium text-zinc-400">Plan Breakdown</p>
            <div className="mt-3 flex items-end gap-3">
              <div>
                <p className="text-2xl font-bold text-violet-400">{metrics.planBreakdown?.pro ?? 0}</p>
                <p className="text-xs text-zinc-500">Pro</p>
              </div>
              <div className="mb-0.5 text-zinc-600">/</div>
              <div>
                <p className="text-2xl font-bold text-zinc-300">{metrics.planBreakdown?.free ?? 0}</p>
                <p className="text-xs text-zinc-500">Free</p>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full bg-violet-500" style={{ width: `${proPct}%` }} />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-zinc-600">
              <span>{proPct}% Pro</span><span>{freePct}% Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Insights */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
          <Zap className="h-4 w-4 text-violet-400" /> Product Insights
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
            {metrics.vibeUsage && metrics.vibeUsage.length > 0 ? (
              <AnalyticsChart
                title="Vibe Preset Popularity"
                data={metrics.vibeUsage.map((v) => ({ vibe: v.vibePreset, users: v.count }))}
                xKey="vibe"
                yKey="users"
                color="#8b5cf6"
              />
            ) : (
              <EmptyChart label="Vibe Preset Popularity" />
            )}
          </div>
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
            {metrics.buttonShapeUsage && metrics.buttonShapeUsage.length > 0 ? (
              <AnalyticsChart
                title="Button Shape Usage"
                data={metrics.buttonShapeUsage.map((b) => ({ shape: b.shape, users: b.count }))}
                xKey="shape"
                yKey="users"
                color="#06b6d4"
              />
            ) : (
              <EmptyChart label="Button Shape Usage" />
            )}
          </div>
        </div>
      </section>

      {/* Transactions */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
          <TrendingUp className="h-4 w-4 text-cyan-400" /> Stripe Transactions
        </h2>
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden">
          <div className="max-h-64 space-y-0 overflow-auto divide-y divide-zinc-800/40">
            {metrics.transactions.length > 0 ? (
              metrics.transactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-zinc-800/20">
                  <div>
                    <p className="font-mono text-xs text-zinc-400">{txn.id}</p>
                    <p className="text-xs text-zinc-600">{new Date(txn.created).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{txn.currency.toUpperCase()} {txn.amount.toFixed(2)}</p>
                    <span className={`text-xs font-medium ${txn.status === "succeeded" ? "text-emerald-400" : "text-zinc-500"}`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-sm text-zinc-500">No transactions yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* User Management */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
          <Users className="h-4 w-4 text-fuchsia-400" /> User Management
        </h2>
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-zinc-800/60">
                  <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500">User</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500">UID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500">Plan</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500">Joined</th>
                </tr>
              </thead>
              <tbody>
                {metrics.users.map((user) => (
                  <tr key={user.uid} className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-800/20">
                    <td className="px-5 py-3">
                      <p className="font-medium">{(user as { username?: string }).username ?? "—"}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-zinc-600">
                      {user.uid.slice(0, 8)}…
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        (user as { plan?: string }).plan === "pro"
                          ? "bg-violet-500/15 text-violet-300"
                          : "bg-zinc-700/40 text-zinc-400"
                      }`}>
                        {(user as { plan?: string }).plan ?? "free"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.status === "banned"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-emerald-500/15 text-emerald-400"
                      }`}>
                        {user.status === "banned" ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-500">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-2">
      <BarChart3 className="h-8 w-8 text-zinc-700" />
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="text-xs text-zinc-600">No data yet</p>
    </div>
  );
}

