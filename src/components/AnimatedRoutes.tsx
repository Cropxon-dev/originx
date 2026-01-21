import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Playground from "@/pages/Playground";
import Marketplace from "@/pages/Marketplace";
import About from "@/pages/About";
import OneAuth from "@/pages/OneAuth";
import NotFound from "@/pages/NotFound";

// Dashboard pages
import ApiKeysPage from "@/pages/dashboard/ApiKeysPage";
import UsageAnalyticsPage from "@/pages/dashboard/UsageAnalyticsPage";
import BillingPage from "@/pages/dashboard/BillingPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import AlertsPage from "@/pages/dashboard/AlertsPage";
import LogsPage from "@/pages/dashboard/LogsPage";
import MyApisPage from "@/pages/dashboard/MyApisPage";
import DocsPage from "@/pages/dashboard/DocsPage";
import RoutingPage from "@/pages/dashboard/RoutingPage";
import DashboardMarketplace from "@/pages/dashboard/DashboardMarketplace";

// Publisher pages
import PublisherDashboard from "@/pages/publisher/PublisherDashboard";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/auth"
          element={
            <PageTransition>
              <Auth />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/oneauth"
          element={
            <PageTransition>
              <OneAuth />
            </PageTransition>
          }
        />
        <Route
          path="/playground"
          element={
            <PageTransition>
              <Playground />
            </PageTransition>
          }
        />
        <Route
          path="/marketplace"
          element={
            <PageTransition>
              <Marketplace />
            </PageTransition>
          }
        />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/marketplace"
          element={
            <PageTransition>
              <DashboardMarketplace />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/my-apis"
          element={
            <PageTransition>
              <MyApisPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/keys"
          element={
            <PageTransition>
              <ApiKeysPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/usage"
          element={
            <PageTransition>
              <UsageAnalyticsPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/billing"
          element={
            <PageTransition>
              <BillingPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/alerts"
          element={
            <PageTransition>
              <AlertsPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/logs"
          element={
            <PageTransition>
              <LogsPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/docs"
          element={
            <PageTransition>
              <DocsPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <PageTransition>
              <SettingsPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/routing"
          element={
            <PageTransition>
              <RoutingPage />
            </PageTransition>
          }
        />

        {/* Publisher Routes */}
        <Route
          path="/publisher/*"
          element={
            <PageTransition>
              <PublisherDashboard />
            </PageTransition>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <PageTransition>
              <AdminDashboard />
            </PageTransition>
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};
