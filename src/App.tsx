import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { PerformanceProvider } from "@/hooks/usePerformance";
import { SplashScreen } from "@/components/SplashScreen";
import { useSplashScreen } from "@/hooks/useSplashScreen";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Playground from "./pages/Playground";
import Marketplace from "./pages/Marketplace";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Dashboard pages
import ApiKeysPage from "./pages/dashboard/ApiKeysPage";
import UsageAnalyticsPage from "./pages/dashboard/UsageAnalyticsPage";
import BillingPage from "./pages/dashboard/BillingPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import AlertsPage from "./pages/dashboard/AlertsPage";
import LogsPage from "./pages/dashboard/LogsPage";
import MyApisPage from "./pages/dashboard/MyApisPage";
import DocsPage from "./pages/dashboard/DocsPage";
import RoutingPage from "./pages/dashboard/RoutingPage";
import DashboardMarketplace from "./pages/dashboard/DashboardMarketplace";

// Publisher pages
import PublisherDashboard from "./pages/publisher/PublisherDashboard";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const AppContent = () => {
  const { showSplash, isReady, completeSplash } = useSplashScreen();

  if (!isReady) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen onComplete={completeSplash} />;
  }

  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/marketplace" element={<Marketplace />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/marketplace" element={<DashboardMarketplace />} />
          <Route path="/dashboard/my-apis" element={<MyApisPage />} />
          <Route path="/dashboard/keys" element={<ApiKeysPage />} />
          <Route path="/dashboard/usage" element={<UsageAnalyticsPage />} />
          <Route path="/dashboard/billing" element={<BillingPage />} />
          <Route path="/dashboard/alerts" element={<AlertsPage />} />
          <Route path="/dashboard/logs" element={<LogsPage />} />
          <Route path="/dashboard/docs" element={<DocsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/routing" element={<RoutingPage />} />

          {/* Publisher Routes */}
          <Route path="/publisher/*" element={<PublisherDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PerformanceProvider>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </PerformanceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
