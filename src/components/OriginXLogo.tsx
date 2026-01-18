import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OriginXLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  loading?: boolean;
  className?: string;
  showText?: boolean;
  showSubtext?: boolean;
}

const sizeConfig = {
  sm: { width: 20, height: 18 },
  md: { width: 28, height: 24 },
  lg: { width: 40, height: 34 },
  xl: { width: 56, height: 48 },
};

export function OriginXLogo({ 
  size = "md", 
  animate = true, 
  loading = false,
  className,
  showText = false,
  showSubtext = false,
}: OriginXLogoProps) {
  const config = sizeConfig[size];
  const { width, height } = config;
  
  // Layer animation delays (bottom to top)
  const layers = [
    { delay: 0 },      // Bottom
    { delay: 0.12 },   // Middle  
    { delay: 0.24 },   // Top
  ];

  const loadingAnimation = {
    opacity: [0.3, 1, 0.3],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  const enterAnimation = (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  });

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 56 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Bottom Layer - Isometric parallelogram */}
        <motion.path
          d="M6 36 L28 44 L50 36 L28 28 Z"
          fill="currentColor"
          className="text-foreground"
          initial={animate ? { opacity: 0, y: 6 } : false}
          animate={loading ? loadingAnimation : enterAnimation(layers[0].delay)}
          style={loading ? { animationDelay: "0ms" } : undefined}
        />
        
        {/* Middle Layer - Isometric parallelogram */}
        <motion.path
          d="M6 26 L28 34 L50 26 L28 18 Z"
          fill="currentColor"
          className="text-foreground"
          initial={animate ? { opacity: 0, y: 6 } : false}
          animate={loading ? { ...loadingAnimation, transition: { ...loadingAnimation.transition, delay: 0.15 } } : enterAnimation(layers[1].delay)}
        />
        
        {/* Top Layer - Isometric parallelogram with rounded top corners */}
        <motion.path
          d="M10 14 Q28 6 46 14 L50 16 L28 24 L6 16 L10 14 Z"
          fill="currentColor"
          className="text-foreground"
          initial={animate ? { opacity: 0, y: 6 } : false}
          animate={loading ? { ...loadingAnimation, transition: { ...loadingAnimation.transition, delay: 0.3 } } : enterAnimation(layers[2].delay)}
        />
      </svg>
      
      {showText && (
        <motion.div
          initial={animate ? { opacity: 0, x: -8 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex flex-col"
        >
          <span className="font-semibold text-lg tracking-tight leading-tight">
            OriginX
          </span>
          {showSubtext && (
            <span className="text-[10px] text-muted-foreground leading-tight">
              BY CROPXON
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Filled variant for favicon/app icon contexts
export function OriginXLogoFilled({ 
  size = "md",
  className,
}: { 
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const config = sizeConfig[size];
  const { width, height } = config;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 56 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
    >
      {/* Bottom Layer */}
      <path
        d="M6 36 L28 44 L50 36 L28 28 Z"
        fill="currentColor"
        opacity={0.4}
        className="text-foreground"
      />
      {/* Middle Layer */}
      <path
        d="M6 26 L28 34 L50 26 L28 18 Z"
        fill="currentColor"
        opacity={0.7}
        className="text-foreground"
      />
      {/* Top Layer */}
      <path
        d="M10 14 Q28 6 46 14 L50 16 L28 24 L6 16 L10 14 Z"
        fill="currentColor"
        opacity={1}
        className="text-foreground"
      />
    </svg>
  );
}

// Loading screen component
export function OriginXLoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <OriginXLogo size="xl" loading animate />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-sm text-muted-foreground"
      >
        Initializing...
      </motion.p>
    </div>
  );
}
