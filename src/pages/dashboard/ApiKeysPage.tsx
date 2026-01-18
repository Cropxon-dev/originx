import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Key, Plus, Copy, Trash2, RefreshCw, Shield, Globe, 
  MoreVertical, AlertCircle, CheckCircle2, Clock
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingKey, setCreatingKey] = useState(false);
  const [newKeyDialogOpen, setNewKeyDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState<"test" | "live">("test");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

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
      toast.error("Failed to fetch API keys");
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setCreatingKey(true);
    try {
      const fullKey = generateApiKey(newKeyEnv);
      const keyHash = await hashKey(fullKey);
      const keyPrefix = fullKey.substring(0, 12) + "...";

      const { error } = await supabase.from("api_keys").insert({
        user_id: user.id,
        name: newKeyName || `${newKeyEnv === "test" ? "Test" : "Live"} Key`,
        key_prefix: keyPrefix,
        key_hash: keyHash,
        environment: newKeyEnv,
      });

      if (error) throw error;

      setGeneratedKey(fullKey);
      await navigator.clipboard.writeText(fullKey);
      toast.success("Key copied to clipboard!");

      fetchApiKeys();
    } catch (error: any) {
      toast.error("Failed to create API key");
      setNewKeyDialogOpen(false);
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

  const resetDialog = () => {
    setNewKeyName("");
    setNewKeyEnv("test");
    setGeneratedKey(null);
    setNewKeyDialogOpen(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API keys for sandbox and production environments.
          </p>
        </div>

        <Dialog open={newKeyDialogOpen} onOpenChange={(open) => {
          if (!open) resetDialog();
          else setNewKeyDialogOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            {!generatedKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Generate a new API key for your application.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Key Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Production App"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <Select value={newKeyEnv} onValueChange={(v) => setNewKeyEnv(v as "test" | "live")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="test">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            Sandbox (Test)
                          </span>
                        </SelectItem>
                        <SelectItem value="live">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Production (Live)
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={resetDialog}>
                    Cancel
                  </Button>
                  <Button onClick={createApiKey} disabled={creatingKey}>
                    {creatingKey ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Key className="w-4 h-4 mr-2" />
                    )}
                    Generate Key
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    API Key Created
                  </DialogTitle>
                  <DialogDescription>
                    Copy your API key now. You won't be able to see it again!
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm break-all">
                    {generatedKey}
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-sm text-yellow-500">
                    <AlertCircle className="w-4 h-4" />
                    This key will only be shown once.
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => copyToClipboard(generatedKey)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Again
                  </Button>
                  <Button onClick={resetDialog}>Done</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Keys List */}
      {apiKeys.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-12 text-center"
        >
          <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No API keys yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first API key to start integrating with OriginX APIs.
          </p>
          <Button variant="hero" onClick={() => setNewKeyDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Key
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          {/* Table Header - Desktop */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="col-span-4">Name</div>
            <div className="col-span-2">Environment</div>
            <div className="col-span-2">Last Used</div>
            <div className="col-span-2">Created</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {apiKeys.map((key, index) => (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-4 hover:bg-muted/50 transition-colors"
              >
                <div className="md:col-span-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Key className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{key.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{key.key_prefix}</p>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      key.environment === "live"
                        ? "border-green-500/30 bg-green-500/10 text-green-500"
                        : "border-yellow-500/30 bg-yellow-500/10 text-yellow-500"
                    )}
                  >
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full mr-1.5",
                      key.environment === "live" ? "bg-green-500" : "bg-yellow-500"
                    )} />
                    {key.environment === "live" ? "Production" : "Sandbox"}
                  </Badge>
                </div>

                <div className="md:col-span-2 flex items-center text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 mr-1.5 hidden sm:inline" />
                  {key.last_used_at
                    ? new Date(key.last_used_at).toLocaleDateString()
                    : "Never"}
                </div>

                <div className="md:col-span-2 flex items-center text-sm text-muted-foreground">
                  {new Date(key.created_at).toLocaleDateString()}
                </div>

                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(key.key_prefix)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => copyToClipboard(key.key_prefix)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prefix
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="w-4 h-4 mr-2" />
                        Restrict IPs
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Globe className="w-4 h-4 mr-2" />
                        Set Rate Limit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteApiKey(key.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Key
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
      >
        <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Security Best Practices</p>
          <p className="text-xs text-muted-foreground mt-1">
            Never expose your API keys in client-side code or public repositories. 
            Use environment variables and server-side code to keep your keys secure.
            Rotate keys regularly and use IP restrictions for production keys.
          </p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
