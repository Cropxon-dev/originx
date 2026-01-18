import { motion } from "framer-motion";
import { Layers, Plus, ExternalLink, BarChart3, Trash2, Pause, Play } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
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

const subscribedApis = [
  { id: 1, name: "GPT-4 Turbo", category: "AI & ML", module: "LLMs", usage: "145,234", cost: "$48.20", status: "active" },
  { id: 2, name: "Claude 3 Opus", category: "AI & ML", module: "LLMs", usage: "89,432", cost: "$36.50", status: "active" },
  { id: 3, name: "Stripe Payments", category: "Payments", module: "Payments", usage: "23,456", cost: "$12.30", status: "active" },
  { id: 4, name: "Twilio SMS", category: "Communication", module: "Messaging", usage: "12,345", cost: "$9.26", status: "active" },
  { id: 5, name: "DALL-E 3", category: "AI & ML", module: "Generative AI", usage: "4,567", cost: "$18.27", status: "paused" },
  { id: 6, name: "Whisper", category: "AI & ML", module: "Audio AI", usage: "8,901", cost: "$5.34", status: "active" },
];

export default function MyApisPage() {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">My APIs</h1>
          <p className="text-muted-foreground">
            Manage your subscribed APIs and monitor their usage.
          </p>
        </div>
        <Button variant="hero" onClick={() => window.location.href = "/dashboard/marketplace"}>
          <Plus className="w-4 h-4 mr-2" />
          Browse Marketplace
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Subscribed APIs", value: "12" },
          { label: "Active", value: "11" },
          { label: "Total Usage (30d)", value: "284K" },
          { label: "Total Cost (30d)", value: "$129.87" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* APIs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>API Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Module</TableHead>
              <TableHead className="text-right">Usage (30d)</TableHead>
              <TableHead className="text-right">Cost (30d)</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribedApis.map((api, index) => (
              <motion.tr
                key={api.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="group"
              >
                <TableCell className="font-medium">{api.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {api.category}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {api.module}
                </TableCell>
                <TableCell className="text-right font-mono">{api.usage}</TableCell>
                <TableCell className="text-right font-mono">{api.cost}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={api.status === "active" 
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }
                  >
                    {api.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {api.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </DashboardLayout>
  );
}
