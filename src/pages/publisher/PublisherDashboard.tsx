import { useState } from "react";
import { motion } from "framer-motion";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Layers, Plus, DollarSign, Key, BarChart3,
  Wallet, Star, Settings, ChevronLeft, Zap, TrendingUp, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

const publisherNavItems = [
  { title: "Overview", icon: LayoutDashboard, href: "/publisher" },
  { title: "My APIs", icon: Layers, href: "/publisher/apis" },
  { title: "Create New API", icon: Plus, href: "/publisher/create" },
  { title: "Pricing & Plans", icon: DollarSign, href: "/publisher/pricing" },
  { title: "Test & Live Keys", icon: Key, href: "/publisher/keys" },
  { title: "Usage & Revenue", icon: BarChart3, href: "/publisher/revenue" },
  { title: "Payouts", icon: Wallet, href: "/publisher/payouts" },
  { title: "Reviews & Issues", icon: Star, href: "/publisher/reviews" },
  { title: "Settings", icon: Settings, href: "/publisher/settings" },
];

function PublisherSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-glow-secondary flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">O</span>
          </div>
          <span className="font-semibold">OriginX Publisher</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="w-full justify-start">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {publisherNavItems.map((item) => {
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
        <ThemeToggle />
      </div>
    </aside>
  );
}

function PublisherOverview() {
  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Publisher Dashboard</h1>
        <p className="text-muted-foreground">Manage your APIs, track revenue, and grow your business.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active APIs", value: "3", icon: Layers, change: "+1" },
          { label: "Total Requests", value: "124K", icon: Zap, change: "+15%" },
          { label: "Monthly Revenue", value: "$2,847", icon: TrendingUp, change: "+22%" },
          { label: "Pending Payout", value: "$847", icon: Wallet, change: "" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-accent" />
              {stat.change && (
                <span className="text-xs text-green-500">{stat.change}</span>
              )}
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start h-auto py-4">
            <Plus className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-medium">Create New API</p>
              <p className="text-xs text-muted-foreground">Publish a new API</p>
            </div>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-4">
            <BarChart3 className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-medium">View Analytics</p>
              <p className="text-xs text-muted-foreground">Check performance</p>
            </div>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-4">
            <Wallet className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-medium">Request Payout</p>
              <p className="text-xs text-muted-foreground">Withdraw earnings</p>
            </div>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">This section is coming soon.</p>
      </motion.div>
    </div>
  );
}

export default function PublisherDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <PublisherSidebar />
      <main className="ml-64">
        <Routes>
          <Route path="/" element={<PublisherOverview />} />
          <Route path="/apis" element={<PlaceholderPage title="My APIs" />} />
          <Route path="/create" element={<PlaceholderPage title="Create New API" />} />
          <Route path="/pricing" element={<PlaceholderPage title="Pricing & Plans" />} />
          <Route path="/keys" element={<PlaceholderPage title="Test & Live Keys" />} />
          <Route path="/revenue" element={<PlaceholderPage title="Usage & Revenue" />} />
          <Route path="/payouts" element={<PlaceholderPage title="Payouts" />} />
          <Route path="/reviews" element={<PlaceholderPage title="Reviews & Issues" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Routes>
      </main>
    </div>
  );
}
