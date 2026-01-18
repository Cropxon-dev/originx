import { motion } from "framer-motion";
import { Key, Copy, MoreVertical, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type ApiKey = Tables<"api_keys">;

interface ActiveApiKeysProps {
  keys: ApiKey[];
  onViewAll: () => void;
}

export function ActiveApiKeys({ keys, onViewAll }: ActiveApiKeysProps) {
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const displayKeys = keys.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-card border border-border rounded-xl"
    >
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-accent" />
          <h3 className="font-semibold">Active API Keys</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          Manage
          <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </div>

      <div className="divide-y divide-border">
        {displayKeys.length === 0 ? (
          <div className="p-8 text-center">
            <Key className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No API keys yet</p>
          </div>
        ) : (
          displayKeys.map((key, index) => (
            <motion.div
              key={key.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-mono font-medium flex-shrink-0",
                    key.environment === "live"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  )}
                >
                  {key.environment.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{key.name}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {key.key_prefix}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {key.last_used_at
                    ? `Used ${new Date(key.last_used_at).toLocaleDateString()}`
                    : "Never used"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(key.key_prefix)}
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {keys.length > 4 && (
        <div className="p-3 border-t border-border">
          <button
            onClick={onViewAll}
            className="w-full text-sm text-muted-foreground hover:text-foreground text-center py-2 transition-colors"
          >
            View all {keys.length} keys →
          </button>
        </div>
      )}
    </motion.div>
  );
}
