import { motion } from "framer-motion";
import { 
  CreditCard, Download, Receipt, AlertCircle,
  DollarSign, TrendingUp, Calendar, Wallet
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const billingHistory = [
  { id: "INV-2024-001", date: "Jan 1, 2024", amount: "$247.80", status: "paid" },
  { id: "INV-2023-012", date: "Dec 1, 2023", amount: "$198.50", status: "paid" },
  { id: "INV-2023-011", date: "Nov 1, 2023", amount: "$156.20", status: "paid" },
  { id: "INV-2023-010", date: "Oct 1, 2023", amount: "$189.40", status: "paid" },
];

const costBreakdown = [
  { api: "GPT-4 Turbo", usage: "2.4M tokens", rate: "$0.02/1k", cost: "$48.20" },
  { api: "Claude 3 Opus", usage: "1.8M tokens", rate: "$0.02/1k", cost: "$36.50" },
  { api: "DALL-E 3", usage: "456 images", rate: "$0.04/img", cost: "$18.27" },
  { api: "Stripe Payments", usage: "234 calls", rate: "$0.05/call", cost: "$12.30" },
  { api: "Twilio SMS", usage: "1,234 msgs", rate: "$0.0075/msg", cost: "$9.26" },
];

export default function BillingPage() {
  const currentSpend = 127.50;
  const monthlyLimit = 500;
  const percentUsed = (currentSpend / monthlyLimit) * 100;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Billing & Costs</h1>
          <p className="text-muted-foreground">
            Monitor spending, manage budgets, and view invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Wallet className="w-4 h-4 mr-2" />
            Payment Methods
          </Button>
        </div>
      </motion.div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <MetricCard
          title="Current Spend"
          value="$127.50"
          change={{ value: "MTD", trend: "neutral" }}
          icon={DollarSign}
          description="January 2024"
          delay={0}
        />
        <MetricCard
          title="Forecasted"
          value="$247.80"
          change={{ value: "est.", trend: "neutral" }}
          icon={TrendingUp}
          description="end of month"
          delay={0.05}
        />
        <MetricCard
          title="Budget Remaining"
          value="$372.50"
          change={{ value: "74%", trend: "up" }}
          icon={Wallet}
          description="of $500 limit"
          delay={0.1}
        />
        <MetricCard
          title="Last Invoice"
          value="$198.50"
          change={{ value: "Paid", trend: "neutral" }}
          icon={Receipt}
          description="Dec 2023"
          delay={0.15}
        />
      </div>

      {/* Budget Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-5 mb-6 sm:mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Monthly Budget</h3>
          <Button variant="outline" size="sm">
            Set Limit
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current: ${currentSpend.toFixed(2)}</span>
            <span className="text-muted-foreground">Limit: ${monthlyLimit.toFixed(2)}</span>
          </div>
          <Progress value={percentUsed} className="h-3" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="w-3.5 h-3.5" />
            Alert set at 80% (${(monthlyLimit * 0.8).toFixed(2)})
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Cost Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-xl"
        >
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold">Cost Breakdown (MTD)</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costBreakdown.map((item) => (
                <TableRow key={item.api}>
                  <TableCell className="font-medium">{item.api}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{item.usage}</TableCell>
                  <TableCell className="text-right font-mono">{item.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        {/* Invoice History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl"
        >
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">Invoice History</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium font-mono text-sm">{invoice.id}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                  <TableCell className="text-right font-mono">{invoice.amount}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-0">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
