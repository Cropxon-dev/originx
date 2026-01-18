import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Store, Layers, Key, BarChart3, CreditCard,
  Bell, FileText, Book, Settings, ChevronLeft, ChevronRight, Route
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { title: "Overview", icon: LayoutDashboard, href: "/dashboard", badge: null },
  { title: "API Marketplace", icon: Store, href: "/dashboard/marketplace", badge: "700+" },
  { title: "My APIs", icon: Layers, href: "/dashboard/my-apis", badge: null },
  { title: "API Keys", icon: Key, href: "/dashboard/keys", badge: null },
  { title: "Usage & Analytics", icon: BarChart3, href: "/dashboard/usage", badge: null },
  { title: "Routing & Optimization", icon: Route, href: "/dashboard/routing", badge: null },
  { title: "Billing & Costs", icon: CreditCard, href: "/dashboard/billing", badge: null },
  { title: "Alerts & Limits", icon: Bell, href: "/dashboard/alerts", badge: null },
  { title: "Logs & Monitoring", icon: FileText, href: "/dashboard/logs", badge: null },
  { title: "Documentation", icon: Book, href: "/dashboard/docs", badge: null },
  { title: "Settings", icon: Settings, href: "/dashboard/settings", badge: null },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed left-0 top-16 bottom-0 z-40 border-r border-border bg-background flex flex-col"
    >
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "hover:bg-muted",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-accent")} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.title}</span>
                    {item.badge && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Collapse Toggle */}
      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
