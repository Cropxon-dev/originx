import { motion, useReducedMotion, useInView, AnimatePresence } from "framer-motion";
import { Zap, Shield, Route, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState, memo, useCallback, useRef } from "react";
import { OriginXLogoFilled } from "./OriginXLogo";

type FlowStep = 0 | 1 | 2 | 3 | 4 | 5;

const STEP_MS = 1500;
const LOOP_STEPS: FlowStep[] = [0, 1, 2, 3, 4, 5];

// Compact Arrow
const FlowArrow = memo(({
  isActive,
  direction = "right",
  label,
  color = "accent",
}: {
  isActive: boolean;
  direction?: "right" | "left";
  label?: string;
  color?: "accent" | "green";
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isReverse = direction === "left";
  
  const colors = color === "green" 
    ? { line: "border-green-400", dot: "bg-green-400", text: "text-green-400" }
    : { line: "border-accent", dot: "bg-accent", text: "text-accent" };

  return (
    <div className="flex flex-col items-center justify-center flex-shrink-0 w-6 sm:w-10 md:w-14 lg:w-20">
      {label && (
        <span className={`text-[6px] sm:text-[8px] font-semibold mb-0.5 uppercase tracking-wide ${colors.text} opacity-${isActive ? "100" : "40"} hidden sm:block`}>
          {label}
        </span>
      )}
      
      <div className="relative w-full h-5 flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{ opacity: isActive ? 0.7 : 0.25 }}
          className={`absolute w-full border-t-[1.5px] border-dashed ${colors.line}`}
        />

        {!prefersReducedMotion && isActive && [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full ${colors.dot}`}
            initial={{ [isReverse ? "right" : "left"]: "-10%", opacity: 0 }}
            animate={{ [isReverse ? "right" : "left"]: "110%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1, delay: i * 0.25, repeat: Infinity, ease: "linear" }}
          />
        ))}

        <motion.div
          animate={{ opacity: isActive ? 1 : 0.3 }}
          className={`absolute ${isReverse ? "left-0" : "right-0"} ${colors.text}`}
        >
          <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" className={isReverse ? "rotate-180" : ""}>
            <path d="M2 6L8 1V4H12V8H8V11L2 6Z" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
});

FlowArrow.displayName = "FlowArrow";

// Provider Card - One at a time with stack visual
const ProviderCard = memo(({
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
    { bg: "from-blue-500/25 to-blue-600/15", solid: "bg-blue-500" },
    { bg: "from-purple-500/25 to-purple-600/15", solid: "bg-purple-500" },
    { bg: "from-emerald-500/25 to-emerald-600/15", solid: "bg-emerald-500" },
    { bg: "from-orange-500/25 to-orange-600/15", solid: "bg-orange-500" },
    { bg: "from-pink-500/25 to-pink-600/15", solid: "bg-pink-500" },
    { bg: "from-cyan-500/25 to-cyan-600/15", solid: "bg-cyan-500" },
  ];
  const color = cardColors[currentIndex % cardColors.length];

  return (
    <div className="relative w-full">
      {/* Stack behind */}
      {[2, 1].map((offset) => (
        <div
          key={offset}
          className="absolute inset-x-0 top-0 bg-card/50 rounded-lg border border-border/20"
          style={{
            height: "calc(100% - 4px)",
            top: offset * 3,
            transform: `scale(${1 - offset * 0.02})`,
            zIndex: -offset,
            opacity: 0.4 - offset * 0.1,
          }}
        />
      ))}

      {/* Main Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
          className={`relative rounded-lg border p-2 sm:p-3 cursor-pointer transition-all ${
            isActive
              ? `bg-gradient-to-br ${color.bg} border-accent/50 shadow-lg shadow-accent/15`
              : "bg-card border-border/40"
          } ${isResponding ? "ring-2 ring-green-400/60" : ""}`}
          onClick={onNext}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
                isActive ? `${color.solid} text-white` : `bg-gradient-to-br ${color.bg}`
              }`}
              animate={isActive && !prefersReducedMotion ? { rotate: [0, 4, -4, 0] } : {}}
              transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
            >
              <span className={`text-xs sm:text-sm font-bold ${isActive ? "text-white" : "text-foreground"}`}>
                {name.slice(0, 2).toUpperCase()}
              </span>
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold truncate">{name}</p>
              <p className="text-[8px] sm:text-[10px] text-muted-foreground">
                {isActive ? (isResponding ? "Responding" : "Selected") : "Provider"}
              </p>
            </div>

            {isActive && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isResponding ? "text-green-400" : "text-accent"}`} />
              </motion.div>
            )}
          </div>

          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 pt-2 border-t border-border/40 flex justify-between text-[8px] sm:text-[9px]"
            >
              <span><span className="text-foreground font-medium">24ms</span> lat</span>
              <span><span className="text-green-400 font-medium">99.9%</span> up</span>
            </motion.div>
          )}

          {/* Dots */}
          <div className="flex justify-center gap-1 mt-2">
            {Array.from({ length: totalCount }).map((_, i) => (
              <div
                key={i}
                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors ${
                  i === currentIndex ? "bg-accent" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      
      <p className="text-[8px] sm:text-[10px] text-muted-foreground text-center mt-1.5 font-medium">
        {isActive ? "Best Provider" : "Evaluating"}
      </p>
    </div>
  );
});

ProviderCard.displayName = "ProviderCard";

// OriginX Core
const OriginXCore = memo(({ step }: { step: FlowStep }) => {
  const prefersReducedMotion = useReducedMotion();
  const isProcessing = step >= 2 && step < 4;
  const isResponding = step >= 4;

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="relative">
        <motion.div
          className="absolute -inset-2 sm:-inset-3 rounded-xl blur-lg"
          animate={{
            background: isProcessing
              ? "linear-gradient(135deg, hsl(var(--accent) / 0.4), hsl(var(--glow-secondary) / 0.3))"
              : isResponding
              ? "linear-gradient(135deg, hsl(142 76% 36% / 0.35), hsl(var(--accent) / 0.2))"
              : "linear-gradient(135deg, hsl(var(--accent) / 0.15), hsl(var(--glow-secondary) / 0.1))",
          }}
        />

        <div className={`relative bg-card border-2 rounded-xl p-2 sm:p-3 md:p-4 transition-all duration-300 ${
          isProcessing ? "border-accent/60 shadow-lg shadow-accent/20" 
          : isResponding ? "border-green-400/50 shadow-lg shadow-green-400/15"
          : "border-border/50"
        }`}>
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <motion.div
              className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-colors ${
                isResponding 
                  ? "bg-gradient-to-br from-green-400/35 to-green-500/20 border border-green-400/40" 
                  : "bg-gradient-to-br from-accent/35 to-purple-500/20 border border-accent/40"
              }`}
              animate={
                prefersReducedMotion ? {} 
                : isProcessing ? { rotate: [0, 6, -6, 0], scale: [1, 1.06, 1.06, 1] }
                : isResponding ? { scale: [1, 1.04, 1] } : {}
              }
              transition={{ duration: isProcessing ? 0.5 : 0.8, repeat: isProcessing || isResponding ? Infinity : 0 }}
            >
              <OriginXLogoFilled size="md" className={`transition-colors ${isResponding ? "text-green-400" : "text-foreground"}`} />
            </motion.div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <OriginXLogoFilled size="sm" className="text-foreground w-3 h-3" />
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm">OriginX</h3>
              </div>
              <p className="text-[7px] sm:text-[8px] text-muted-foreground">API Layer</p>
            </div>

            <div className="flex gap-2 sm:gap-3">
              {[
                { icon: Shield, active: step >= 2 },
                { icon: Zap, active: step >= 2 },
                { icon: Route, active: step >= 3 },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`transition-colors ${item.active ? "text-accent" : "text-muted-foreground/40"}`}
                  animate={prefersReducedMotion || step !== 2 ? {} : { scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                >
                  <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </motion.div>
              ))}
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 2 ? 1 : 0 }}
              className="text-[7px] sm:text-[8px] font-medium"
            >
              {step === 2 && <span className="text-accent">Processing</span>}
              {step === 3 && <span className="text-accent">Routing</span>}
              {step >= 4 && <span className="text-green-400">✓ Done</span>}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
});

OriginXCore.displayName = "OriginXCore";

// Request Box
const RequestBox = memo(({ step }: { step: FlowStep }) => {
  const isSending = step >= 1;
  const isComplete = step >= 5;

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <motion.div
        className={`w-full bg-muted/60 rounded-lg p-2 sm:p-3 border transition-all ${
          isSending && !isComplete ? "border-accent/50 shadow-md shadow-accent/15"
          : isComplete ? "border-green-400/50 shadow-md shadow-green-400/15"
          : "border-border/40"
        }`}
      >
        <div className="flex items-center gap-1 mb-1.5">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400/70" />
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400/70" />
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400/70" />
        </div>

        <pre className="font-mono text-[7px] sm:text-[9px] text-muted-foreground">
          <code>
            <motion.span
              className={isSending ? "text-accent font-bold" : "text-accent/50"}
              animate={step === 1 ? { opacity: [1, 0.4, 1] } : {}}
              transition={{ duration: 0.4, repeat: step === 1 ? Infinity : 0 }}
            >
              POST
            </motion.span>{" "}
            <span className="text-foreground/80">/v1/chat</span>
          </code>
        </pre>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={isSending ? { opacity: 1, height: "auto" } : {}}
          className="mt-1.5 pt-1.5 border-t border-border/40"
        >
          <div className="flex items-center gap-1 text-[7px] sm:text-[8px]">
            <motion.div
              className={`w-1.5 h-1.5 rounded-full ${isComplete ? "bg-green-400" : step >= 1 ? "bg-accent" : "bg-muted-foreground"}`}
              animate={step >= 1 && !isComplete ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.5, repeat: step >= 1 && !isComplete ? Infinity : 0 }}
            />
            <span className={isComplete ? "text-green-400" : "text-muted-foreground"}>
              {isComplete ? "Done" : step >= 1 ? "Sending" : "Ready"}
            </span>
          </div>
        </motion.div>

        {isComplete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 pt-1.5 border-t border-green-400/30">
            <span className="font-mono text-[7px] sm:text-[8px] text-green-400 font-medium">200 • 45ms</span>
          </motion.div>
        )}
      </motion.div>
      <p className="text-[7px] sm:text-[9px] text-muted-foreground font-medium mt-1">Your App</p>
    </div>
  );
});

RequestBox.displayName = "RequestBox";

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
      className="relative glass rounded-xl p-3 sm:p-4 md:p-5 overflow-hidden w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-grid opacity-5" />

      <div className="relative z-10">
        {/* Title */}
        <motion.p
          className="text-center text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-4 sm:mb-5"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          How It Works
        </motion.p>

        {/* Main Flow - Tight horizontal layout */}
        <div className="flex items-stretch justify-between gap-1 w-full">
          {/* Request */}
          <div className="flex-1 min-w-0 max-w-[130px] sm:max-w-[150px] md:max-w-[170px]">
            <RequestBox step={step} />
          </div>

          <FlowArrow isActive={step >= 1 && step <= 3} direction="right" label="Req" />

          {/* OriginX */}
          <OriginXCore step={step} />

          <FlowArrow isActive={step >= 3 && step <= 4} direction="right" label="Route" />

          {/* Provider */}
          <div className="flex-1 min-w-0 max-w-[130px] sm:max-w-[150px] md:max-w-[170px]">
            <ProviderCard
              name={providers[selectedProvider]}
              isActive={isSelecting}
              isResponding={isResponding}
              currentIndex={selectedProvider}
              totalCount={providers.length}
              onNext={handleNext}
            />
          </div>
        </div>

        {/* Response Flow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isResponding ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <div className="flex items-center justify-center mb-2">
            <FlowArrow isActive={step >= 4} direction="left" label="Response" color="green" />
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 sm:gap-5 bg-muted/50 rounded-lg px-3 py-1.5 border border-green-400/30">
              <div className="text-center">
                <p className="text-sm sm:text-base font-bold text-green-400">200</p>
                <p className="text-[6px] sm:text-[7px] text-muted-foreground uppercase">Status</p>
              </div>
              <div className="h-5 w-px bg-border/50" />
              <div className="text-center">
                <p className="text-sm sm:text-base font-bold text-foreground">45ms</p>
                <p className="text-[6px] sm:text-[7px] text-muted-foreground uppercase">Latency</p>
              </div>
              <div className="h-5 w-px bg-border/50" />
              <div className="text-center">
                <p className="text-sm sm:text-base font-bold text-foreground truncate max-w-[50px] sm:max-w-[70px]">{providers[selectedProvider]}</p>
                <p className="text-[6px] sm:text-[7px] text-muted-foreground uppercase">Provider</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-4 pt-3 border-t border-border/40"
        >
          {[
            { value: "50+", label: "Providers" },
            { value: "<50ms", label: "Latency" },
            { value: "99.99%", label: "Uptime" },
            { value: "1B+", label: "Calls" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-base sm:text-lg font-bold text-gradient">{stat.value}</p>
              <p className="text-[7px] sm:text-[8px] text-muted-foreground uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
});

ApiFlowDiagram.displayName = "ApiFlowDiagram";
