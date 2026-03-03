"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function AnalyticsChart({
  data,
  title,
  xKey,
  yKey,
  color = "#8b5cf6",
}: {
  data: Record<string, string | number>[];
  title: string;
  xKey: string;
  yKey: string;
  color?: string;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 12,
                color: "#f4f4f5",
              }}
              cursor={{ fill: "rgba(139,92,246,0.08)" }}
            />
            <Bar dataKey={yKey} fill={color} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
