import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const generateMockData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      requests: Math.floor(Math.random() * 50000) + 10000,
      tokens: Math.floor(Math.random() * 500000) + 100000,
      cost: Math.floor(Math.random() * 100) + 20,
    });
  }
  return data;
};

const data = generateMockData();

type MetricType = "requests" | "tokens" | "cost";

const metricConfig: Record<MetricType, { label: string; color: string; format: (v: number) => string }> = {
  requests: {
    label: "Requests",
    color: "hsl(var(--accent))",
    format: (v) => v.toLocaleString(),
  },
  tokens: {
    label: "Tokens",
    color: "hsl(262 83% 60%)",
    format: (v) => (v / 1000).toFixed(0) + "K",
  },
  cost: {
    label: "Cost",
    color: "hsl(142 76% 36%)",
    format: (v) => "$" + v.toFixed(2),
  },
};

export function UsageChart() {
  const [activeMetric, setActiveMetric] = useState<MetricType>("requests");
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d");

  const config = metricConfig[activeMetric];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-semibold">Usage Over Time</h3>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            {(Object.keys(metricConfig) as MetricType[]).map((metric) => (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  activeMetric === metric
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {metricConfig[metric].label}
              </button>
            ))}
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded transition-all",
                  dateRange === range
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[280px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={config.format}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [config.format(value), config.label]}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={config.color}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMetric)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
