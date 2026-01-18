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
  sm: { width: 24, height: 24, layerSize: 10, gap: 2, strokeWidth: 1.5 },
  md: { width: 32, height: 32, layerSize: 14, gap: 3, strokeWidth: 2 },
  lg: { width: 48, height: 48, layerSize: 20, gap: 4, strokeWidth: 2.5 },
  xl: { width: 64, height: 64, layerSize: 28, gap: 5, strokeWidth: 3 },
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
  const { width, height, layerSize, gap, strokeWidth } = config;
  
  // Calculate layer positions (center of canvas, stacked vertically)
  const centerX = width / 2;
  const centerY = height / 2;
  const totalStackHeight = (layerSize * 0.5) * 3 + gap * 2;
  const startY = centerY - totalStackHeight / 2 + layerSize * 0.25;

  const layers = [
    { y: startY + (layerSize * 0.5 + gap) * 2, delay: 0 },      // Bottom
    { y: startY + (layerSize * 0.5 + gap), delay: 0.1 },        // Middle
    { y: startY, delay: 0.2 },                                    // Top
  ];

  // Create diamond path (rotated square with rounded corners)
  const createDiamondPath = (cx: number, cy: number, size: number) => {
    const half = size / 2;
    const corner = size * 0.15; // Rounded corner amount
    
    return `
      M ${cx} ${cy - half + corner}
      Q ${cx} ${cy - half} ${cx + corner} ${cy - half + corner * 0.3}
      L ${cx + half - corner} ${cy - corner * 0.3}
      Q ${cx + half} ${cy} ${cx + half - corner} ${cy + corner * 0.3}
      L ${cx + corner} ${cy + half - corner * 0.3}
      Q ${cx} ${cy + half} ${cx - corner} ${cy + half - corner * 0.3}
      L ${cx - half + corner} ${cy + corner * 0.3}
      Q ${cx - half} ${cy} ${cx - half + corner} ${cy - corner * 0.3}
      L ${cx - corner} ${cy - half + corner * 0.3}
      Q ${cx} ${cy - half} ${cx} ${cy - half + corner}
      Z
    `;
  };

  const loadingVariants = {
    initial: { opacity: 0.3 },
    animate: (i: number) => ({
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        delay: i * 0.15,
        ease: "easeInOut" as const,
      },
    }),
  };

  const enterVariants = {
    initial: { opacity: 0, y: 8 },
    animate: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {layers.map((layer, index) => {
          if (loading) {
            return (
              <motion.path
                key={index}
                d={createDiamondPath(centerX, layer.y, layerSize)}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="text-foreground"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: "easeInOut",
                }}
              />
            );
          }
          return (
            <motion.path
              key={index}
              d={createDiamondPath(centerX, layer.y, layerSize)}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="text-foreground"
              initial={animate ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: layer.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          );
        })}
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
  const { width, height, layerSize, gap } = config;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const totalStackHeight = (layerSize * 0.5) * 3 + gap * 2;
  const startY = centerY - totalStackHeight / 2 + layerSize * 0.25;

  const layers = [
    { y: startY + (layerSize * 0.5 + gap) * 2, opacity: 0.4 },
    { y: startY + (layerSize * 0.5 + gap), opacity: 0.7 },
    { y: startY, opacity: 1 },
  ];

  const createDiamondPath = (cx: number, cy: number, size: number) => {
    const half = size / 2;
    return `
      M ${cx} ${cy - half}
      L ${cx + half} ${cy}
      L ${cx} ${cy + half}
      L ${cx - half} ${cy}
      Z
    `;
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
    >
      {layers.map((layer, index) => (
        <path
          key={index}
          d={createDiamondPath(centerX, layer.y, layerSize * 0.9)}
          fill="currentColor"
          opacity={layer.opacity}
          className="text-accent"
        />
      ))}
    </svg>
  );
}

// Gradient background variant for cards/hero sections
export function OriginXLogoGradient({ 
  size = "lg",
  className,
}: { 
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const config = sizeConfig[size];
  const { width, height, layerSize, gap, strokeWidth } = config;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const totalStackHeight = (layerSize * 0.5) * 3 + gap * 2;
  const startY = centerY - totalStackHeight / 2 + layerSize * 0.25;

  const layers = [
    { y: startY + (layerSize * 0.5 + gap) * 2, delay: 0 },
    { y: startY + (layerSize * 0.5 + gap), delay: 0.1 },
    { y: startY, delay: 0.2 },
  ];

  const createDiamondPath = (cx: number, cy: number, size: number) => {
    const half = size / 2;
    const corner = size * 0.12;
    
    return `
      M ${cx} ${cy - half + corner}
      Q ${cx} ${cy - half} ${cx + corner} ${cy - half + corner * 0.3}
      L ${cx + half - corner} ${cy - corner * 0.3}
      Q ${cx + half} ${cy} ${cx + half - corner} ${cy + corner * 0.3}
      L ${cx + corner} ${cy + half - corner * 0.3}
      Q ${cx} ${cy + half} ${cx - corner} ${cy + half - corner * 0.3}
      L ${cx - half + corner} ${cy + corner * 0.3}
      Q ${cx - half} ${cy} ${cx - half + corner} ${cy - corner * 0.3}
      L ${cx - corner} ${cy - half + corner * 0.3}
      Q ${cx} ${cy - half} ${cx} ${cy - half + corner}
      Z
    `;
  };

  return (
    <div className={cn(
      "w-fit h-fit rounded-xl bg-gradient-to-br from-accent to-glow-secondary p-2 flex items-center justify-center",
      className
    )}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {layers.map((layer, index) => (
          <motion.path
            key={index}
            d={createDiamondPath(centerX, layer.y, layerSize)}
            stroke="hsl(var(--accent-foreground))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: layer.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        ))}
      </svg>
    </div>
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