import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, Building2, Search, MoreHorizontal, Eye, Ban, 
  CheckCircle, XCircle, Mail, Shield, TrendingUp
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  roles: string[];
  status: string;
  apiCalls: number;
  spend: number;
}

// Mock users for demo
const mockUsers: User[] = [
  { id: "1", email: "developer@techstartup.com", display_name: "John Developer", created_at: "2025-01-10", roles: ["user"], status: "active", apiCalls: 45230, spend: 127.50 },
  { id: "2", email: "cto@cloudscale.io", display_name: "Sarah CTO", created_at: "2025-01-08", roles: ["user", "publisher"], status: "active", apiCalls: 128400, spend: 456.80 },
  { id: "3", email: "admin@enterprise.com", display_name: "Mike Admin", created_at: "2025-01-05", roles: ["user", "admin"], status: "active", apiCalls: 12500, spend: 89.20 },
  { id: "4", email: "newuser@gmail.com", display_name: null, created_at: "2025-01-17", roles: ["user"], status: "active", apiCalls: 150, spend: 0 },
  { id: "5", email: "suspended@example.com", display_name: "Suspended User", created_at: "2024-12-20", roles: ["user"], status: "suspended", apiCalls: 0, spend: 0 },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === "all" || user.roles.includes(roleFilter);
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: u.status === "suspended" ? "active" : "suspended" } : u
    ));
    toast.success("User status updated");
  };

  const handleAddRole = (userId: string, role: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, roles: [...new Set([...u.roles, role])] } : u
    ));
    toast.success(`${role} role added`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive"; className: string }> = {
      active: { variant: "default", className: "bg-green-500/10 text-green-500 border-green-500/20" },
      suspended: { variant: "destructive", className: "" },
      pending: { variant: "secondary", className: "" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  const getRoleBadges = (roles: string[]) => {
    return roles.map(role => (
      <Badge 
        key={role} 
        variant="outline" 
        className={role === "admin" ? "border-red-500/30 text-red-500" : role === "publisher" ? "border-accent/30 text-accent" : ""}
      >
        {role}
      </Badge>
    ));
  };

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Users & Organizations</h1>
            <p className="text-muted-foreground">Manage users, roles, and permissions</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              <Users className="w-3 h-3 mr-1" />
              {users.length} total
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Users", value: users.length, icon: Users },
            { label: "Publishers", value: users.filter(u => u.roles.includes("publisher")).length, icon: Building2 },
            { label: "Admins", value: users.filter(u => u.roles.includes("admin")).length, icon: Shield },
            { label: "Active Today", value: Math.floor(users.length * 0.7), icon: TrendingUp },
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
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="publisher">Publisher</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">API Calls</TableHead>
                <TableHead className="text-right">Spend</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.display_name || "—"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">{getRoleBadges(user.roles)}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-right font-mono">{user.apiCalls.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">${user.spend.toFixed(2)}</TableCell>
                  <TableCell className="text-muted-foreground">{user.created_at}</TableCell>
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
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {!user.roles.includes("publisher") && (
                          <DropdownMenuItem onClick={() => handleAddRole(user.id, "publisher")}>
                            <Building2 className="w-4 h-4 mr-2" />
                            Make Publisher
                          </DropdownMenuItem>
                        )}
                        {!user.roles.includes("admin") && (
                          <DropdownMenuItem onClick={() => handleAddRole(user.id, "admin")}>
                            <Shield className="w-4 h-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleSuspendUser(user.id)}
                          className={user.status === "suspended" ? "text-green-500" : "text-destructive"}
                        >
                          {user.status === "suspended" ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Reactivate
                            </>
                          ) : (
                            <>
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend
                            </>
                          )}
                        </DropdownMenuItem>
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