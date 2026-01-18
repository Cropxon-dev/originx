import { useState, useEffect } from "react";

const SPLASH_SHOWN_KEY = "originx_splash_shown";

export function useSplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if this is a fresh page load (not a client-side navigation)
    const navigationEntries = performance.getEntriesByType("navigation");
    const navigationType = (navigationEntries[0] as PerformanceNavigationTiming)?.type;
    
    // Show splash on reload, navigate (fresh load), or if no session marker
    const isPageRefresh = navigationType === "reload" || navigationType === "navigate";
    const hasSeenSplash = sessionStorage.getItem(SPLASH_SHOWN_KEY);
    
    if (isPageRefresh || !hasSeenSplash) {
      // Clear the marker on refresh so splash shows
      if (isPageRefresh) {
        sessionStorage.removeItem(SPLASH_SHOWN_KEY);
      }
      setShowSplash(true);
    } else {
      setShowSplash(false);
    }
    
    setIsReady(true);
  }, []);

  const completeSplash = () => {
    sessionStorage.setItem(SPLASH_SHOWN_KEY, "true");
    setShowSplash(false);
  };

  return { showSplash, isReady, completeSplash };
}
