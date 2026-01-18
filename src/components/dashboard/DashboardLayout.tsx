import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [environment, setEnvironment] = useState<"sandbox" | "production">("sandbox");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        user={user}
        environment={environment}
        onEnvironmentChange={setEnvironment}
      />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed bottom-4 right-4 z-50 lg:hidden h-12 w-12 rounded-full bg-accent text-accent-foreground shadow-lg"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <div className="pt-16">
            <DashboardSidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: sidebarCollapsed ? 72 : 256,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "pt-16 min-h-screen",
          "hidden lg:block"
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </motion.main>

      {/* Mobile Main Content */}
      <main className="lg:hidden pt-16">
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
