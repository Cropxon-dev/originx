import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Store, Building2, Route as RouteIcon,
  CreditCard, BarChart3, FileText, Shield, Settings, ChevronLeft,
  Zap, TrendingUp, DollarSign, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUserRoles } from "@/hooks/useRealtimeUsage";
import { supabase } from "@/integrations/supabase/client";

// Import admin pages
import AdminUsersPage from "./AdminUsersPage";
import AdminPublishersPage from "./AdminPublishersPage";
import AdminApisPage from "./AdminApisPage";
import AdminRoutingPage from "./AdminRoutingPage";

const adminNavItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { title: "Users & Orgs", icon: Users, href: "/admin/users" },
  { title: "APIs & Marketplace", icon: Store, href: "/admin/apis" },
  { title: "Publishers", icon: Building2, href: "/admin/publishers" },
  { title: "Routing Engine", icon: RouteIcon, href: "/admin/routing" },
  { title: "Billing & Revenue", icon: CreditCard, href: "/admin/billing" },
  { title: "Usage & Abuse", icon: BarChart3, href: "/admin/usage" },
  { title: "Logs", icon: FileText, href: "/admin/logs" },
  { title: "Compliance", icon: Shield, href: "/admin/compliance" },
  { title: "System Settings", icon: Settings, href: "/admin/settings" },
];

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-background flex flex-col">
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold leading-tight">OriginX Admin</span>
            <span className="text-[10px] text-muted-foreground leading-tight">BY CROPXON</span>
          </div>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="w-full justify-start">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">
          <a href="https://www.cropxon.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            Cropxon Innovations Pvt. Ltd
          </a>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}

function AdminOverview() {
  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Admin</Badge>
        </div>
        <p className="text-muted-foreground">Platform governance and system health monitoring.</p>
      </motion.div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
      >
        {[
          { label: "Total API Calls", value: "12.4M", change: "+18%", icon: Zap },
          { label: "Revenue (MTD)", value: "$847K", change: "+22%", icon: TrendingUp },
          { label: "Margin", value: "10.2%", change: "+0.3%", icon: DollarSign },
          { label: "Active Publishers", value: "247", change: "+12", icon: Building2 },
          { label: "Error Rate", value: "0.02%", change: "-0.01%", icon: AlertTriangle, good: true },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.03 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-4 h-4 text-accent" />
              <span className={cn(
                "text-xs",
                stat.good || stat.change.startsWith("-") && stat.label.includes("Error") ? "text-green-500" : 
                stat.change.startsWith("+") ? "text-green-500" : "text-red-500"
              )}>
                {stat.change}
              </span>
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h2 className="font-semibold mb-4">System Health</h2>
          <div className="space-y-4">
            {[
              { name: "API Gateway", status: "operational", uptime: 99.99 },
              { name: "Database Cluster", status: "operational", uptime: 99.98 },
              { name: "Routing Engine", status: "operational", uptime: 99.97 },
              { name: "Billing System", status: "operational", uptime: 100 },
            ].map((system) => (
              <div key={system.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">{system.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{system.uptime}% uptime</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h2 className="font-semibold mb-4">Pending Actions</h2>
          <div className="space-y-3">
            {[
              { action: "Publisher applications", count: 5, href: "/admin/publishers" },
              { action: "API reviews", count: 12, href: "/admin/apis" },
              { action: "Abuse reports", count: 2, href: "/admin/usage" },
              { action: "Payout requests", count: 8, href: "/admin/billing" },
            ].map((item) => (
              <Link 
                key={item.action} 
                to={item.href}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-sm">{item.action}</span>
                <Badge variant="secondary">{item.count}</Badge>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">This admin section is coming soon.</p>
      </motion.div>
    </div>
  );
}

function AccessDenied() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access the admin panel. 
          Contact an administrator if you believe this is an error.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          Return to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useUserRoles();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/auth');
      } else {
        setIsAuthenticated(true);
      }
    });
  }, [navigate]);

  if (isAuthenticated === null || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  // Check admin role
  if (!isAdmin()) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/users" element={<AdminUsersPage />} />
          <Route path="/apis" element={<AdminApisPage />} />
          <Route path="/publishers" element={<AdminPublishersPage />} />
          <Route path="/routing" element={<AdminRoutingPage />} />
          <Route path="/billing" element={<PlaceholderPage title="Billing & Revenue" />} />
          <Route path="/usage" element={<PlaceholderPage title="Usage & Abuse" />} />
          <Route path="/logs" element={<PlaceholderPage title="Logs" />} />
          <Route path="/compliance" element={<PlaceholderPage title="Compliance" />} />
          <Route path="/settings" element={<PlaceholderPage title="System Settings" />} />
        </Routes>
      </main>
    </div>
  );
}
