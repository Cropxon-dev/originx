import { motion, useReducedMotion, useInView, AnimatePresence } from "framer-motion";
import { Zap, Shield, Route, CheckCircle2, Send, ArrowLeftRight } from "lucide-react";
import { useEffect, useMemo, useState, memo, useCallback, useRef } from "react";
import { OriginXLogoFilled } from "./OriginXLogo";

type FlowStep = 0 | 1 | 2 | 3 | 4 | 5;

const STEP_MS = 1600;
const LOOP_STEPS: FlowStep[] = [0, 1, 2, 3, 4, 5];

// Bidirectional Arrow with animated flow
const BidirectionalArrow = memo(({
  requestActive,
  responseActive,
  compact = false,
}: {
  requestActive: boolean;
  responseActive: boolean;
  compact?: boolean;
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`flex flex-col items-center justify-center flex-shrink-0 ${compact ? "w-10 sm:w-14 md:w-20" : "w-12 sm:w-16 md:w-24 lg:w-32"}`}>
      {/* Labels */}
      <div className="flex justify-between w-full text-[6px] sm:text-[7px] md:text-[8px] font-semibold uppercase tracking-wide mb-1">
        <span className={`transition-opacity ${requestActive ? "text-accent opacity-100" : "opacity-30 text-muted-foreground"}`}>
          Req
        </span>
        <span className={`transition-opacity ${responseActive ? "text-green-400 opacity-100" : "opacity-30 text-muted-foreground"}`}>
          Res
        </span>
      </div>

      {/* Arrow container */}
      <div className="relative w-full h-8 sm:h-10">
        {/* Request line (top) */}
        <div className="absolute top-1 left-0 right-0 h-[2px] flex items-center">
          <motion.div
            animate={{ opacity: requestActive ? 0.8 : 0.2, scaleX: requestActive ? 1 : 0.5 }}
            className="w-full h-full bg-gradient-to-r from-accent to-purple-400 rounded-full origin-left"
          />
          {/* Request dots */}
          {!prefersReducedMotion && requestActive && [0, 1, 2].map((i) => (
            <motion.div
              key={`req-${i}`}
              className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent shadow-lg shadow-accent/50"
              initial={{ left: "-8%", opacity: 0 }}
              animate={{ left: "108%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.9, delay: i * 0.2, repeat: Infinity, ease: "linear" }}
            />
          ))}
          {/* Arrow head */}
          <motion.div 
            className="absolute right-0"
            animate={{ opacity: requestActive ? 1 : 0.3 }}
          >
            <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" className="text-accent">
              <path d="M2 6L8 1V4H12V8H8V11L2 6Z" />
            </svg>
          </motion.div>
        </div>

        {/* Response line (bottom) */}
        <div className="absolute bottom-1 left-0 right-0 h-[2px] flex items-center">
          <motion.div
            animate={{ opacity: responseActive ? 0.8 : 0.2, scaleX: responseActive ? 1 : 0.5 }}
            className="w-full h-full bg-gradient-to-l from-green-400 to-emerald-500 rounded-full origin-right"
          />
          {/* Response dots */}
          {!prefersReducedMotion && responseActive && [0, 1, 2].map((i) => (
            <motion.div
              key={`res-${i}`}
              className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-400 shadow-lg shadow-green-400/50"
              initial={{ right: "-8%", opacity: 0 }}
              animate={{ right: "108%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.9, delay: i * 0.2, repeat: Infinity, ease: "linear" }}
            />
          ))}
          {/* Arrow head (left pointing) */}
          <motion.div 
            className="absolute left-0"
            animate={{ opacity: responseActive ? 1 : 0.3 }}
          >
            <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" className="text-green-400 rotate-180">
              <path d="M2 6L8 1V4H12V8H8V11L2 6Z" />
            </svg>
          </motion.div>
        </div>

        {/* Center icon */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            rotate: requestActive || responseActive ? [0, 180] : 0,
            scale: requestActive || responseActive ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 1, repeat: requestActive || responseActive ? Infinity : 0 }}
        >
          <ArrowLeftRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground/50" />
        </motion.div>
      </div>
    </div>
  );
});

BidirectionalArrow.displayName = "BidirectionalArrow";

// Large Provider Card with Parallax Stack
const ProviderStackCard = memo(({
  name,
  isActive,
  isResponding,
  currentIndex,
  totalCount,
  onNext,
}: {
  name: string;
  isActive: boolean;
  isResponding: boolean;
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
}) => {
  const prefersReducedMotion = useReducedMotion();

  const cardColors = [
    { bg: "from-blue-500/30 to-blue-600/15", solid: "bg-blue-500", border: "border-blue-400/50" },
    { bg: "from-purple-500/30 to-purple-600/15", solid: "bg-purple-500", border: "border-purple-400/50" },
    { bg: "from-emerald-500/30 to-emerald-600/15", solid: "bg-emerald-500", border: "border-emerald-400/50" },
    { bg: "from-orange-500/30 to-orange-600/15", solid: "bg-orange-500", border: "border-orange-400/50" },
    { bg: "from-pink-500/30 to-pink-600/15", solid: "bg-pink-500", border: "border-pink-400/50" },
    { bg: "from-cyan-500/30 to-cyan-600/15", solid: "bg-cyan-500", border: "border-cyan-400/50" },
  ];
  const color = cardColors[currentIndex % cardColors.length];

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Parallax Stack - 3 cards behind with parallax effect */}
      <div className="relative flex-1" style={{ perspective: "1000px" }}>
        {[3, 2, 1].map((offset) => (
          <motion.div
            key={offset}
            className="absolute inset-0 bg-card/60 rounded-xl border border-border/30"
            style={{ transformStyle: "preserve-3d" }}
            initial={{ y: offset * 6, scale: 1 - offset * 0.03, rotateX: offset * 2 }}
            animate={{ 
              y: offset * 6, 
              scale: 1 - offset * 0.03,
              rotateX: isActive ? offset * 3 : offset * 2,
              opacity: 0.6 - offset * 0.15
            }}
            transition={{ duration: 0.4 }}
          />
        ))}

        {/* Main Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={name}
            initial={{ opacity: 0, x: 40, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -40, rotateY: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`relative rounded-xl border-2 p-3 sm:p-4 cursor-pointer h-full transition-all ${
              isActive
                ? `bg-gradient-to-br ${color.bg} ${color.border} shadow-xl shadow-accent/20`
                : "bg-card border-border/50 shadow-lg"
            } ${isResponding ? "ring-2 ring-green-400/70 ring-offset-2 ring-offset-background" : ""}`}
            style={{ transformStyle: "preserve-3d" }}
            onClick={onNext}
          >
            <div className="flex items-start gap-3">
              {/* Large Provider Icon */}
              <motion.div
                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isActive ? `${color.solid} text-white shadow-lg` : `bg-gradient-to-br ${color.bg} border ${color.border}`
                }`}
                animate={isActive && !prefersReducedMotion ? { 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                } : {}}
                transition={{ duration: 0.6, repeat: isActive ? Infinity : 0 }}
              >
                <span className={`text-lg sm:text-xl font-bold ${isActive ? "text-white" : "text-foreground"}`}>
                  {name.slice(0, 2).toUpperCase()}
                </span>
              </motion.div>
              
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-sm sm:text-base md:text-lg font-bold truncate">{name}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  {isActive ? (isResponding ? "✓ Sending response..." : "✓ Best match selected") : "Evaluating provider..."}
                </p>
              </div>

              {isActive && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <CheckCircle2 className={`w-6 h-6 sm:w-7 sm:h-7 ${isResponding ? "text-green-400" : "text-accent"}`} />
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
                  <p className="text-[8px] sm:text-[9px] text-muted-foreground">Latency</p>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-green-400">99.99%</p>
                  <p className="text-[8px] sm:text-[9px] text-muted-foreground">Uptime</p>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-foreground">US-E</p>
                  <p className="text-[8px] sm:text-[9px] text-muted-foreground">Region</p>
                </div>
              </motion.div>
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-1.5 mt-3">
              {Array.from({ length: totalCount }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                    i === currentIndex ? "bg-accent" : "bg-muted-foreground/30"
                  }`}
                  animate={i === currentIndex ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <p className="text-[9px] sm:text-[10px] text-muted-foreground text-center mt-2 font-medium">
        {isActive ? "Best Provider" : "Evaluating Providers"}
      </p>
    </div>
  );
});

ProviderStackCard.displayName = "ProviderStackCard";

// Large OriginX Core
const OriginXCore = memo(({ step }: { step: FlowStep }) => {
  const prefersReducedMotion = useReducedMotion();
  const isProcessing = step >= 2 && step < 4;
  const isResponding = step >= 4;

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="relative">
        {/* Glow */}
        <motion.div
          className="absolute -inset-3 sm:-inset-4 md:-inset-5 rounded-2xl blur-xl"
          animate={{
            background: isProcessing
              ? "linear-gradient(135deg, hsl(var(--accent) / 0.45), hsl(var(--glow-secondary) / 0.35))"
              : isResponding
              ? "linear-gradient(135deg, hsl(142 76% 36% / 0.4), hsl(var(--accent) / 0.25))"
              : "linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--glow-secondary) / 0.15))",
          }}
        />

        <div className={`relative bg-card border-2 rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300 ${
          isProcessing ? "border-accent/70 shadow-2xl shadow-accent/25" 
          : isResponding ? "border-green-400/60 shadow-2xl shadow-green-400/20"
          : "border-border/50 shadow-lg"
        }`}>
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            {/* Animated Logo */}
            <motion.div
              className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-colors ${
                isResponding 
                  ? "bg-gradient-to-br from-green-400/40 to-green-500/25 border-2 border-green-400/50" 
                  : "bg-gradient-to-br from-accent/40 to-purple-500/25 border-2 border-accent/50"
              }`}
              animate={
                prefersReducedMotion ? {} 
                : isProcessing ? { rotate: [0, 8, -8, 0], scale: [1, 1.08, 1.08, 1] }
                : isResponding ? { scale: [1, 1.05, 1] } : {}
              }
              transition={{ duration: isProcessing ? 0.5 : 0.8, repeat: isProcessing || isResponding ? Infinity : 0 }}
            >
              <OriginXLogoFilled 
                size="lg" 
                className={`transition-colors ${isResponding ? "text-green-400" : "text-foreground"}`} 
              />
            </motion.div>

            {/* Title */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <OriginXLogoFilled size="sm" className="text-foreground" />
                <h3 className="font-bold text-sm sm:text-base md:text-lg">OriginX</h3>
              </div>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">Unified API Layer</p>
            </div>

            {/* Feature Icons */}
            <div className="flex gap-3 sm:gap-4">
              {[
                { icon: Shield, label: "Auth", active: step >= 2 },
                { icon: Zap, label: "Fast", active: step >= 2 },
                { icon: Route, label: "Route", active: step >= 3 },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  className={`flex flex-col items-center gap-0.5 transition-colors ${
                    item.active ? "text-accent" : "text-muted-foreground/40"
                  }`}
                  animate={prefersReducedMotion || step !== 2 ? {} : { scale: [1, 1.25, 1] }}
                  transition={{ duration: 0.25, delay: idx * 0.08 }}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[8px] sm:text-[9px] font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 2 ? 1 : 0 }}
              className="text-[10px] sm:text-xs font-semibold"
            >
              {step === 2 && <span className="text-accent">Processing...</span>}
              {step === 3 && <span className="text-accent">Routing...</span>}
              {step >= 4 && <span className="text-green-400">✓ Complete</span>}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
});

OriginXCore.displayName = "OriginXCore";

// Large Your App Card
const YourAppCard = memo(({ step }: { step: FlowStep }) => {
  const prefersReducedMotion = useReducedMotion();
  const isSending = step >= 1;
  const isComplete = step >= 5;

  return (
    <div className="flex flex-col h-full">
      <motion.div
        className={`flex-1 bg-muted/70 rounded-xl p-3 sm:p-4 border-2 transition-all ${
          isSending && !isComplete ? "border-accent/60 shadow-xl shadow-accent/20"
          : isComplete ? "border-green-400/60 shadow-xl shadow-green-400/20"
          : "border-border/50 shadow-lg"
        }`}
      >
        {/* Terminal Header */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400" />
          <span className="ml-2 text-[9px] sm:text-[10px] text-muted-foreground font-mono">terminal</span>
        </div>

        {/* Code Block */}
        <div className="bg-background/50 rounded-lg p-2 sm:p-3 border border-border/30">
          <pre className="font-mono text-[9px] sm:text-[10px] md:text-xs text-muted-foreground overflow-hidden">
            <code>
              <motion.span
                className={isSending ? "text-accent font-bold" : "text-accent/50"}
                animate={step === 1 && !prefersReducedMotion ? { opacity: [1, 0.4, 1] } : {}}
                transition={{ duration: 0.5, repeat: step === 1 ? Infinity : 0 }}
              >
                POST
              </motion.span>{" "}
              <span className="text-foreground">/v1/chat/completions</span>
              {"\n"}
              <span className="text-muted-foreground/70">Authorization: Bearer ox_...</span>
            </code>
          </pre>
        </div>

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
              animate={step >= 1 && !isComplete && !prefersReducedMotion ? { scale: [1, 1.5, 1] } : {}}
              transition={{ duration: 0.6, repeat: step >= 1 && !isComplete ? Infinity : 0 }}
            />
            <span className={isComplete ? "text-green-400 font-medium" : "text-muted-foreground"}>
              {isComplete ? "Response received!" : step >= 1 ? "Sending request..." : "Ready"}
            </span>
            {isSending && !isComplete && (
              <Send className="w-3 h-3 sm:w-4 sm:h-4 text-accent ml-auto animate-pulse" />
            )}
          </div>
        </motion.div>

        {/* Response */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 pt-3 border-t border-green-400/40"
          >
            <div className="bg-green-400/10 rounded-lg p-2 border border-green-400/30">
              <pre className="font-mono text-[9px] sm:text-[10px] text-green-400 font-medium">
                <code>{"{"} "status": 200, "latency": "45ms" {"}"}</code>
              </pre>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground text-center mt-2 font-medium">
        Your Application
      </p>
    </div>
  );
});

YourAppCard.displayName = "YourAppCard";

// Main Component
export const ApiFlowDiagram = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  
  const [step, setStep] = useState<FlowStep>(0);
  const [selectedProvider, setSelectedProvider] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const providers = useMemo(() => ["OpenAI", "Anthropic", "Google", "AWS", "Stripe", "Twilio"], []);

  useEffect(() => {
    if (prefersReducedMotion || !isAutoPlaying || !isInView) return;
    const interval = setInterval(() => {
      setStep((prev) => LOOP_STEPS[(LOOP_STEPS.indexOf(prev) + 1) % LOOP_STEPS.length]);
    }, STEP_MS);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, isAutoPlaying, isInView]);

  useEffect(() => {
    if (prefersReducedMotion || !isAutoPlaying) return;
    if (step === 0) setSelectedProvider((p) => (p + 1) % providers.length);
  }, [prefersReducedMotion, providers.length, step, isAutoPlaying]);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    setSelectedProvider((p) => (p + 1) % providers.length);
    setStep(4);
    setTimeout(() => { setIsAutoPlaying(true); setStep(0); }, 3000);
  }, [providers.length]);

  const isSelecting = step >= 3;
  const isResponding = step >= 4;

  return (
    <motion.div 
      ref={containerRef} 
      className="relative glass rounded-2xl p-4 sm:p-5 md:p-6 overflow-hidden w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-grid opacity-5" />

      <div className="relative z-10">
        {/* Title */}
        <motion.p
          className="text-center text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5 sm:mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          How It Works
        </motion.p>

        {/* Main Flow - 3 Column Layout */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-stretch gap-2 sm:gap-3 md:gap-4">
          {/* Your App Card */}
          <motion.div 
            className="min-h-[180px] sm:min-h-[200px] md:min-h-[220px]"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <YourAppCard step={step} />
          </motion.div>

          {/* Bidirectional Arrow 1 */}
          <motion.div
            className="self-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <BidirectionalArrow 
              requestActive={step >= 1 && step <= 3} 
              responseActive={step >= 4}
            />
          </motion.div>

          {/* OriginX Core */}
          <motion.div
            className="self-center"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          >
            <OriginXCore step={step} />
          </motion.div>

          {/* Bidirectional Arrow 2 */}
          <motion.div
            className="self-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            <BidirectionalArrow 
              requestActive={step >= 3 && step <= 4} 
              responseActive={step >= 4}
            />
          </motion.div>

          {/* Provider Stack Card */}
          <motion.div 
            className="min-h-[180px] sm:min-h-[200px] md:min-h-[220px]"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
          >
            <ProviderStackCard
              name={providers[selectedProvider]}
              isActive={isSelecting}
              isResponding={isResponding}
              currentIndex={selectedProvider}
              totalCount={providers.length}
              onNext={handleNext}
            />
          </motion.div>
        </div>

        {/* Response Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isResponding ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center mt-5 sm:mt-6"
        >
          <div className="flex items-center gap-4 sm:gap-6 bg-green-400/10 rounded-xl px-4 sm:px-6 py-2 sm:py-3 border border-green-400/40">
            <div className="text-center">
              <p className="text-base sm:text-lg font-bold text-green-400">200</p>
              <p className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wide">Status</p>
            </div>
            <div className="h-6 sm:h-8 w-px bg-green-400/30" />
            <div className="text-center">
              <p className="text-base sm:text-lg font-bold text-foreground">45ms</p>
              <p className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wide">Latency</p>
            </div>
            <div className="h-6 sm:h-8 w-px bg-green-400/30" />
            <div className="text-center">
              <p className="text-base sm:text-lg font-bold text-foreground">{providers[selectedProvider]}</p>
              <p className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wide">Provider</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 mt-6 pt-5 border-t border-border/50"
        >
          {[
            { value: "50+", label: "Providers" },
            { value: "<50ms", label: "Avg Latency" },
            { value: "99.99%", label: "Uptime" },
            { value: "1B+", label: "API Calls" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gradient">{stat.value}</p>
              <p className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
});

ApiFlowDiagram.displayName = "ApiFlowDiagram";
