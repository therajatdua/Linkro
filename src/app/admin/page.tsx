import { redirect } from "next/navigation";

import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminUser } from "@/lib/auth-server";
import { getAdminMetrics } from "@/lib/data";

export default async function AdminPage() {
  try {
    await requireAdminUser();
  } catch {
    redirect("/sign-in");
  }

  const metrics = await getAdminMetrics();

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <h1 className="text-2xl font-semibold">Admin Command Center</h1>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Total Users" value={metrics.totalUsers} />
        <MetricCard label="Active 24h" value={metrics.users24h} />
        <MetricCard label="Active 7d" value={metrics.users7d} />
        <MetricCard label="Active Pro" value={metrics.activeProMemberships} />
        <MetricCard label="MRR" value={`$${metrics.mrr.toFixed(2)}`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <AnalyticsChart
          title="Template Popularity Heatmap"
          data={metrics.templateUsage.map((item) => ({ template: item.templateId, users: item.count }))}
          xKey="template"
          yKey="users"
        />
        <Card>
          <CardHeader>
            <CardTitle>Stripe Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[280px] space-y-2 overflow-auto">
              {metrics.transactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                  <div>
                    <p className="font-medium">{txn.id}</p>
                    <p className="text-muted-foreground">{new Date(txn.created).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {txn.currency.toUpperCase()} {txn.amount.toFixed(2)}
                    </p>
                    <p className="text-muted-foreground">{txn.status}</p>
                  </div>
                </div>
              ))}
              {!metrics.transactions.length && <p className="text-sm text-muted-foreground">No transaction records found.</p>}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">UID</th>
                    <th className="py-2 pr-3 font-medium">Email</th>
                    <th className="py-2 pr-3 font-medium">Join Date</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.users.map((user) => (
                    <tr key={user.uid} className="border-b">
                      <td className="py-2 pr-3">{user.uid}</td>
                      <td className="py-2 pr-3">{user.email}</td>
                      <td className="py-2 pr-3">{new Date(user.joinDate).toLocaleDateString()}</td>
                      <td className="py-2 pr-3">{user.status === "banned" ? "Banned" : "Active"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">{value}</CardContent>
    </Card>
  );
}
