import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, Search, MoreHorizontal, Eye, CheckCircle, XCircle,
  DollarSign, TrendingUp, AlertTriangle, Star, Ban
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface Publisher {
  id: string;
  name: string;
  email: string;
  apis: number;
  status: string;
  revenue: number;
  riskScore: number;
  commission: number;
  joinedAt: string;
}

const mockPublishers: Publisher[] = [
  { id: "1", name: "TechAPI Solutions", email: "api@techapi.io", apis: 5, status: "active", revenue: 12450, riskScore: 2, commission: 15, joinedAt: "2024-10-15" },
  { id: "2", name: "CloudData Inc", email: "team@clouddata.com", apis: 3, status: "active", revenue: 8720, riskScore: 5, commission: 15, joinedAt: "2024-11-20" },
  { id: "3", name: "AI Models Pro", email: "support@aimodels.pro", apis: 8, status: "active", revenue: 34200, riskScore: 1, commission: 12, joinedAt: "2024-09-01" },
  { id: "4", name: "Payment Gateway Ltd", email: "dev@paygate.io", apis: 2, status: "pending", revenue: 0, riskScore: 0, commission: 15, joinedAt: "2025-01-16" },
  { id: "5", name: "Spam APIs Inc", email: "admin@spamapi.com", apis: 1, status: "suspended", revenue: 450, riskScore: 9, commission: 15, joinedAt: "2024-12-01" },
];

export default function AdminPublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>(mockPublishers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [commissionValue, setCommissionValue] = useState([15]);

  const filteredPublishers = publishers.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (id: string) => {
    setPublishers(prev => prev.map(p => p.id === id ? { ...p, status: "active" } : p));
    toast.success("Publisher approved");
  };

  const handleSuspend = (id: string) => {
    setPublishers(prev => prev.map(p => p.id === id ? { ...p, status: "suspended" } : p));
    toast.success("Publisher suspended");
  };

  const handleUpdateCommission = () => {
    if (selectedPublisher) {
      setPublishers(prev => prev.map(p => 
        p.id === selectedPublisher.id ? { ...p, commission: commissionValue[0] } : p
      ));
      toast.success(`Commission updated to ${commissionValue[0]}%`);
      setSelectedPublisher(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { className: string }> = {
      active: { className: "bg-green-500/10 text-green-500 border-green-500/20" },
      pending: { className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
      suspended: { className: "bg-red-500/10 text-red-500 border-red-500/20" },
    };
    return <Badge variant="outline" className={config[status]?.className}>{status}</Badge>;
  };

  const getRiskBadge = (score: number) => {
    if (score <= 3) return <Badge variant="outline" className="bg-green-500/10 text-green-500">Low ({score})</Badge>;
    if (score <= 6) return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Medium ({score})</Badge>;
    return <Badge variant="outline" className="bg-red-500/10 text-red-500">High ({score})</Badge>;
  };

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Publishers</h1>
            <p className="text-muted-foreground">Manage API publishers and their commissions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Publishers", value: publishers.length, icon: Building2 },
            { label: "Active", value: publishers.filter(p => p.status === "active").length, icon: CheckCircle },
            { label: "Pending Review", value: publishers.filter(p => p.status === "pending").length, icon: AlertTriangle },
            { label: "Total Revenue", value: `$${(publishers.reduce((s, p) => s + p.revenue, 0) / 1000).toFixed(1)}K`, icon: DollarSign },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
              <stat.icon className="w-5 h-5 text-accent mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search publishers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 max-w-md"
          />
        </div>

        {/* Publishers Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Publisher</TableHead>
                <TableHead>APIs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPublishers.map((publisher) => (
                <TableRow key={publisher.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{publisher.name}</p>
                      <p className="text-sm text-muted-foreground">{publisher.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{publisher.apis}</TableCell>
                  <TableCell>{getStatusBadge(publisher.status)}</TableCell>
                  <TableCell>{getRiskBadge(publisher.riskScore)}</TableCell>
                  <TableCell className="text-right font-mono">${publisher.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{publisher.commission}%</TableCell>
                  <TableCell className="text-muted-foreground">{publisher.joinedAt}</TableCell>
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
                          <Star className="w-4 h-4 mr-2" />
                          View APIs
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedPublisher(publisher);
                          setCommissionValue([publisher.commission]);
                        }}>
                          <DollarSign className="w-4 h-4 mr-2" />
                          Adjust Commission
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {publisher.status === "pending" && (
                          <DropdownMenuItem onClick={() => handleApprove(publisher.id)} className="text-green-500">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {publisher.status !== "suspended" ? (
                          <DropdownMenuItem onClick={() => handleSuspend(publisher.id)} className="text-destructive">
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleApprove(publisher.id)} className="text-green-500">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Reactivate
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

      {/* Commission Dialog */}
      <Dialog open={!!selectedPublisher} onOpenChange={() => setSelectedPublisher(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Commission</DialogTitle>
            <DialogDescription>
              Set the commission rate for {selectedPublisher?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Label>Commission Rate: {commissionValue[0]}%</Label>
            <Slider
              value={commissionValue}
              onValueChange={setCommissionValue}
              min={5}
              max={30}
              step={1}
              className="mt-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>5%</span>
              <span>30%</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPublisher(null)}>Cancel</Button>
            <Button onClick={handleUpdateCommission}>Update Commission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}