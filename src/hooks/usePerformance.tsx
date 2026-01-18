import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";

interface PerformanceContextType {
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  lowEffects: boolean;
  setLowEffects: (value: boolean) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const PerformanceProvider = ({ children }: { children: ReactNode }) => {
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("originx-reduced-motion");
      if (stored !== null) return stored === "true";
      // Auto-detect system preference
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  const [lowEffects, setLowEffectsState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("originx-low-effects");
      if (stored !== null) return stored === "true";
      return false;
    }
    return false;
  });

  // Listen to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't set a manual preference
      const stored = localStorage.getItem("originx-reduced-motion");
      if (stored === null) {
        setReducedMotionState(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setReducedMotion = useCallback((value: boolean) => {
    setReducedMotionState(value);
    localStorage.setItem("originx-reduced-motion", String(value));
  }, []);

  const setLowEffects = useCallback((value: boolean) => {
    setLowEffectsState(value);
    localStorage.setItem("originx-low-effects", String(value));
  }, []);

  // Apply reduced motion class to document
  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
  }, [reducedMotion]);

  useEffect(() => {
    const root = document.documentElement;
    if (lowEffects) {
      root.classList.add("low-effects");
    } else {
      root.classList.remove("low-effects");
    }
  }, [lowEffects]);

  return (
    <PerformanceContext.Provider value={{ reducedMotion, setReducedMotion, lowEffects, setLowEffects }}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};
