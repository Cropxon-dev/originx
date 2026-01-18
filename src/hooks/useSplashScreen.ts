import { useState, useEffect } from "react";

const SPLASH_SHOWN_KEY = "originx_splash_shown";
const SPLASH_EXPIRY_KEY = "originx_splash_expiry";
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

export function useSplashScreen() {
  const [showSplash, setShowSplash] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if splash was recently shown
    const splashShown = sessionStorage.getItem(SPLASH_SHOWN_KEY);
    const splashExpiry = sessionStorage.getItem(SPLASH_EXPIRY_KEY);
    const now = Date.now();

    if (splashShown && splashExpiry && now < parseInt(splashExpiry)) {
      // Splash was shown recently, skip it
      setShowSplash(false);
      setIsReady(true);
    } else {
      // Show splash screen
      setShowSplash(true);
      setIsReady(true);
    }
  }, []);

  const completeSplash = () => {
    // Mark splash as shown for this session
    sessionStorage.setItem(SPLASH_SHOWN_KEY, "true");
    sessionStorage.setItem(SPLASH_EXPIRY_KEY, (Date.now() + SESSION_DURATION).toString());
    setShowSplash(false);
  };

  return { showSplash, isReady, completeSplash };
}
