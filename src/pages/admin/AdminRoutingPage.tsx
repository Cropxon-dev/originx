import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Route, Server, Zap, Settings, AlertTriangle, CheckCircle,
  TrendingUp, Clock, DollarSign, Power
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface Provider {
  id: string;
  name: string;
  category: string;
  status: "active" | "degraded" | "offline";
  weight: number;
  latency: number;
  errorRate: number;
  costPerRequest: number;
  isCircuitBreakerOpen: boolean;
}

const mockProviders: Provider[] = [
  { id: "1", name: "OpenAI Primary", category: "AI & ML", status: "active", weight: 40, latency: 245, errorRate: 0.01, costPerRequest: 0.002, isCircuitBreakerOpen: false },
  { id: "2", name: "OpenAI Backup", category: "AI & ML", status: "active", weight: 30, latency: 312, errorRate: 0.02, costPerRequest: 0.0022, isCircuitBreakerOpen: false },
  { id: "3", name: "Anthropic Claude", category: "AI & ML", status: "active", weight: 20, latency: 198, errorRate: 0.005, costPerRequest: 0.0018, isCircuitBreakerOpen: false },
  { id: "4", name: "Google Gemini", category: "AI & ML", status: "degraded", weight: 10, latency: 520, errorRate: 0.15, costPerRequest: 0.0015, isCircuitBreakerOpen: true },
  { id: "5", name: "Stripe Primary", category: "Payments", status: "active", weight: 60, latency: 89, errorRate: 0.001, costPerRequest: 0.0001, isCircuitBreakerOpen: false },
  { id: "6", name: "Stripe Backup", category: "Payments", status: "active", weight: 40, latency: 112, errorRate: 0.002, costPerRequest: 0.00012, isCircuitBreakerOpen: false },
];

export default function AdminRoutingPage() {
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [globalSettings, setGlobalSettings] = useState({
    costFloor: 0.0001,
    costCeiling: 0.01,
    maxLatency: 1000,
    errorThreshold: 0.1,
    autoFailover: true,
  });

  const handleWeightChange = (id: string, weight: number) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, weight } : p));
  };

  const handleCircuitBreakerToggle = (id: string) => {
    setProviders(prev => prev.map(p => 
      p.id === id ? { ...p, isCircuitBreakerOpen: !p.isCircuitBreakerOpen } : p
    ));
    toast.success("Circuit breaker updated");
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { className: string; icon: typeof CheckCircle }> = {
      active: { className: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
      degraded: { className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: AlertTriangle },
      offline: { className: "bg-red-500/10 text-red-500 border-red-500/20", icon: Power },
    };
    const cfg = config[status];
    return (
      <Badge variant="outline" className={cfg.className}>
        <cfg.icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Routing Engine</h1>
            <p className="text-muted-foreground">Control provider weights, failover rules, and cost thresholds</p>
          </div>
        </div>

        {/* Global Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Global Routing Settings
            </CardTitle>
            <CardDescription>Platform-wide routing configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <Label className="text-sm">Cost Floor ($)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={globalSettings.costFloor}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, costFloor: parseFloat(e.target.value) }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-sm">Cost Ceiling ($)</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={globalSettings.costCeiling}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, costCeiling: parseFloat(e.target.value) }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-sm">Max Latency (ms)</Label>
                <Input
                  type="number"
                  value={globalSettings.maxLatency}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, maxLatency: parseInt(e.target.value) }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-sm">Error Threshold (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={globalSettings.errorThreshold * 100}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, errorThreshold: parseFloat(e.target.value) / 100 }))}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
              <Switch
                checked={globalSettings.autoFailover}
                onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, autoFailover: checked }))}
              />
              <Label>Enable automatic failover when provider health degrades</Label>
            </div>
          </CardContent>
        </Card>

        {/* Provider Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Active Providers", value: providers.filter(p => p.status === "active").length, icon: Server },
            { label: "Avg Latency", value: `${Math.round(providers.reduce((s, p) => s + p.latency, 0) / providers.length)}ms`, icon: Clock },
            { label: "Total Weight", value: `${providers.reduce((s, p) => s + p.weight, 0)}%`, icon: TrendingUp },
            { label: "Circuit Breakers", value: providers.filter(p => p.isCircuitBreakerOpen).length, icon: AlertTriangle },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
              <stat.icon className="w-5 h-5 text-accent mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Providers */}
        <div className="space-y-4">
          {["AI & ML", "Payments"].map(category => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category} Providers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {providers.filter(p => p.category === category).map((provider) => (
                  <div key={provider.id} className="flex items-center gap-6 p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-[150px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{provider.name}</span>
                        {getStatusBadge(provider.status)}
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {provider.latency}ms
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {(provider.errorRate * 100).toFixed(2)}%
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ${provider.costPerRequest}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs">Weight</Label>
                        <span className="text-sm font-mono">{provider.weight}%</span>
                      </div>
                      <Slider
                        value={[provider.weight]}
                        onValueChange={([v]) => handleWeightChange(provider.id, v)}
                        min={0}
                        max={100}
                        step={5}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!provider.isCircuitBreakerOpen}
                          onCheckedChange={() => handleCircuitBreakerToggle(provider.id)}
                        />
                        <Label className="text-xs whitespace-nowrap">
                          {provider.isCircuitBreakerOpen ? "Breaker Open" : "Active"}
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button onClick={() => toast.success("Routing configuration saved")}>
            Save Configuration
          </Button>
        </div>
      </motion.div>
    </div>
  );
}