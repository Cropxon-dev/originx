import { motion } from "framer-motion";
import { Bell, Plus, AlertTriangle, CheckCircle, XCircle, Trash2, Edit } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const alerts = [
  {
    id: 1,
    name: "Monthly Spend Limit",
    type: "budget",
    condition: "Spend > $400",
    status: "active",
    triggered: false,
    threshold: 80,
    current: 65,
  },
  {
    id: 2,
    name: "Daily Request Limit",
    type: "usage",
    condition: "Requests > 100K/day",
    status: "active",
    triggered: true,
    threshold: 100,
    current: 105,
  },
  {
    id: 3,
    name: "Error Rate Alert",
    type: "performance",
    condition: "Error Rate > 1%",
    status: "active",
    triggered: false,
    threshold: 1,
    current: 0.12,
  },
  {
    id: 4,
    name: "Latency Warning",
    type: "performance",
    condition: "P95 Latency > 500ms",
    status: "paused",
    triggered: false,
    threshold: 500,
    current: 124,
  },
];

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Alerts & Limits</h1>
          <p className="text-muted-foreground">
            Configure usage limits and receive alerts when thresholds are reached.
          </p>
        </div>
        <Button variant="hero">
          <Plus className="w-4 h-4 mr-2" />
          Create Alert
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Alerts", value: "3", icon: Bell, color: "text-accent" },
          { label: "Triggered", value: "1", icon: AlertTriangle, color: "text-yellow-500" },
          { label: "Resolved", value: "12", icon: CheckCircle, color: "text-green-500" },
          { label: "Muted", value: "1", icon: XCircle, color: "text-muted-foreground" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alerts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  alert.triggered 
                    ? "bg-yellow-500/10" 
                    : alert.status === "paused" 
                    ? "bg-muted" 
                    : "bg-accent/10"
                }`}>
                  {alert.triggered ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Bell className={`w-5 h-5 ${alert.status === "paused" ? "text-muted-foreground" : "text-accent"}`} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{alert.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {alert.type}
                    </Badge>
                    {alert.triggered && (
                      <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs">
                        Triggered
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.condition}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-32">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Current</span>
                    <span className={alert.current > alert.threshold ? "text-yellow-500" : ""}>
                      {alert.type === "budget" ? `${alert.current}%` : alert.current}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((alert.current / alert.threshold) * 100, 100)} 
                    className="h-2"
                  />
                </div>

                <Switch checked={alert.status === "active"} />

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </DashboardLayout>
  );
}
