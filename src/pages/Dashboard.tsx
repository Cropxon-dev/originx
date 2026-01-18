import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  LayoutDashboard,
  Settings,
  Code,
  Play,
  RefreshCw,
} from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User } from "@supabase/supabase-js";
import type { Tables } from "@/integrations/supabase/types";

type ApiKey = Tables<"api_keys">;

const generateApiKey = (environment: "test" | "live") => {
  const prefix = environment === "test" ? "ox_test_" : "ox_live_";
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = prefix;
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

const hashKey = async (key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, string>>({});
  const [creatingKey, setCreatingKey] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchApiKeys();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch API keys");
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async (environment: "test" | "live") => {
    if (!user) return;

    setCreatingKey(true);
    try {
      const fullKey = generateApiKey(environment);
      const keyHash = await hashKey(fullKey);
      const keyPrefix = fullKey.substring(0, 12) + "...";

      const { error } = await supabase.from("api_keys").insert({
        user_id: user.id,
        name: `${environment === "test" ? "Test" : "Live"} Key`,
        key_prefix: keyPrefix,
        key_hash: keyHash,
        environment,
      });

      if (error) throw error;

      // Show the full key temporarily
      toast.success("API key created! Copy it now - you won't see it again.", {
        duration: 10000,
      });

      // Store temporarily for copying
      const tempId = crypto.randomUUID();
      setRevealedKeys((prev) => ({ ...prev, [tempId]: fullKey }));

      // Copy to clipboard
      await navigator.clipboard.writeText(fullKey);
      toast.success("Key copied to clipboard!");

      fetchApiKeys();
    } catch (error: any) {
      toast.error("Failed to create API key");
    } finally {
      setCreatingKey(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase.from("api_keys").delete().eq("id", id);
      if (error) throw error;
      toast.success("API key deleted");
      fetchApiKeys();
    } catch (error: any) {
      toast.error("Failed to delete API key");
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-glow-secondary flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">O</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">OriginX</span>
            </a>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-6">
          {/* Dashboard Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-display mb-2">Developer Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Manage your API keys and monitor usage.
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            <a
              href="/playground"
              className="glass rounded-xl p-6 border border-border/50 hover:border-accent/30 transition-colors group"
            >
              <Play className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold mb-1">API Playground</h3>
              <p className="text-sm text-muted-foreground">
                Test API calls in real-time
              </p>
            </a>
            <a
              href="#"
              className="glass rounded-xl p-6 border border-border/50 hover:border-accent/30 transition-colors group"
            >
              <Code className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold mb-1">Documentation</h3>
              <p className="text-sm text-muted-foreground">
                Explore API reference
              </p>
            </a>
            <a
              href="#"
              className="glass rounded-xl p-6 border border-border/50 hover:border-accent/30 transition-colors group"
            >
              <Settings className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold mb-1">Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure your account
              </p>
            </a>
          </motion.div>

          {/* API Keys Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-accent" />
                <h2 className="text-title">API Keys</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => createApiKey("test")}
                  disabled={creatingKey}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Test Key
                </Button>
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => createApiKey("live")}
                  disabled={creatingKey}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Live Key
                </Button>
              </div>
            </div>

            {apiKeys.length === 0 ? (
              <div className="glass rounded-xl p-12 text-center border border-border/50">
                <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No API keys yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first API key to start building.
                </p>
                <Button
                  variant="hero"
                  onClick={() => createApiKey("test")}
                  disabled={creatingKey}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Test Key
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <motion.div
                    key={key.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-4 border border-border/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`px-2 py-1 rounded text-xs font-mono ${
                          key.environment === "live"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {key.environment.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{key.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {key.key_prefix}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Created {new Date(key.created_at).toLocaleDateString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(key.key_prefix)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteApiKey(key.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
