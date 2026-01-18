import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Coins, DollarSign, Layers, Play, Code, Settings } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ActiveApiKeys } from "@/components/dashboard/ActiveApiKeys";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeUsage } from "@/hooks/useRealtimeUsage";
import type { Tables } from "@/integrations/supabase/types";

type ApiKey = Tables<"api_keys">;

const Dashboard = () => {
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox');
  const { metrics, isLoading: metricsLoading } = useRealtimeUsage(environment);
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error: any) {
      console.error("Failed to fetch API keys:", error);
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your API usage, manage keys, and control costs.
        </p>
      </motion.div>

      {/* Quick Actions - Mobile */}
      <div className="grid grid-cols-3 gap-2 mb-6 lg:hidden">
        <button
          onClick={() => navigate("/playground")}
          className="bg-card border border-border rounded-lg p-3 text-center hover:border-accent/30 transition-colors"
        >
          <Play className="w-5 h-5 mx-auto mb-1 text-accent" />
          <span className="text-xs">Playground</span>
        </button>
        <button
          onClick={() => navigate("/dashboard/keys")}
          className="bg-card border border-border rounded-lg p-3 text-center hover:border-accent/30 transition-colors"
        >
          <Code className="w-5 h-5 mx-auto mb-1 text-accent" />
          <span className="text-xs">API Keys</span>
        </button>
        <button
          onClick={() => navigate("/dashboard/settings")}
          className="bg-card border border-border rounded-lg p-3 text-center hover:border-accent/30 transition-colors"
        >
          <Settings className="w-5 h-5 mx-auto mb-1 text-accent" />
          <span className="text-xs">Settings</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <MetricCard
          title="Requests Today"
          value="24,847"
          change={{ value: "+12.5%", trend: "up" }}
          icon={Zap}
          description="vs yesterday"
          delay={0}
        />
        <MetricCard
          title="Tokens Used"
          value="1.2M"
          change={{ value: "+8.2%", trend: "up" }}
          icon={Coins}
          description="this month"
          delay={0.05}
        />
        <MetricCard
          title="Current Spend"
          value="$127.50"
          change={{ value: "-3.1%", trend: "down" }}
          icon={DollarSign}
          description="MTD"
          delay={0.1}
        />
        <MetricCard
          title="Active APIs"
          value="12"
          change={{ value: "+2", trend: "up" }}
          icon={Layers}
          description="subscribed"
          delay={0.15}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="xl:col-span-2">
          <UsageChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* API Keys Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ActiveApiKeys
          keys={apiKeys}
          onViewAll={() => navigate("/dashboard/keys")}
        />
        
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold mb-4">This Month Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Requests</span>
              <span className="font-mono font-medium">847,234</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-accent h-2 rounded-full" style={{ width: "68%" }} />
            </div>
            <p className="text-xs text-muted-foreground">68% of monthly limit (1.25M)</p>
            
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Estimated Bill</span>
                <span className="font-mono font-medium text-lg">$247.80</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Based on current usage pattern
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Top API</span>
                <span className="font-medium">GPT-4 Turbo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Top Category</span>
                <span className="font-medium">AI & ML</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
