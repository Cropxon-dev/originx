import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Search, Filter, Download, RefreshCw,
  CheckCircle, XCircle, AlertTriangle, Clock
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const logs = [
  { id: 1, timestamp: "2024-01-18 14:32:45", api: "GPT-4 Turbo", endpoint: "/v1/ai/llm/chat", status: 200, latency: 124, cost: 0.0024, tokens: 1247 },
  { id: 2, timestamp: "2024-01-18 14:32:42", api: "Claude 3 Opus", endpoint: "/v1/ai/llm/chat", status: 200, latency: 156, cost: 0.0031, tokens: 892 },
  { id: 3, timestamp: "2024-01-18 14:32:38", api: "Stripe Payments", endpoint: "/v1/payments/create", status: 200, latency: 89, cost: 0.05, tokens: null },
  { id: 4, timestamp: "2024-01-18 14:32:35", api: "GPT-4 Turbo", endpoint: "/v1/ai/llm/chat", status: 429, latency: 12, cost: 0, tokens: 0 },
  { id: 5, timestamp: "2024-01-18 14:32:30", api: "Twilio SMS", endpoint: "/v1/comm/sms/send", status: 200, latency: 234, cost: 0.0075, tokens: null },
  { id: 6, timestamp: "2024-01-18 14:32:25", api: "DALL-E 3", endpoint: "/v1/ai/image/generate", status: 200, latency: 3240, cost: 0.04, tokens: null },
  { id: 7, timestamp: "2024-01-18 14:32:20", api: "GPT-4 Turbo", endpoint: "/v1/ai/llm/chat", status: 500, latency: 45, cost: 0, tokens: 0 },
  { id: 8, timestamp: "2024-01-18 14:32:15", api: "Whisper", endpoint: "/v1/ai/audio/transcribe", status: 200, latency: 1890, cost: 0.006, tokens: null },
];

const getStatusIcon = (status: number) => {
  if (status >= 200 && status < 300) return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status >= 400 && status < 500) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  return <XCircle className="w-4 h-4 text-red-500" />;
};

const getStatusColor = (status: number) => {
  if (status >= 200 && status < 300) return "bg-green-500/10 text-green-500";
  if (status >= 400 && status < 500) return "bg-yellow-500/10 text-yellow-500";
  return "bg-red-500/10 text-red-500";
};

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Logs & Monitoring</h1>
          <p className="text-muted-foreground">
            View request logs, debug issues, and monitor API performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="2xx">2xx Success</SelectItem>
            <SelectItem value="4xx">4xx Client Error</SelectItem>
            <SelectItem value="5xx">5xx Server Error</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="1h">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15m">Last 15 min</SelectItem>
            <SelectItem value="1h">Last 1 hour</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Timestamp</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">API</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Endpoint</th>
                <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Latency</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {log.timestamp.split(' ')[1]}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-sm">{log.api}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {log.endpoint}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline" className={cn("text-xs", getStatusColor(log.status))}>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-sm">{log.latency}ms</span>
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <span className="font-mono text-sm">${log.cost.toFixed(4)}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
