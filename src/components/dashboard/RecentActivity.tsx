import { motion } from "framer-motion";
import {
  Zap,
  Key,
  AlertTriangle,
  CreditCard,
  Shield,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "api_call",
    icon: Zap,
    title: "GPT-4 Turbo API call",
    description: "1,247 tokens processed",
    time: "2 min ago",
    status: "success",
  },
  {
    id: 2,
    type: "key_created",
    icon: Key,
    title: "New API key created",
    description: "Test environment • ox_test_...",
    time: "15 min ago",
    status: "info",
  },
  {
    id: 3,
    type: "limit_warning",
    icon: AlertTriangle,
    title: "Usage limit warning",
    description: "80% of monthly limit reached",
    time: "1 hour ago",
    status: "warning",
  },
  {
    id: 4,
    type: "payment",
    icon: CreditCard,
    title: "Payment processed",
    description: "$127.50 charged to •••• 4242",
    time: "3 hours ago",
    status: "success",
  },
  {
    id: 5,
    type: "api_call",
    icon: Shield,
    title: "Stripe Payments API call",
    description: "Transaction completed",
    time: "5 hours ago",
    status: "success",
  },
];

const statusStyles = {
  success: "bg-green-500/10 text-green-500",
  warning: "bg-yellow-500/10 text-yellow-500",
  error: "bg-red-500/10 text-red-500",
  info: "bg-accent/10 text-accent",
};

export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-xl"
    >
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold">Recent Activity</h3>
      </div>

      <div className="divide-y divide-border">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors"
          >
            <div className={cn("p-2 rounded-lg", statusStyles[activity.status as keyof typeof statusStyles])}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
          </motion.div>
        ))}
      </div>

      <div className="p-3 border-t border-border">
        <button className="w-full text-sm text-muted-foreground hover:text-foreground text-center py-2 transition-colors">
          View all activity →
        </button>
      </div>
    </motion.div>
  );
}
