import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  user: SupabaseUser | null;
  environment: "sandbox" | "production";
  onEnvironmentChange: (env: "sandbox" | "production") => void;
}

export function DashboardHeader({ 
  user, 
  environment, 
  onEnvironmentChange 
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-glow-secondary flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">O</span>
          </div>
          <span className="font-semibold text-lg tracking-tight hidden sm:inline">OriginX</span>
        </Link>

        {/* Global Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search APIs, keys, usage, docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50 border-border"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Environment Toggle */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            <button
              onClick={() => onEnvironmentChange("sandbox")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                environment === "sandbox"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-1.5">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  environment === "sandbox" ? "bg-yellow-500" : "bg-muted-foreground/50"
                )} />
                Sandbox
              </span>
            </button>
            <button
              onClick={() => onEnvironmentChange("production")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                environment === "production"
                  ? "bg-green-500/10 text-green-500"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-1.5">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  environment === "production" ? "bg-green-500" : "bg-muted-foreground/50"
                )} />
                Production
              </span>
            </button>
          </div>

          <ThemeToggle />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-glow-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className="hidden lg:inline text-sm max-w-[150px] truncate">
                  {user?.email?.split("@")[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.email?.split("@")[0]}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
