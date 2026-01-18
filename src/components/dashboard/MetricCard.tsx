import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon: LucideIcon;
  description?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-card border border-border rounded-xl p-5 hover:border-accent/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-accent/10">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        {change && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              change.trend === "up" && "bg-green-500/10 text-green-500",
              change.trend === "down" && "bg-red-500/10 text-red-500",
              change.trend === "neutral" && "bg-muted text-muted-foreground"
            )}
          >
            {change.trend === "up" && <TrendingUp className="w-3 h-3" />}
            {change.trend === "down" && <TrendingDown className="w-3 h-3" />}
            <span>{change.value}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
        <p className="text-2xl sm:text-3xl font-bold font-mono tracking-tight">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
