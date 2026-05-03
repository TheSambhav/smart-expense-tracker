"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export function CategoryPieChart({ data }: { data: any[] }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Add a tiny delay to ensure the container layout is stable
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <div className="h-[400px] w-full bg-gray-900/50 rounded-xl animate-pulse" />;

  if (data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-[400px] flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 h-[400px] shadow-sm overflow-hidden">
      <h3 className="text-lg font-semibold text-white mb-4">Top Categories by Spend</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "#9ca3af"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                borderColor: "#374151",
                borderRadius: "12px",
                color: "#f3f4f6"
              }}
              formatter={(value: any) => [
                new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value),
                "Spend"
              ]}/>
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
