"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface ProjectProgressChartProps {
  data: {
    name: string;
    completionRate: number;
  }[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm shadow-xl">
      <p className="font-medium text-white">{payload[0].payload.name}</p>

      <p className="mt-1 text-zinc-300">{payload[0].value}% completed</p>
    </div>
  );
}

export default function ProjectProgressChart({
  data,
}: ProjectProgressChartProps) {
  return (
    <div className="rounded-xl border p-5">
      <h2 className="mb-4 text-lg font-semibold">Project Progress</h2>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              left: 20,
              right: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 12 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey="completionRate" radius={[0, 8, 8, 0]}>
              {data.map((item) => (
                <Cell key={item.name} fill="#6366f1" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
