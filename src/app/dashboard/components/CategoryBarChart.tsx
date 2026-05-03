"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export function CategoryBarChart({ data }: { data: any[] }) {
  if (data.length === 0) {
    return null;
  }

  const formatCurrency = (val: number) => `₹${(val / 1000).toFixed(0)}k`;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 h-[400px] shadow-sm">
      <h3 className="text-lg font-semibold text-white mb-4">Top Categories by Spend</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.slice(0, 7)} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                borderColor: "#374151",
                borderRadius: "12px",
                color: "#f3f4f6"
              }}
              cursor={{ fill: '#374151', opacity: 0.2 }}
              formatter={(value: any) => [
                new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value),
                "Spend"
              ]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.slice(0, 7).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
