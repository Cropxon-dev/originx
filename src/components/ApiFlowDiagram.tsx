import { motion } from "framer-motion";
import { Zap, Shield, Route, Server, ArrowRight, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

const providers = [
  { name: "OpenAI", color: "from-emerald-500 to-emerald-600" },
  { name: "Stripe", color: "from-violet-500 to-violet-600" },
  { name: "Twilio", color: "from-red-500 to-red-600" },
  { name: "AWS", color: "from-amber-500 to-amber-600" },
];

export const ApiFlowDiagram = () => {
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 5);
    }, 2000);
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
          setTimeout(() => setIsAnimating(false), 1000);
        }
      }, index * 800);
    });
  };

  return (
    <div className="relative glass rounded-2xl p-8 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      {/* Animated data particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent"
            initial={{ x: "10%", y: `${20 + i * 12}%`, opacity: 0 }}
            animate={animationStep >= 1 ? {
              x: ["10%", "45%", "90%"],
              opacity: [0, 1, 0],
            } : {}}
            transition={{
              duration: 2,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        {/* Click to animate */}
        <motion.button
          onClick={startAnimation}
          className="absolute top-4 right-4 text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-3 h-3" />
          Replay Animation
        </motion.button>

        {/* Flow Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4">
          {/* Developer Request */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0 w-full lg:w-auto"
          >
            <motion.div 
              className={`bg-muted/50 rounded-xl p-4 border transition-all duration-300 ${
                animationStep >= 0 ? "border-accent/50 shadow-lg shadow-accent/10" : "border-border/50"
              }`}
              animate={animationStep === 0 ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
                <code>
                  <motion.span 
                    className={animationStep >= 0 ? "text-accent" : "text-accent/50"}
                    animate={animationStep === 0 ? { opacity: [1, 0.5, 1] } : {}}
                  >
                    POST
                  </motion.span>{" "}api.originxcloud.com/v1{"\n"}
                  <span className="text-muted-foreground/60">Authorization: Bearer ox_live_...</span>
                </code>
              </pre>
              
              {/* Request indicator */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={animationStep >= 0 ? { opacity: 1, height: "auto" } : {}}
                className="mt-3 pt-3 border-t border-border/50"
              >
                <div className="flex items-center gap-2 text-xs">
                  <motion.div
                    animate={animationStep === 0 ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: animationStep === 0 ? Infinity : 0 }}
                    className={`w-2 h-2 rounded-full ${animationStep >= 1 ? "bg-green-500" : "bg-accent animate-pulse"}`}
                  />
                  <span className="text-muted-foreground">
                    {animationStep === 0 ? "Sending request..." : "Request sent"}
                  </span>
                </div>
              </motion.div>
            </motion.div>
            <p className="text-xs text-muted-foreground mt-3 text-center">Your Request</p>
          </motion.div>

          {/* Animated Arrow 1 */}
          <div className="hidden lg:flex items-center relative">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: animationStep >= 1 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-px bg-gradient-to-r from-accent to-glow-secondary origin-left"
            />
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: animationStep >= 1 ? 1 : 0, x: animationStep >= 1 ? 0 : -10 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="w-2 h-2 rotate-45 border-t-2 border-r-2 border-accent -ml-1"
            />
            
            {/* Animated packet */}
            <motion.div
              className="absolute left-0 w-3 h-3 rounded-full bg-accent"
              initial={{ x: 0, opacity: 0 }}
              animate={animationStep === 1 ? {
                x: [0, 60],
                opacity: [1, 1, 0],
              } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Mobile Arrow 1 */}
          <motion.div 
            className="lg:hidden flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: animationStep >= 1 ? 1 : 0 }}
          >
            <div className="w-px h-8 bg-gradient-to-b from-accent to-glow-secondary" />
            <ArrowRight className="w-4 h-4 text-accent rotate-90" />
          </motion.div>

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
                className="absolute -inset-4 rounded-2xl blur-xl"
                animate={{
                  background: animationStep >= 2 
                    ? "linear-gradient(135deg, hsl(var(--accent) / 0.4), hsl(var(--glow-secondary) / 0.4))"
                    : "linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--glow-secondary) / 0.2))",
                }}
                transition={{ duration: 0.3 }}
              />
              <div className={`relative bg-card border rounded-xl p-6 transition-all duration-300 ${
                animationStep >= 2 ? "border-accent/50" : "border-accent/30"
              }`}>
                <div className="flex flex-col items-center gap-4">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-glow-secondary flex items-center justify-center"
                    animate={animationStep === 2 ? { 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="text-accent-foreground font-bold text-lg">O</span>
                  </motion.div>
                  <div className="text-center">
                    <h3 className="font-semibold text-sm">OriginX</h3>
                    <p className="text-xs text-muted-foreground mt-1">Unified API Layer</p>
                  </div>
                  
                  {/* Processing indicators */}
                  <div className="flex gap-2">
                    {[
                      { icon: Shield, label: "Auth", delay: 0 },
                      { icon: Zap, label: "Meter", delay: 0.1 },
                      { icon: Route, label: "Route", delay: 0.2 },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        className="flex items-center gap-1 text-xs text-muted-foreground"
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
                        <span>{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Processing status */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={animationStep >= 2 ? { opacity: 1, height: "auto" } : {}}
                    className="text-xs text-center"
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

          {/* Animated Arrow 2 */}
          <div className="hidden lg:flex items-center relative">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: animationStep >= 3 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-px bg-gradient-to-r from-glow-secondary to-border origin-left"
            />
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: animationStep >= 3 ? 1 : 0, x: animationStep >= 3 ? 0 : -10 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="w-2 h-2 rotate-45 border-t-2 border-r-2 border-muted-foreground -ml-1"
            />
            
            {/* Animated packet */}
            <motion.div
              className="absolute left-0 w-3 h-3 rounded-full bg-glow-secondary"
              initial={{ x: 0, opacity: 0 }}
              animate={animationStep === 3 ? {
                x: [0, 60],
                opacity: [1, 1, 0],
              } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Mobile Arrow 2 */}
          <motion.div 
            className="lg:hidden flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: animationStep >= 3 ? 1 : 0 }}
          >
            <div className="w-px h-8 bg-gradient-to-b from-glow-secondary to-border" />
            <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
          </motion.div>

          {/* Providers Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex-shrink-0"
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
                  className={`bg-muted/30 rounded-lg p-3 border transition-all duration-300 ${
                    animationStep >= 3 && i === 0 ? "border-accent/50" : "border-border/50"
                  } flex items-center gap-2`}
                >
                  <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${provider.color} flex items-center justify-center`}>
                    <Server className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium">{provider.name}</span>
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
            <p className="text-xs text-muted-foreground mt-3 text-center">
              {animationStep >= 4 ? "✓ Best Provider Selected" : "Best Provider Selected"}
            </p>
          </motion.div>
        </div>

        {/* Response Flow (reverse) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: animationStep >= 4 ? 1 : 0 }}
          className="mt-6 pt-6 border-t border-border/30"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <motion.div
              animate={animationStep >= 4 ? {
                x: [0, -20, -40, -60],
                opacity: [0, 1, 1, 0],
              } : {}}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span className="text-green-500 font-medium">Response: 200 OK</span>
            <span>• Latency: 45ms</span>
            <span>• Tokens: 1,247</span>
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-border/50"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-gradient">50+</p>
            <p className="text-xs text-muted-foreground">API Providers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gradient">&lt;50ms</p>
            <p className="text-xs text-muted-foreground">Avg Latency</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gradient">99.99%</p>
            <p className="text-xs text-muted-foreground">Uptime SLA</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gradient">1B+</p>
            <p className="text-xs text-muted-foreground">Requests/Month</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};