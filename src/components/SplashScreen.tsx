import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

export function SplashScreen({ onComplete, minDuration = 2500 }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 600); // Wait for exit animation
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        >
          {/* Background subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
          
          {/* Logo Container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Animated Stacked Layers Logo */}
            <svg
              width="120"
              height="100"
              viewBox="0 0 56 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-8"
            >
              {/* Bottom Layer */}
              <motion.path
                d="M6 36 L28 44 L50 36 L28 28 Z"
                fill="currentColor"
                className="text-foreground"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              />
              
              {/* Middle Layer */}
              <motion.path
                d="M6 26 L28 34 L50 26 L28 18 Z"
                fill="currentColor"
                className="text-foreground"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              />
              
              {/* Top Layer */}
              <motion.path
                d="M10 14 Q28 6 46 14 L50 16 L28 24 L6 16 L10 14 Z"
                fill="currentColor"
                className="text-foreground"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              />
            </svg>

            {/* Animated Typography */}
            <div className="flex flex-col items-center overflow-hidden">
              {/* OriginX */}
              <motion.h1
                className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <span className="inline-block">
                  {"OriginX".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.8 + index * 0.05,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>

              {/* By Line */}
              <motion.div
                className="flex items-center gap-2 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                <motion.span
                  className="text-sm text-muted-foreground uppercase tracking-widest"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.4 }}
                >
                  By
                </motion.span>
              </motion.div>

              {/* CROPXON INNOVATIONS PVT LTD */}
              <motion.p
                className="text-lg md:text-xl font-medium tracking-wide text-muted-foreground mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                <span className="inline-block overflow-hidden">
                  {"CROPXON INNOVATIONS PVT LTD".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 1.5 + index * 0.02,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      className="inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </span>
              </motion.p>
            </div>

            {/* Loading indicator */}
            <motion.div
              className="mt-12 flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-foreground/30"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
