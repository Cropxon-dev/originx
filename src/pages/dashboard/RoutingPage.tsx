import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Route, Zap, DollarSign, Clock, Shield, Server, 
  ChevronRight, Info, Settings, TrendingUp, Activity
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const routingModes = [
  { id: "balanced", label: "Balanced", description: "Optimal mix of cost, speed, and quality", recommended: true },
  { id: "cost", label: "Lowest Cost", description: "Minimize spending, may affect latency" },
  { id: "latency", label: "Lowest Latency", description: "Fastest response times" },
  { id: "quality", label: "Highest Quality", description: "Best model outputs" },
  { id: "region", label: "Region Locked", description: "Data residency compliance" },
  { id: "custom", label: "Custom", description: "Enterprise routing rules", enterprise: true },
];

const providers = [
  { name: "OpenAI", status: "active", latency: 124, cost: 0.0182, reliability: 99.98 },
  { name: "Anthropic", status: "backup", latency: 156, cost: 0.0195, reliability: 99.95 },
  { name: "Google AI", status: "backup", latency: 189, cost: 0.0168, reliability: 99.92 },
  { name: "Mistral", status: "backup", latency: 98, cost: 0.0142, reliability: 99.89 },
];

const costBreakdown = {
  providerCost: 0.00182,
  originxFee: 0.00018,
  totalCost: 0.00200,
  billingUnit: "Tokens",
  last24hSpend: 1.24,
};

export default function RoutingPage() {
  const [selectedMode, setSelectedMode] = useState("balanced");
  const [showProviderBreakdown, setShowProviderBreakdown] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    requests: 24847,
    avgLatency: 124,
    successRate: 99.88,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics((prev) => ({
        requests: prev.requests + Math.floor(Math.random() * 5),
        avgLatency: 120 + Math.floor(Math.random() * 20),
        successRate: 99.85 + Math.random() * 0.14,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Routing & Optimization</h1>
        <p className="text-muted-foreground">
          Control how OriginX routes your requests for optimal cost, speed, and reliability.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Routing Mode Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold flex items-center gap-2">
                <Route className="w-5 h-5 text-accent" />
                Routing Mode
              </h2>
              <Button variant="ghost" size="sm">
                <Info className="w-4 h-4 mr-1" />
                Learn More
              </Button>
            </div>

            <RadioGroup value={selectedMode} onValueChange={setSelectedMode} className="space-y-3">
              {routingModes.map((mode) => (
                <div key={mode.id} className="relative">
                  <Label
                    htmlFor={mode.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                      selectedMode === mode.id
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-muted-foreground/50",
                      mode.enterprise && "opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <RadioGroupItem value={mode.id} id={mode.id} disabled={mode.enterprise} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{mode.label}</span>
                          {mode.recommended && (
                            <Badge className="bg-accent/10 text-accent border-0 text-xs">
                              Recommended
                            </Badge>
                          )}
                          {mode.enterprise && (
                            <Badge variant="outline" className="text-xs">
                              Enterprise
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{mode.description}</p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </motion.div>

          {/* Live Routing Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h2 className="font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              Live Routing
            </h2>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Client Request */}
              <div className="text-center">
                <div className="p-4 rounded-xl bg-muted/50 border border-border mb-2">
                  <span className="text-sm font-mono">Your Request</span>
                </div>
                <p className="text-xs text-muted-foreground">Client</p>
              </div>

              <ChevronRight className="w-6 h-6 text-accent hidden lg:block" />
              <div className="h-6 w-px bg-accent lg:hidden" />

              {/* OriginX Gateway */}
              <div className="text-center">
                <motion.div 
                  animate={{ boxShadow: ["0 0 0 0 hsl(var(--accent) / 0)", "0 0 20px 5px hsl(var(--accent) / 0.3)", "0 0 0 0 hsl(var(--accent) / 0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-4 rounded-xl bg-accent/10 border border-accent/30 mb-2"
                >
                  <span className="text-sm font-semibold text-accent">OriginX Gateway</span>
                </motion.div>
                <p className="text-xs text-muted-foreground">Auth • Meter • Route</p>
              </div>

              <ChevronRight className="w-6 h-6 text-accent hidden lg:block" />
              <div className="h-6 w-px bg-accent lg:hidden" />

              {/* Provider */}
              <div className="text-center">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 mb-2">
                  <span className="text-sm font-medium text-green-500">OpenAI</span>
                </div>
                <p className="text-xs text-muted-foreground">Selected Provider</p>
              </div>
            </div>

            {/* Provider Table */}
            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={() => setShowProviderBreakdown(!showProviderBreakdown)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ChevronRight className={cn("w-4 h-4 transition-transform", showProviderBreakdown && "rotate-90")} />
                Show provider comparison
              </button>

              {showProviderBreakdown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  {providers.map((provider) => (
                    <div
                      key={provider.name}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg",
                        provider.status === "active" ? "bg-green-500/5 border border-green-500/20" : "bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          provider.status === "active" ? "bg-green-500" : "bg-muted-foreground"
                        )} />
                        <span className="font-medium text-sm">{provider.name}</span>
                        {provider.status === "active" && (
                          <Badge className="bg-green-500/10 text-green-500 border-0 text-xs">Active</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>{provider.latency}ms</span>
                        <span>${provider.cost.toFixed(4)}</span>
                        <span>{provider.reliability}%</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Cost Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h2 className="font-semibold mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent" />
              Cost Breakdown
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Provider Cost</span>
                <span className="font-mono">${costBreakdown.providerCost.toFixed(5)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">OriginX Fee (10%)</span>
                <span className="font-mono">${costBreakdown.originxFee.toFixed(5)}</span>
              </div>
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="font-medium">Total Cost</span>
                <span className="font-mono text-lg font-semibold">${costBreakdown.totalCost.toFixed(5)}</span>
              </div>
              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">Billing Unit</span>
                <span>{costBreakdown.billingUnit}</span>
              </div>
              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">Last 24h Spend</span>
                <span className="font-mono text-accent">${costBreakdown.last24hSpend.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
              <Info className="w-3 h-3 inline mr-1" />
              OriginX charges a transparent 10% fee on top of provider costs. No hidden margins.
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Live Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Live Metrics</h3>
              <span className="flex items-center gap-1 text-xs text-green-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Requests Today</span>
                  <motion.span 
                    key={liveMetrics.requests}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    className="font-mono"
                  >
                    {liveMetrics.requests.toLocaleString()}
                  </motion.span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Avg Latency</span>
                  <motion.span 
                    key={liveMetrics.avgLatency}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    className="font-mono"
                  >
                    {liveMetrics.avgLatency}ms
                  </motion.span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Success Rate</span>
                  <motion.span 
                    key={liveMetrics.successRate.toFixed(2)}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-green-500"
                  >
                    {liveMetrics.successRate.toFixed(2)}%
                  </motion.span>
                </div>
                <Progress value={liveMetrics.successRate} className="h-2" />
              </div>
            </div>
          </motion.div>

          {/* Performance Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="font-semibold mb-4">Performance</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Error Rate</span>
                  <span className="font-mono">0.12%</span>
                </div>
                <Progress value={0.12} max={5} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">P95 Latency</span>
                  <span className="font-mono">245ms</span>
                </div>
                <Progress value={24.5} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-mono text-green-500">99.99%</span>
                </div>
                <Progress value={99.99} className="h-2" />
              </div>
            </div>
          </motion.div>

          {/* Advanced Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Advanced Rules
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Max cost/request</span>
                <span>$0.05</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Preferred region</span>
                <span>US-East</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fallback enabled</span>
                <span className="text-green-500">Yes</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-4">
              Configure Rules
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
