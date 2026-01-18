import { motion } from "framer-motion";
import { 
  BarChart3, Download, Calendar,
  Zap, Coins, AlertTriangle, Clock
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { UsageChart } from "@/components/dashboard/UsageChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const apiUsageData = [
  { name: "GPT-4 Turbo", category: "AI & ML", requests: "145,234", tokens: "2.4M", cost: "$48.20", change: "+12%" },
  { name: "Claude 3 Opus", category: "AI & ML", requests: "89,432", tokens: "1.8M", cost: "$36.50", change: "+8%" },
  { name: "Stripe Payments", category: "Payments", requests: "23,456", tokens: "—", cost: "$12.30", change: "-3%" },
  { name: "Twilio SMS", category: "Communication", requests: "12,345", tokens: "—", cost: "$9.26", change: "+5%" },
  { name: "DALL-E 3", category: "AI & ML", requests: "4,567", tokens: "—", cost: "$18.27", change: "+24%" },
];

export default function UsageAnalyticsPage() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Usage & Analytics</h1>
          <p className="text-muted-foreground">
            Track your API usage, token consumption, and performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <MetricCard
          title="Total Requests"
          value="847,234"
          change={{ value: "+15.2%", trend: "up" }}
          icon={Zap}
          description="this month"
          delay={0}
        />
        <MetricCard
          title="Total Tokens"
          value="12.4M"
          change={{ value: "+8.7%", trend: "up" }}
          icon={Coins}
          description="this month"
          delay={0.05}
        />
        <MetricCard
          title="Error Rate"
          value="0.12%"
          change={{ value: "-0.05%", trend: "down" }}
          icon={AlertTriangle}
          description="last 24h"
          delay={0.1}
        />
        <MetricCard
          title="Avg Latency"
          value="124ms"
          change={{ value: "-12ms", trend: "down" }}
          icon={Clock}
          description="p50"
          delay={0.15}
        />
      </div>

      {/* Usage Chart */}
      <div className="mb-6 sm:mb-8">
        <UsageChart />
      </div>

      {/* Usage by API */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl"
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent" />
            <h3 className="font-semibold">Usage by API</h3>
          </div>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Requests</TableHead>
                <TableHead className="text-right">Tokens</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiUsageData.map((api) => (
                <TableRow key={api.name}>
                  <TableCell className="font-medium">{api.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {api.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">{api.requests}</TableCell>
                  <TableCell className="text-right font-mono">{api.tokens}</TableCell>
                  <TableCell className="text-right font-mono">{api.cost}</TableCell>
                  <TableCell className="text-right">
                    <span className={api.change.startsWith("+") ? "text-green-500" : "text-red-500"}>
                      {api.change}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
