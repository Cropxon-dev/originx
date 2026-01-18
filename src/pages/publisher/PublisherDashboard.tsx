import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Layers, Plus, DollarSign, Key, BarChart3,
  Wallet, Star, Settings, ChevronLeft, Zap, TrendingUp, Users, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { OriginXLogo } from "@/components/OriginXLogo";
import { useUserRoles } from "@/hooks/useRealtimeUsage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import publisher pages
import CreateApiPage from "./CreateApiPage";
import PublisherApisPage from "./PublisherApisPage";
import PublisherRevenuePage from "./PublisherRevenuePage";
import PublisherPayoutsPage from "./PublisherPayoutsPage";

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
        <Link to="/" className="inline-block mb-4">
          <OriginXLogo size="md" showText showSubtext />
        </Link>
        <p className="text-xs text-muted-foreground mb-3">Publisher Console</p>
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
          <Link to="/publisher/create">
            <Button variant="outline" className="justify-start h-auto py-4 w-full">
              <Plus className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Create New API</p>
                <p className="text-xs text-muted-foreground">Publish a new API</p>
              </div>
            </Button>
          </Link>
          <Link to="/publisher/revenue">
            <Button variant="outline" className="justify-start h-auto py-4 w-full">
              <BarChart3 className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">View Analytics</p>
                <p className="text-xs text-muted-foreground">Check performance</p>
              </div>
            </Button>
          </Link>
          <Link to="/publisher/payouts">
            <Button variant="outline" className="justify-start h-auto py-4 w-full">
              <Wallet className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Request Payout</p>
                <p className="text-xs text-muted-foreground">Withdraw earnings</p>
              </div>
            </Button>
          </Link>
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

function BecomePublisherPrompt() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleBecomePublisher = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Add publisher role
      const { error } = await supabase.from('user_roles').insert({
        user_id: user.id,
        role: 'publisher',
      });

      if (error && !error.message.includes('duplicate')) throw error;
      
      toast.success("You're now a publisher! Start creating APIs.");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to become publisher");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Layers className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Become a Publisher</h1>
        <p className="text-muted-foreground mb-6">
          Publish your APIs on OriginX and reach thousands of developers. 
          Set your pricing, track usage, and earn revenue.
        </p>
        
        <div className="space-y-4 text-left mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
              <Zap className="w-3 h-3 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Instant Distribution</p>
              <p className="text-xs text-muted-foreground">Reach developers worldwide</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
              <TrendingUp className="w-3 h-3 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Transparent Pricing</p>
              <p className="text-xs text-muted-foreground">15% commission, that's it</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
              <Wallet className="w-3 h-3 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Fast Payouts</p>
              <p className="text-xs text-muted-foreground">Via Stripe, twice monthly</p>
            </div>
          </div>
        </div>

        <Button onClick={handleBecomePublisher} disabled={isLoading} className="w-full">
          {isLoading ? "Processing..." : "Become a Publisher"}
        </Button>
        
        <p className="text-xs text-muted-foreground mt-4">
          By joining, you agree to OriginX publisher terms.
        </p>
      </motion.div>
    </div>
  );
}

export default function PublisherDashboard() {
  const { isPublisher, isLoading } = useUserRoles();
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

  // Show become publisher prompt if not a publisher
  if (!isPublisher()) {
    return <BecomePublisherPrompt />;
  }

  return (
    <div className="min-h-screen bg-background">
      <PublisherSidebar />
      <main className="ml-64">
        <Routes>
          <Route path="/" element={<PublisherOverview />} />
          <Route path="/apis" element={<PublisherApisPage />} />
          <Route path="/create" element={<CreateApiPage />} />
          <Route path="/pricing" element={<PlaceholderPage title="Pricing & Plans" />} />
          <Route path="/keys" element={<PlaceholderPage title="Test & Live Keys" />} />
          <Route path="/revenue" element={<PublisherRevenuePage />} />
          <Route path="/payouts" element={<PublisherPayoutsPage />} />
          <Route path="/reviews" element={<PlaceholderPage title="Reviews & Issues" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Routes>
      </main>
    </div>
  );
}
