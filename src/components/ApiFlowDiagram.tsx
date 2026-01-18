import { motion } from "framer-motion";
import { Zap, Shield, Route, Server, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

const providers = [
  { name: "OpenAI", color: "from-emerald-500 to-emerald-600" },
  { name: "Stripe", color: "from-violet-500 to-violet-600" },
  { name: "Twilio", color: "from-red-500 to-red-600" },
  { name: "AWS", color: "from-amber-500 to-amber-600" },
];

// Animated Arrow Component with flowing particles
const AnimatedArrow = ({ 
  isActive, 
  direction = "right",
  delay = 0,
  color = "accent"
}: { 
  isActive: boolean; 
  direction?: "right" | "down";
  delay?: number;
  color?: "accent" | "secondary";
}) => {
  const isHorizontal = direction === "right";
  const gradientClass = color === "accent" 
    ? "from-accent to-glow-secondary" 
    : "from-glow-secondary to-muted-foreground";

  return (
    <div className={`relative flex items-center justify-center ${isHorizontal ? "w-20 md:w-24 lg:w-28" : "h-12"}`}>
      {/* Arrow line */}
      <motion.div
        initial={{ scaleX: 0, scaleY: 0 }}
        animate={{ 
          scaleX: isActive && isHorizontal ? 1 : (isHorizontal ? 0 : 1),
          scaleY: isActive && !isHorizontal ? 1 : (isHorizontal ? 1 : 0),
        }}
        transition={{ duration: 0.4, delay }}
        className={`${isHorizontal ? "w-full h-0.5" : "w-0.5 h-full"} bg-gradient-to-${isHorizontal ? "r" : "b"} ${gradientClass} ${isHorizontal ? "origin-left" : "origin-top"}`}
      />
      
      {/* Arrow head */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0 }}
        transition={{ duration: 0.2, delay: delay + 0.3 }}
        className={`absolute ${isHorizontal ? "right-0" : "bottom-0"}`}
      >
        <div className={`w-0 h-0 ${isHorizontal 
          ? "border-l-[8px] border-l-accent border-y-[5px] border-y-transparent" 
          : "border-t-[8px] border-t-accent border-x-[5px] border-x-transparent"
        }`} />
      </motion.div>

      {/* Flowing particles */}
      {isActive && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full bg-accent shadow-lg shadow-accent/50`}
              initial={{ 
                [isHorizontal ? "left" : "top"]: 0, 
                opacity: 0,
                scale: 0.5 
              }}
              animate={{ 
                [isHorizontal ? "left" : "top"]: "100%", 
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 1, 0.5]
              }}
              transition={{ 
                duration: 0.8, 
                delay: delay + i * 0.15, 
                repeat: Infinity, 
                repeatDelay: 1.5 
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

// Return Arrow Component (for response flow)
const ReturnArrow = ({ isActive }: { isActive: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center gap-2 py-4"
    >
      {/* Return flow indicator */}
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-green-500"
            initial={{ opacity: 0, scale: 0 }}
            animate={isActive ? { 
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            } : {}}
            transition={{ 
              duration: 0.6, 
              delay: i * 0.1, 
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          />
        ))}
      </div>
      <motion.span
        initial={{ opacity: 0, x: 20 }}
        animate={isActive ? { opacity: 1, x: 0 } : {}}
        className="text-green-500 font-medium text-sm"
      >
        Response: 200 OK
      </motion.span>
      <span className="text-xs text-muted-foreground hidden sm:inline">• 45ms • 1,247 tokens</span>
    </motion.div>
  );
};

export const ApiFlowDiagram = () => {
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 5);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationStep(0);
    
    const steps = [0, 1, 2, 3, 4];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setAnimationStep(step);
        if (step === 4) {
          setTimeout(() => setIsAnimating(false), 1500);
        }
      }, index * 1000);
    });
  };

  return (
    <div className="relative glass rounded-2xl p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="relative z-10">
        {/* Click to animate */}
        <motion.button
          onClick={startAnimation}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1 z-20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-3 h-3" />
          <span className="hidden sm:inline">Replay</span>
        </motion.button>

        {/* Flow Container - Desktop Horizontal / Mobile Vertical */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0">
          
          {/* Developer Request */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-auto lg:flex-shrink-0"
          >
            <motion.div 
              className={`bg-muted/50 rounded-xl p-3 sm:p-4 border transition-all duration-300 ${
                animationStep >= 0 ? "border-accent/50 shadow-lg shadow-accent/10" : "border-border/50"
              }`}
              animate={animationStep === 0 ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
              </div>
              <pre className="font-mono text-[10px] sm:text-xs text-muted-foreground overflow-x-auto">
                <code>
                  <motion.span 
                    className={animationStep >= 0 ? "text-accent" : "text-accent/50"}
                    animate={animationStep === 0 ? { opacity: [1, 0.5, 1] } : {}}
                  >
                    POST
                  </motion.span>{" "}
                  <span className="hidden sm:inline">api.originxcloud.com</span>
                  <span className="sm:hidden">api.origin...</span>
                  /v1{"\n"}
                  <span className="text-muted-foreground/60 text-[9px] sm:text-xs">Bearer ox_live_...</span>
                </code>
              </pre>
              
              {/* Request indicator */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={animationStep >= 0 ? { opacity: 1, height: "auto" } : {}}
                className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border/50"
              >
                <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                  <motion.div
                    animate={animationStep === 0 ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: animationStep === 0 ? Infinity : 0 }}
                    className={`w-2 h-2 rounded-full ${animationStep >= 1 ? "bg-green-500" : "bg-accent animate-pulse"}`}
                  />
                  <span className="text-muted-foreground">
                    {animationStep === 0 ? "Sending..." : "Sent ✓"}
                  </span>
                </div>
              </motion.div>
            </motion.div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3 text-center">Your Request</p>
          </motion.div>

          {/* Arrow 1 - Desktop */}
          <div className="hidden lg:block">
            <AnimatedArrow isActive={animationStep >= 1} direction="right" delay={0} color="accent" />
          </div>

          {/* Arrow 1 - Mobile */}
          <div className="lg:hidden">
            <AnimatedArrow isActive={animationStep >= 1} direction="down" delay={0} color="accent" />
          </div>

          {/* OriginX Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex-shrink-0"
          >
            <motion.div 
              className="relative"
              animate={animationStep === 2 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="absolute -inset-3 sm:-inset-4 rounded-2xl blur-xl"
                animate={{
                  background: animationStep >= 2 
                    ? "linear-gradient(135deg, hsl(var(--accent) / 0.4), hsl(var(--glow-secondary) / 0.4))"
                    : "linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--glow-secondary) / 0.2))",
                }}
                transition={{ duration: 0.3 }}
              />
              <div className={`relative bg-card border rounded-xl p-4 sm:p-6 transition-all duration-300 ${
                animationStep >= 2 ? "border-accent/50" : "border-accent/30"
              }`}>
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <motion.div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-accent to-glow-secondary flex items-center justify-center"
                    animate={animationStep === 2 ? { 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="text-accent-foreground font-bold text-base sm:text-lg">O</span>
                  </motion.div>
                  <div className="text-center">
                    <h3 className="font-semibold text-xs sm:text-sm">OriginX</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Unified API Layer</p>
                  </div>
                  
                  {/* Processing indicators */}
                  <div className="flex gap-2 sm:gap-3">
                    {[
                      { icon: Shield, label: "Auth", delay: 0 },
                      { icon: Zap, label: "Meter", delay: 0.1 },
                      { icon: Route, label: "Route", delay: 0.2 },
                    ].map((item) => (
                      <motion.div
                        key={item.label}
                        className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground"
                        animate={animationStep === 2 ? {
                          color: ["hsl(var(--muted-foreground))", "hsl(var(--accent))", "hsl(var(--muted-foreground))"],
                        } : {}}
                        transition={{ duration: 0.5, delay: item.delay }}
                      >
                        <motion.div
                          animate={animationStep === 2 ? { scale: [1, 1.3, 1] } : {}}
                          transition={{ duration: 0.3, delay: item.delay + 0.2 }}
                        >
                          <item.icon className={`w-3 h-3 ${animationStep >= 2 ? "text-accent" : ""}`} />
                        </motion.div>
                        <span className="hidden sm:inline">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Processing status */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={animationStep >= 2 ? { opacity: 1, height: "auto" } : {}}
                    className="text-[10px] sm:text-xs text-center"
                  >
                    <motion.span
                      animate={animationStep === 2 ? { opacity: [1, 0.5, 1] } : {}}
                      transition={{ duration: 0.5, repeat: animationStep === 2 ? Infinity : 0 }}
                      className="text-accent"
                    >
                      {animationStep === 2 ? "Processing..." : animationStep > 2 ? "✓ Routed" : ""}
                    </motion.span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Arrow 2 - Desktop */}
          <div className="hidden lg:block">
            <AnimatedArrow isActive={animationStep >= 3} direction="right" delay={0.1} color="secondary" />
          </div>

          {/* Arrow 2 - Mobile */}
          <div className="lg:hidden">
            <AnimatedArrow isActive={animationStep >= 3} direction="down" delay={0.1} color="secondary" />
          </div>

          {/* Providers Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-full lg:w-auto lg:flex-shrink-0"
          >
            <div className="grid grid-cols-2 gap-2">
              {providers.map((provider, i) => (
                <motion.div
                  key={provider.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.9 + i * 0.1 }}
                  animate={animationStep >= 3 && i === 0 ? {
                    borderColor: "hsl(var(--accent))",
                    boxShadow: "0 0 20px hsl(var(--accent) / 0.3)",
                  } : {}}
                  className={`bg-muted/30 rounded-lg p-2 sm:p-3 border transition-all duration-300 ${
                    animationStep >= 3 && i === 0 ? "border-accent/50" : "border-border/50"
                  } flex items-center gap-2`}
                >
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-br ${provider.color} flex items-center justify-center`}>
                    <Server className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium">{provider.name}</span>
                  {animationStep >= 4 && i === 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3 text-center">
              {animationStep >= 4 ? "✓ Best Provider" : "Best Provider Selected"}
            </p>
          </motion.div>
        </div>

        {/* Response Flow */}
        <ReturnArrow isActive={animationStep >= 4} />

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/50"
        >
          {[
            { value: "50+", label: "Providers" },
            { value: "<50ms", label: "Latency" },
            { value: "99.99%", label: "Uptime" },
            { value: "1B+", label: "Requests" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg sm:text-2xl font-bold text-gradient">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
