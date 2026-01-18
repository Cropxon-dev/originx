import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, CreditCard, Clock, CheckCircle2, 
  ArrowUpRight, AlertCircle, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Mock data
const payoutHistory = [
  { id: 1, date: "2025-01-15", amount: 847.50, status: "completed", method: "Stripe" },
  { id: 2, date: "2025-01-01", amount: 623.00, status: "completed", method: "Stripe" },
  { id: 3, date: "2024-12-15", amount: 512.25, status: "completed", method: "Stripe" },
  { id: 4, date: "2024-12-01", amount: 389.00, status: "completed", method: "Stripe" },
];

const stats = [
  { label: "Available Balance", value: "$847.50", icon: Wallet, color: "text-green-500" },
  { label: "Pending", value: "$156.25", icon: Clock, color: "text-yellow-500" },
  { label: "Paid Out (Total)", value: "$2,371.75", icon: CheckCircle2, color: "text-accent" },
  { label: "Next Payout", value: "Feb 1", icon: ArrowUpRight, color: "text-muted-foreground" },
];

export default function PublisherPayoutsPage() {
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("847.50");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRequestPayout = async () => {
    setIsProcessing(true);
    // Simulate payout request
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsPayoutModalOpen(false);
    toast.success("Payout requested! You'll receive funds within 2-3 business days.");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      completed: "default",
      pending: "secondary",
      processing: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Payouts</h1>
            <p className="text-muted-foreground">Manage your earnings and withdrawals</p>
          </div>
          <Dialog open={isPayoutModalOpen} onOpenChange={setIsPayoutModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Wallet className="w-4 h-4 mr-2" />
                Request Payout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Payout</DialogTitle>
                <DialogDescription>
                  Withdraw your available balance to your connected Stripe account.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Available Balance</span>
                    <span className="text-lg font-bold text-green-500">$847.50</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Minimum payout</span>
                    <span>$50.00</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="amount">Payout Amount</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="amount"
                      type="number"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Processing Time</p>
                    <p className="text-muted-foreground">
                      Payouts are processed within 2-3 business days.
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPayoutModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRequestPayout} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Request Payout"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Payout Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-medium">Payout Method</h3>
                <p className="text-sm text-muted-foreground">Stripe Connect</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-green-500 border-green-500/30">
                Connected
              </Badge>
              <Button variant="ghost" size="sm">
                Manage
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Payout History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h2 className="font-semibold">Payout History</h2>
            <p className="text-sm text-muted-foreground">Your past withdrawals</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutHistory.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{payout.date}</TableCell>
                  <TableCell className="font-medium">${payout.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {payout.method}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(payout.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </motion.div>
    </div>
  );
}