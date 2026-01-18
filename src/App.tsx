import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { PerformanceProvider } from "@/hooks/usePerformance";
import { SplashScreen } from "@/components/SplashScreen";
import { useSplashScreen } from "@/hooks/useSplashScreen";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import ErrorBoundary from "@/components/ErrorBoundary";

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
        <AnimatedRoutes />
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
