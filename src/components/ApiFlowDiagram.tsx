import { motion, useReducedMotion, useInView, AnimatePresence } from "framer-motion";
import { Zap, Shield, Route, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState, memo, useCallback, useRef } from "react";
import { OriginXLogoFilled } from "./OriginXLogo";

type FlowStep = 0 | 1 | 2 | 3 | 4 | 5;

const STEP_MS = 1500;
const LOOP_STEPS: FlowStep[] = [0, 1, 2, 3, 4, 5];

// Dashed Arrow with animation
const DashedArrow = memo(({
  isActive,
  direction = "right",
  label,
  color = "accent",
  delay = 0,
}: {
  isActive: boolean;
  direction?: "right" | "left";
  label?: string;
  color?: "accent" | "green";
  delay?: number;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isReverse = direction === "left";
  
  const colorClasses = color === "green" 
    ? { line: "border-green-400", dot: "bg-green-400", text: "text-green-400" }
    : { line: "border-accent", dot: "bg-accent", text: "text-accent" };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center flex-shrink-0 px-1 sm:px-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay + 0.3 }}
    >
      {label && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.4 }}
          className={`text-[8px] sm:text-[9px] md:text-[10px] font-semibold mb-1 uppercase tracking-wider ${colorClasses.text}`}
        >
          {label}
        </motion.span>
      )}
      
      <div className="relative w-10 sm:w-14 md:w-20 lg:w-28 h-6 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0.2, scaleX: 0 }}
          animate={{ opacity: isActive ? 0.8 : 0.3, scaleX: 1 }}
          transition={{ duration: 0.4 }}
          className={`absolute w-full border-t-2 border-dashed ${colorClasses.line} ${isReverse ? "origin-right" : "origin-left"}`}
        />

        {!prefersReducedMotion && isActive && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${colorClasses.dot} shadow-lg`}
                initial={{ [isReverse ? "right" : "left"]: "-15%", opacity: 0 }}
                animate={{ [isReverse ? "right" : "left"]: "115%", opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 0.2,
                  ease: "linear",
                }}
              />
            ))}
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          className={`absolute ${isReverse ? "left-0" : "right-0"} ${colorClasses.text}`}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" className={`sm:w-3 sm:h-3 ${isReverse ? "rotate-180" : ""}`}>
            <path d="M2 6L8 1V4H12V8H8V11L2 6Z" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
});

DashedArrow.displayName = "DashedArrow";

// Single Provider Card - Shown one at a time
const SingleProviderCard = memo(({
  name,
  isActive,
  isSendingResponse,
  onNext,
  onPrev,
  currentIndex,
  totalCount,
}: {
  name: string;
  isActive: boolean;
  isSendingResponse: boolean;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalCount: number;
}) => {
  const prefersReducedMotion = useReducedMotion();

  const cardColors = [
    { bg: "from-blue-500/30 to-blue-600/20", solid: "bg-blue-500", border: "border-blue-400/50" },
    { bg: "from-purple-500/30 to-purple-600/20", solid: "bg-purple-500", border: "border-purple-400/50" },
    { bg: "from-emerald-500/30 to-emerald-600/20", solid: "bg-emerald-500", border: "border-emerald-400/50" },
    { bg: "from-orange-500/30 to-orange-600/20", solid: "bg-orange-500", border: "border-orange-400/50" },
    { bg: "from-pink-500/30 to-pink-600/20", solid: "bg-pink-500", border: "border-pink-400/50" },
    { bg: "from-cyan-500/30 to-cyan-600/20", solid: "bg-cyan-500", border: "border-cyan-400/50" },
  ];
  const cardColor = cardColors[currentIndex % cardColors.length];

  return (
    <div className="relative w-full">
      {/* Card Stack Visual (behind main card) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[2, 1].map((offset) => (
          <motion.div
            key={offset}
            className="absolute w-full bg-card/60 rounded-xl border border-border/30"
            style={{
              height: "calc(100% - 8px)",
              top: offset * 4,
              transform: `scale(${1 - offset * 0.03})`,
              zIndex: -offset,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5 - offset * 0.15, y: 0 }}
          />
        ))}
      </div>

      {/* Main Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={name}
          initial={{ opacity: 0, x: 30, rotateY: -15 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: -30, rotateY: 15 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: prefersReducedMotion ? 0.1 : 0.4 
          }}
          className={`relative rounded-xl border-2 p-3 sm:p-4 cursor-pointer transition-shadow duration-300 ${
            isActive
              ? `bg-gradient-to-br ${cardColor.bg} ${cardColor.border} shadow-xl shadow-accent/20`
              : "bg-card border-border/50"
          } ${isSendingResponse ? "ring-2 ring-green-400/70 ring-offset-2 ring-offset-background" : ""}`}
          style={{ perspective: "1000px" }}
          onClick={onNext}
        >
          <div className="flex items-center gap-3">
            {/* Provider Icon */}
            <motion.div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isActive ? `${cardColor.solid} text-white shadow-lg` : `bg-gradient-to-br ${cardColor.bg} border ${cardColor.border}`
              }`}
              animate={isActive && !prefersReducedMotion ? { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.6, repeat: isActive ? Infinity : 0 }}
            >
              <span className={`text-sm sm:text-base font-bold ${isActive ? "text-white" : "text-foreground"}`}>
                {name.slice(0, 2).toUpperCase()}
              </span>
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-bold truncate">{name}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {isActive ? (isSendingResponse ? "Sending response..." : "✓ Best match selected") : "Evaluating provider..."}
              </p>
            </div>

            {isActive && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <CheckCircle2 className={`w-6 h-6 sm:w-7 sm:h-7 ${isSendingResponse ? "text-green-400" : "text-accent"}`} />
              </motion.div>
            )}
          </div>

          {/* Stats Row */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-border/50 grid grid-cols-3 gap-2 text-center"
            >
              <div>
                <p className="text-sm sm:text-base font-bold text-foreground">24ms</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground">Latency</p>
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-green-400">99.99%</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground">Uptime</p>
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-foreground">US-East</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground">Region</p>
              </div>
            </motion.div>
          )}

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {Array.from({ length: totalCount }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-200 ${
                  i === currentIndex ? "bg-accent" : "bg-muted-foreground/30"
                }`}
                animate={i === currentIndex ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-2 font-medium">
        {isActive ? "Best Provider Selected" : "Evaluating Providers..."}
      </p>
    </div>
  );
});

SingleProviderCard.displayName = "SingleProviderCard";

// OriginX Core - Larger and more prominent
const OriginXCore = memo(({ step, delay = 0 }: { step: FlowStep; delay?: number }) => {
  const prefersReducedMotion = useReducedMotion();
  const isProcessing = step >= 2 && step < 4;
  const isResponding = step >= 4;

  return (
    <motion.div 
      className="flex flex-col items-center flex-shrink-0"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
    >
      <div className="relative">
        {/* Glow */}
        <motion.div
          className="absolute -inset-4 sm:-inset-6 rounded-2xl blur-xl"
          animate={{
            background: isProcessing
              ? "linear-gradient(135deg, hsl(var(--accent) / 0.5), hsl(var(--glow-secondary) / 0.4))"
              : isResponding
              ? "linear-gradient(135deg, hsl(142 76% 36% / 0.4), hsl(var(--accent) / 0.25))"
              : "linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--glow-secondary) / 0.15))",
          }}
          transition={{ duration: 0.4 }}
        />

        <div className={`relative bg-card border-2 rounded-2xl p-4 sm:p-5 md:p-6 transition-all duration-300 ${
          isProcessing ? "border-accent/70 shadow-2xl shadow-accent/30" 
          : isResponding ? "border-green-400/60 shadow-2xl shadow-green-400/25"
          : "border-border/50 shadow-lg"
        }`}>
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            {/* Animated Logo */}
            <motion.div
              className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                isResponding 
                  ? "bg-gradient-to-br from-green-400/40 to-green-500/25 border-2 border-green-400/50" 
                  : "bg-gradient-to-br from-accent/40 to-purple-500/25 border-2 border-accent/50"
              }`}
              animate={
                prefersReducedMotion ? {} 
                : isProcessing ? { rotate: [0, 8, -8, 0], scale: [1, 1.08, 1.08, 1] }
                : isResponding ? { scale: [1, 1.05, 1] } : {}
              }
              transition={{ duration: isProcessing ? 0.6 : 1, repeat: isProcessing || isResponding ? Infinity : 0 }}
            >
              <OriginXLogoFilled 
                size="lg" 
                className={`transition-colors duration-300 ${isResponding ? "text-green-400" : "text-foreground"}`} 
              />
            </motion.div>

            {/* Title */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <OriginXLogoFilled size="sm" className="text-foreground" />
                <h3 className="font-bold text-base sm:text-lg md:text-xl">OriginX</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Unified API Layer</p>
            </div>

            {/* Feature Icons */}
            <div className="flex gap-4 sm:gap-5">
              {[
                { icon: Shield, label: "Auth", active: step >= 2 },
                { icon: Zap, label: "Speed", active: step >= 2 },
                { icon: Route, label: "Route", active: step >= 3 },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
                    item.active ? "text-accent" : "text-muted-foreground/50"
                  }`}
                  animate={prefersReducedMotion || step !== 2 ? {} : { scale: [1, 1.25, 1] }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[9px] sm:text-[10px] font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 2 ? 1 : 0 }}
              className="text-xs sm:text-sm font-semibold"
            >
              {step === 2 && <span className="text-accent">Processing request...</span>}
              {step === 3 && <span className="text-accent">Finding best provider...</span>}
              {step >= 4 && <span className="text-green-400">✓ Request complete</span>}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

OriginXCore.displayName = "OriginXCore";

// Request Box - Larger
const RequestBox = memo(({ step, delay = 0 }: { step: FlowStep; delay?: number }) => {
  const isSending = step >= 1;
  const isComplete = step >= 5;

  return (
    <motion.div 
      className="flex flex-col items-center flex-shrink-0"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
    >
      <motion.div
        className={`w-full min-w-[140px] sm:min-w-[160px] md:min-w-[180px] bg-muted/70 rounded-xl p-3 sm:p-4 border-2 transition-all duration-300 ${
          isSending && !isComplete ? "border-accent/60 shadow-xl shadow-accent/20"
          : isComplete ? "border-green-400/60 shadow-xl shadow-green-400/20"
          : "border-border/50 shadow-lg"
        }`}
      >
        {/* Terminal Header */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400" />
          <span className="ml-2 text-[9px] sm:text-[10px] text-muted-foreground">terminal</span>
        </div>

        {/* Code */}
        <pre className="font-mono text-[10px] sm:text-xs text-muted-foreground">
          <code>
            <motion.span
              className={isSending ? "text-accent font-bold" : "text-accent/60"}
              animate={step === 1 ? { opacity: [1, 0.4, 1] } : {}}
              transition={{ duration: 0.5, repeat: step === 1 ? Infinity : 0 }}
            >
              POST
            </motion.span>{" "}
            <span className="text-foreground">/v1/chat/completions</span>
            {"\n"}
            <span className="text-muted-foreground/70">Authorization: Bearer ox_live_...</span>
            {"\n"}
            <span className="text-muted-foreground/70">Content-Type: application/json</span>
          </code>
        </pre>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={isSending ? { opacity: 1, height: "auto" } : {}}
          className="mt-3 pt-3 border-t border-border/50"
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <motion.div
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                isComplete ? "bg-green-400" : step >= 1 ? "bg-accent" : "bg-muted-foreground"
              }`}
              animate={step >= 1 && !isComplete ? { scale: [1, 1.5, 1], opacity: [1, 0.6, 1] } : {}}
              transition={{ duration: 0.6, repeat: step >= 1 && !isComplete ? Infinity : 0 }}
            />
            <span className={isComplete ? "text-green-400 font-medium" : "text-muted-foreground"}>
              {isComplete ? "Response received" : step >= 1 ? "Sending request..." : "Ready to send"}
            </span>
          </div>
        </motion.div>

        {/* Response */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 pt-3 border-t border-green-400/40"
          >
            <pre className="font-mono text-[10px] sm:text-xs text-green-400 font-medium">
              <code>{"{"} "status": 200, "latency": "45ms" {"}"}</code>
            </pre>
          </motion.div>
        )}
      </motion.div>
      
      <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-2">Your Application</p>
    </motion.div>
  );
});

RequestBox.displayName = "RequestBox";

// Main Component
export const ApiFlowDiagram = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const [step, setStep] = useState<FlowStep>(0);
  const [selectedProvider, setSelectedProvider] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const providerCards = useMemo(() => ["OpenAI", "Anthropic", "Google Cloud", "AWS", "Stripe", "Twilio"], []);

  // Auto-play animation
  useEffect(() => {
    if (prefersReducedMotion || !isAutoPlaying || !isInView) return;
    const interval = window.setInterval(() => {
      setStep((prev) => LOOP_STEPS[(LOOP_STEPS.indexOf(prev) + 1) % LOOP_STEPS.length]);
    }, STEP_MS);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, isAutoPlaying, isInView]);

  // Cycle provider on loop
  useEffect(() => {
    if (prefersReducedMotion || !isAutoPlaying) return;
    if (step === 0) setSelectedProvider((p) => (p + 1) % providerCards.length);
  }, [prefersReducedMotion, providerCards.length, step, isAutoPlaying]);

  const handleNextProvider = useCallback(() => {
    setIsAutoPlaying(false);
    setSelectedProvider((p) => (p + 1) % providerCards.length);
    setStep(4);
    setTimeout(() => {
      setIsAutoPlaying(true);
      setStep(0);
    }, 3000);
  }, [providerCards.length]);

  const handlePrevProvider = useCallback(() => {
    setIsAutoPlaying(false);
    setSelectedProvider((p) => (p - 1 + providerCards.length) % providerCards.length);
    setStep(4);
    setTimeout(() => {
      setIsAutoPlaying(true);
      setStep(0);
    }, 3000);
  }, [providerCards.length]);

  const isSelecting = step >= 3;
  const isResponding = step >= 4;

  return (
    <div ref={containerRef} className="relative glass rounded-2xl p-4 sm:p-6 md:p-8 overflow-hidden w-full">
      <div className="absolute inset-0 bg-grid opacity-5" />

      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-sm sm:text-base font-semibold text-muted-foreground uppercase tracking-wider">
            How It Works
          </h3>
        </motion.div>

        {/* Main Flow */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-4">
          {/* Request Box */}
          <div className="w-full max-w-[220px] sm:max-w-[250px]">
            <RequestBox step={step} delay={isInView ? 0.2 : 0} />
          </div>

          {/* Arrow 1 */}
          <DashedArrow 
            isActive={step >= 1 && step <= 3} 
            direction="right" 
            label="Request"
            color="accent"
            delay={0.3}
          />

          {/* OriginX Core */}
          <OriginXCore step={step} delay={isInView ? 0.4 : 0} />

          {/* Arrow 2 */}
          <DashedArrow 
            isActive={step >= 3 && step <= 4} 
            direction="right" 
            label="Route"
            color="accent"
            delay={0.5}
          />

          {/* Provider Card - Single view with animation */}
          <motion.div 
            className="w-full max-w-[220px] sm:max-w-[260px]"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 100 }}
          >
            <SingleProviderCard
              name={providerCards[selectedProvider]}
              isActive={isSelecting}
              isSendingResponse={isResponding}
              onNext={handleNextProvider}
              onPrev={handlePrevProvider}
              currentIndex={selectedProvider}
              totalCount={providerCards.length}
            />
          </motion.div>
        </div>

        {/* Response Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isResponding ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="mt-6 sm:mt-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <DashedArrow isActive={step >= 4} direction="left" label="Response" color="green" delay={0} />
          </div>

          <div className="flex items-center justify-center">
            <motion.div 
              className="flex items-center gap-4 sm:gap-6 bg-muted/60 rounded-xl px-4 sm:px-6 py-3 border border-green-400/40"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <div className="text-center">
                <p className="text-lg sm:text-xl font-bold text-green-400">200</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Status</p>
              </div>
              <div className="h-8 w-px bg-border/60" />
              <div className="text-center">
                <p className="text-lg sm:text-xl font-bold text-foreground">45ms</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Latency</p>
              </div>
              <div className="h-8 w-px bg-border/60" />
              <div className="text-center">
                <p className="text-lg sm:text-xl font-bold text-foreground">{providerCards[selectedProvider].split(" ")[0]}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Provider</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 pt-6 border-t border-border/50"
        >
          {[
            { value: "50+", label: "Providers" },
            { value: "<50ms", label: "Avg Latency" },
            { value: "99.99%", label: "Uptime" },
            { value: "1B+", label: "API Calls" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label} 
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
            >
              <p className="text-xl sm:text-2xl font-bold text-gradient">{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
});

ApiFlowDiagram.displayName = "ApiFlowDiagram";
