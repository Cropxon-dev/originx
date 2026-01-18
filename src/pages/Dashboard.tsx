import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Coins, DollarSign, Layers, Play, Code, Settings } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
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
  const [isLoading, setIsLoading] = useState(true);
  const [environment] = useState<'sandbox' | 'production'>('sandbox');
  const { metrics, isLoading: metricsLoading } = useRealtimeUsage(environment);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error: any) {
      console.error("Failed to fetch API keys:", error);
    } finally {
      setIsLoading(false);
    }
  };


  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Show skeleton while loading
  if (isLoading || metricsLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

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

      {/* Metrics Grid - Now using realtime data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <MetricCard
          title="Requests Today"
          value={metrics.totalRequests > 0 ? formatNumber(metrics.totalRequests) : "0"}
          change={{ value: metrics.totalRequests > 0 ? "+12.5%" : "—", trend: "up" }}
          icon={Zap}
          description="realtime"
          delay={0}
        />
        <MetricCard
          title="Tokens Used"
          value={metrics.totalTokens > 0 ? formatNumber(metrics.totalTokens) : "0"}
          change={{ value: metrics.totalTokens > 0 ? "+8.2%" : "—", trend: "up" }}
          icon={Coins}
          description="today"
          delay={0.05}
        />
        <MetricCard
          title="Current Spend"
          value={`$${metrics.totalCost.toFixed(2)}`}
          change={{ value: metrics.totalCost > 0 ? "-3.1%" : "—", trend: "down" }}
          icon={DollarSign}
          description="MTD"
          delay={0.1}
        />
        <MetricCard
          title="Active APIs"
          value={metrics.activeApis.toString()}
          change={{ value: metrics.activeApis > 0 ? `+${metrics.activeApis}` : "—", trend: "up" }}
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
              <span className="font-mono font-medium">{formatNumber(metrics.totalRequests)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((metrics.totalRequests / 1250000) * 100, 100)}%` }} 
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {((metrics.totalRequests / 1250000) * 100).toFixed(1)}% of monthly limit (1.25M)
            </p>
            
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Estimated Bill</span>
                <span className="font-mono font-medium text-lg">${(metrics.totalCost * 30).toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Based on current usage pattern
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg Latency</span>
                <span className="font-medium">{metrics.avgLatency.toFixed(0)}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Error Rate</span>
                <span className="font-medium">{metrics.errorRate.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
