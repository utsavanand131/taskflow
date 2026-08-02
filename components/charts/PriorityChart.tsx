"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PriorityChartProps {
  data: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    URGENT: number;
  };
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm shadow-xl">
      <p className="font-medium text-white">{payload[0].name}</p>

      <p className="mt-1 text-zinc-300">{payload[0].value} tasks</p>
    </div>
  );
}

export default function PriorityChart({ data }: PriorityChartProps) {
  const chartData = [
    {
      name: "Low",
      value: data.LOW,
    },
    {
      name: "Medium",
      value: data.MEDIUM,
    },
    {
      name: "High",
      value: data.HIGH,
    },
    {
      name: "Urgent",
      value: data.URGENT,
    },
  ];

  const colors = ["#22c55e", "#eab308", "#f97316", "#ef4444"];

  return (
    <div className="rounded-xl border p-5">
      <h2 className="mb-4 text-lg font-semibold">Task Priority</h2>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index]} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
