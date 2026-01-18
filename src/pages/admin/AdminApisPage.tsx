import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Store, Search, MoreHorizontal, Eye, CheckCircle, XCircle,
  Pause, Play, AlertTriangle, ExternalLink, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Api {
  id: string;
  name: string;
  publisher: string;
  category: string;
  status: string;
  version: string;
  requests: number;
  revenue: number;
  slaCompliance: number;
  createdAt: string;
}

const mockApis: Api[] = [
  { id: "1", name: "GPT-4 Turbo", publisher: "AI Models Pro", category: "AI & ML", status: "active", version: "1.2.0", requests: 2450000, revenue: 24500, slaCompliance: 99.9, createdAt: "2024-09-15" },
  { id: "2", name: "Stripe Payments", publisher: "Payment Gateway Ltd", category: "Payments", status: "pending", version: "1.0.0", requests: 0, revenue: 0, slaCompliance: 0, createdAt: "2025-01-16" },
  { id: "3", name: "SendGrid Email", publisher: "CloudData Inc", category: "Communication", status: "active", version: "2.1.0", requests: 890000, revenue: 8900, slaCompliance: 99.8, createdAt: "2024-11-01" },
  { id: "4", name: "Image Recognition", publisher: "TechAPI Solutions", category: "AI & ML", status: "active", version: "1.5.2", requests: 456000, revenue: 4560, slaCompliance: 99.5, createdAt: "2024-10-20" },
  { id: "5", name: "Deprecated API", publisher: "Spam APIs Inc", category: "Other", status: "deprecated", version: "0.9.0", requests: 1200, revenue: 12, slaCompliance: 85.0, createdAt: "2024-08-01" },
];

const categories = ["All", "AI & ML", "Payments", "Communication", "Data", "DevOps", "Other"];

export default function AdminApisPage() {
  const [apis, setApis] = useState<Api[]>(mockApis);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredApis = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.publisher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || api.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || api.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setApis(prev => prev.map(a => a.id === id ? { ...a, status: "active" } : a));
    toast.success("API approved and published");
  };

  const handleReject = (id: string) => {
    setApis(prev => prev.filter(a => a.id !== id));
    toast.success("API rejected");
  };

  const handleToggleStatus = (id: string) => {
    setApis(prev => prev.map(a => 
      a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a
    ));
    toast.success("API status updated");
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { className: string }> = {
      active: { className: "bg-green-500/10 text-green-500 border-green-500/20" },
      pending: { className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
      paused: { className: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
      deprecated: { className: "bg-red-500/10 text-red-500 border-red-500/20" },
    };
    return <Badge variant="outline" className={config[status]?.className}>{status}</Badge>;
  };

  const getSlaColor = (sla: number) => {
    if (sla >= 99.5) return "text-green-500";
    if (sla >= 99) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">APIs & Marketplace</h1>
            <p className="text-muted-foreground">Review, approve, and manage marketplace APIs</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total APIs", value: apis.length, icon: Store },
            { label: "Pending Review", value: apis.filter(a => a.status === "pending").length, icon: AlertTriangle },
            { label: "Active", value: apis.filter(a => a.status === "active").length, icon: CheckCircle },
            { label: "Total Revenue", value: `$${(apis.reduce((s, a) => s + a.revenue, 0) / 1000).toFixed(1)}K`, icon: TrendingUp },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
              <stat.icon className="w-5 h-5 text-accent mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="deprecated">Deprecated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* APIs Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API</TableHead>
                <TableHead>Publisher</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Requests</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">SLA</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApis.map((api) => (
                <TableRow key={api.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{api.name}</p>
                      <p className="text-xs text-muted-foreground">v{api.version}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{api.publisher}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{api.category}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(api.status)}</TableCell>
                  <TableCell className="text-right font-mono">
                    {api.requests > 1000000 
                      ? `${(api.requests / 1000000).toFixed(1)}M`
                      : `${(api.requests / 1000).toFixed(0)}K`
                    }
                  </TableCell>
                  <TableCell className="text-right font-mono">${api.revenue.toLocaleString()}</TableCell>
                  <TableCell className={`text-right font-mono ${getSlaColor(api.slaCompliance)}`}>
                    {api.slaCompliance > 0 ? `${api.slaCompliance}%` : "—"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Docs
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {api.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(api.id)} className="text-green-500">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(api.id)} className="text-destructive">
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {api.status === "active" && (
                          <DropdownMenuItem onClick={() => handleToggleStatus(api.id)}>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause API
                          </DropdownMenuItem>
                        )}
                        {api.status === "paused" && (
                          <DropdownMenuItem onClick={() => handleToggleStatus(api.id)} className="text-green-500">
                            <Play className="w-4 h-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}