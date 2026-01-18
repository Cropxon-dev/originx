import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Zap, Shield, Route, CheckCircle2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState, memo, useCallback, useRef } from "react";
import { OriginXLogoFilled } from "./OriginXLogo";

type FlowStep = 0 | 1 | 2 | 3 | 4 | 5;

const STEP_MS = 1400;
const LOOP_STEPS: FlowStep[] = [0, 1, 2, 3, 4, 5];

// Compact Dashed Arrow
const DashedArrow = memo(({
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
  
  const colorClasses = color === "green" 
    ? { line: "border-green-400", dot: "bg-green-400", text: "text-green-400", glow: "shadow-green-400/50" }
    : { line: "border-accent", dot: "bg-accent", text: "text-accent", glow: "shadow-accent/50" };

  return (
    <div className="relative flex flex-col items-center justify-center w-8 sm:w-12 md:w-16 lg:w-20 flex-shrink-0">
      {label && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.4 }}
          className={`text-[6px] sm:text-[7px] md:text-[8px] font-semibold mb-1 uppercase tracking-wider ${colorClasses.text} hidden sm:block`}
        >
          {label}
        </motion.span>
      )}
      
      <div className="relative w-full h-6 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          className={`absolute w-full border-t-2 border-dashed ${colorClasses.line}`}
        />

        {!prefersReducedMotion && isActive && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${colorClasses.dot} shadow-lg ${colorClasses.glow}`}
                initial={{ [isReverse ? "right" : "left"]: "-10%", opacity: 0 }}
                animate={{ [isReverse ? "right" : "left"]: "110%", opacity: [0, 1, 1, 1, 0] }}
                transition={{
                  duration: 1,
                  delay: i * 0.25,
                  repeat: Infinity,
                  repeatDelay: 0.3,
                  ease: "linear",
                }}
              />
            ))}
          </>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
          className={`absolute ${isReverse ? "left-0" : "right-0"} ${colorClasses.text}`}
        >
          <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" className={`sm:w-[10px] sm:h-[10px] ${isReverse ? "rotate-180" : ""}`}>
            <path d="M2 6L8 1V4H12V8H8V11L2 6Z" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
});

DashedArrow.displayName = "DashedArrow";

// Parallax Provider Card
const ProviderCard = memo(({
  name,
  index,
  isSelected,
  isActive,
  isSendingResponse,
  totalCards,
  onSelect,
  scrollProgress,
}: {
  name: string;
  index: number;
  isSelected: boolean;
  isActive: boolean;
  isSendingResponse: boolean;
  totalCards: number;
  onSelect: (index: number) => void;
  scrollProgress: number;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  
  const maxVisible = 6;
  if (index >= maxVisible) return null;
  
  // Parallax effect - cards move at different speeds
  const parallaxOffset = prefersReducedMotion ? 0 : (index * 3) * scrollProgress;
  
  // Stack positioning
  const baseOffsetY = index * 4;
  const scale = 1 - index * 0.02;
  const zIndex = totalCards - index + (isSelected && isActive ? 100 : 0);
  
  const selectedLift = isActive && isSelected ? -18 : 0;
  const selectedScale = isActive && isSelected ? 1.08 : 1;
  const hoverLift = isHovered && !isSelected ? -5 : 0;

  const cardColors = [
    { bg: "from-blue-500/25 to-blue-600/15", solid: "bg-blue-500" },
    { bg: "from-purple-500/25 to-purple-600/15", solid: "bg-purple-500" },
    { bg: "from-emerald-500/25 to-emerald-600/15", solid: "bg-emerald-500" },
    { bg: "from-orange-500/25 to-orange-600/15", solid: "bg-orange-500" },
    { bg: "from-pink-500/25 to-pink-600/15", solid: "bg-pink-500" },
    { bg: "from-cyan-500/25 to-cyan-600/15", solid: "bg-cyan-500" },
  ];
  const cardColor = cardColors[index % cardColors.length];

  const handleClick = useCallback(() => onSelect(index), [index, onSelect]);

  return (
    <motion.div
      className="absolute left-1/2 cursor-pointer"
      style={{ zIndex, willChange: "transform" }}
      initial={prefersReducedMotion ? { y: baseOffsetY, x: "-50%" } : { opacity: 0, y: baseOffsetY + 20, x: "-50%" }}
      animate={{
        y: baseOffsetY + selectedLift + hoverLift + parallaxOffset,
        x: "-50%",
        scale: scale * selectedScale,
        opacity: isActive ? (isSelected ? 1 : 0.9 - index * 0.08) : 0.7 - index * 0.06,
        rotateX: prefersReducedMotion ? 0 : isSelected && isActive ? 0 : index * 2,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.4,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      whileTap={{ scale: scale * 0.96 }}
    >
      <motion.div
        className={`w-[100px] sm:w-[110px] md:w-[120px] lg:w-[130px] rounded-lg border p-1.5 sm:p-2 transition-colors duration-200 ${
          isSelected && isActive
            ? `bg-gradient-to-br ${cardColor.bg} border-accent shadow-lg shadow-accent/30`
            : isHovered
            ? "bg-card/95 border-accent/50 shadow-md"
            : "bg-card/90 border-border/40"
        } ${isSendingResponse && isSelected ? "ring-2 ring-green-400/70" : ""}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex items-center gap-1.5">
          <motion.div
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
              isSelected && isActive ? `${cardColor.solid} text-white` : `bg-gradient-to-br ${cardColor.bg} border border-border/40`
            }`}
            animate={isSelected && isActive && !prefersReducedMotion ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 0.5, repeat: isSelected && isActive ? Infinity : 0 }}
          >
            <span className={`text-[8px] sm:text-[9px] font-bold ${isSelected && isActive ? "text-white" : "text-foreground"}`}>
              {name.slice(0, 2).toUpperCase()}
            </span>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[9px] sm:text-[10px] font-semibold truncate">{name}</p>
            <p className="text-[7px] sm:text-[8px] text-muted-foreground truncate">
              {isSelected && isActive ? (isSendingResponse ? "Responding" : "Selected") : isHovered ? "Click" : "Provider"}
            </p>
          </div>

          {isSelected && isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSendingResponse ? "text-green-400" : "text-accent"}`} />
            </motion.div>
          )}
          {isHovered && !isSelected && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Sparkles className="w-3 h-3 text-accent/60" />
            </motion.div>
          )}
        </div>

        {isSelected && isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-1.5 pt-1.5 border-t border-border/40 flex justify-between text-[7px] sm:text-[8px]"
          >
            <span><span className="text-foreground font-medium">24ms</span> <span className="text-muted-foreground">lat</span></span>
            <span><span className="text-green-400 font-medium">99.9%</span> <span className="text-muted-foreground">up</span></span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
});

ProviderCard.displayName = "ProviderCard";

// Provider Stack with Parallax
const ProviderStack = memo(({
  isActive,
  selectedIndex,
  cards,
  isSendingResponse,
  onSelectProvider,
  scrollProgress,
}: {
  isActive: boolean;
  selectedIndex: number;
  cards: string[];
  isSendingResponse: boolean;
  onSelectProvider: (index: number) => void;
  scrollProgress: number;
}) => {
  return (
    <div className="flex flex-col items-center flex-shrink-0 flex-1 min-w-0 max-w-[140px] sm:max-w-[150px] md:max-w-[160px]">
      <div className="relative h-[90px] sm:h-[100px] md:h-[110px] w-full" style={{ perspective: "800px" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent rounded-lg" />
        <div className="absolute top-2 left-0 right-0">
          {cards.slice(0, 6).map((name, i) => (
            <ProviderCard
              key={name}
              name={name}
              index={i}
              isSelected={i === selectedIndex}
              isActive={isActive}
              isSendingResponse={isSendingResponse}
              totalCards={6}
              onSelect={onSelectProvider}
              scrollProgress={scrollProgress}
            />
          ))}
        </div>
      </div>
      <p className="text-[8px] sm:text-[9px] text-muted-foreground font-medium mt-1">
        {isActive ? "Best Provider" : "Evaluating"}
      </p>
    </div>
  );
});

ProviderStack.displayName = "ProviderStack";

// Compact OriginX Core
const OriginXCore = memo(({ step }: { step: FlowStep }) => {
  const prefersReducedMotion = useReducedMotion();
  const isProcessing = step >= 2 && step < 4;
  const isResponding = step >= 4;

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative">
          <motion.div
            className="absolute -inset-2 sm:-inset-3 rounded-xl blur-md"
            animate={{
              background: isProcessing
                ? "linear-gradient(135deg, hsl(var(--accent) / 0.4), hsl(var(--glow-secondary) / 0.3))"
                : isResponding
                ? "linear-gradient(135deg, hsl(142 76% 36% / 0.3), hsl(var(--accent) / 0.2))"
                : "linear-gradient(135deg, hsl(var(--accent) / 0.15), hsl(var(--glow-secondary) / 0.1))",
            }}
            transition={{ duration: 0.3 }}
          />

          <div className={`relative bg-card border-2 rounded-xl p-2 sm:p-2.5 md:p-3 transition-all duration-300 ${
            isProcessing ? "border-accent/70 shadow-lg shadow-accent/20" 
            : isResponding ? "border-green-400/60 shadow-lg shadow-green-400/15"
            : "border-border/50"
          }`}>
            <div className="flex flex-col items-center gap-1.5 sm:gap-2">
              <motion.div
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  isResponding 
                    ? "bg-gradient-to-br from-green-400/30 to-green-500/20 border border-green-400/40" 
                    : "bg-gradient-to-br from-accent/30 to-purple-500/20 border border-accent/40"
                }`}
                animate={
                  prefersReducedMotion ? {} 
                  : isProcessing ? { rotate: [0, 6, -6, 0], scale: [1, 1.06, 1.06, 1] }
                  : isResponding ? { scale: [1, 1.03, 1] } : {}
                }
                transition={{ duration: isProcessing ? 0.5 : 0.8, repeat: isProcessing || isResponding ? Infinity : 0 }}
              >
                <OriginXLogoFilled size="sm" className={`transition-colors duration-300 ${isResponding ? "text-green-400" : "text-foreground"}`} />
              </motion.div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <OriginXLogoFilled size="sm" className="text-foreground w-3 h-3" />
                  <h3 className="font-bold text-[10px] sm:text-xs">OriginX</h3>
                </div>
                <p className="text-[7px] sm:text-[8px] text-muted-foreground">API Layer</p>
              </div>

              <div className="flex gap-1.5 sm:gap-2">
                {[
                  { icon: Shield, active: step >= 2 },
                  { icon: Zap, active: step >= 2 },
                  { icon: Route, active: step >= 3 },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className={`transition-colors duration-200 ${item.active ? "text-accent" : "text-muted-foreground/50"}`}
                    animate={prefersReducedMotion || step !== 2 ? {} : { scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.2, delay: idx * 0.06 }}
                  >
                    <item.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: step >= 2 ? 1 : 0 }}
                className="text-[7px] sm:text-[8px] font-medium"
              >
                {step === 2 && <span className="text-accent">Processing</span>}
                {step === 3 && <span className="text-accent">Routing</span>}
                {step >= 4 && <span className="text-green-400">✓ Done</span>}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

OriginXCore.displayName = "OriginXCore";

// Compact Request Box
const RequestBox = memo(({ step }: { step: FlowStep }) => {
  const isSending = step >= 1;
  const isComplete = step >= 5;

  return (
    <div className="flex flex-col items-center flex-shrink-0 flex-1 min-w-0 max-w-[120px] sm:max-w-[130px] md:max-w-[140px]">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className={`w-full bg-muted/60 rounded-lg p-2 sm:p-2.5 border transition-all duration-300 ${
            isSending && !isComplete ? "border-accent/60 shadow-md shadow-accent/15"
            : isComplete ? "border-green-400/60 shadow-md shadow-green-400/15"
            : "border-border/50"
          }`}
        >
          <div className="flex items-center gap-0.5 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/70" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-400/70" />
          </div>

          <pre className="font-mono text-[7px] sm:text-[8px] text-muted-foreground overflow-hidden">
            <code>
              <motion.span
                className={isSending ? "text-accent font-bold" : "text-accent/60"}
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
            className="mt-1.5 pt-1.5 border-t border-border/50"
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1.5 pt-1.5 border-t border-green-400/30"
            >
              <span className="font-mono text-[7px] text-green-400 font-medium">200 • 45ms</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      <p className="text-[8px] sm:text-[9px] text-muted-foreground font-medium mt-1">Your App</p>
    </div>
  );
});

RequestBox.displayName = "RequestBox";

// Main Component
export const ApiFlowDiagram = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<FlowStep>(0);
  const [selectedProvider, setSelectedProvider] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const [scrollValue, setScrollValue] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollProgress.on("change", setScrollValue);
    return () => unsubscribe();
  }, [scrollProgress]);

  const providerCards = useMemo(() => ["OpenAI", "Anthropic", "Google", "AWS", "Stripe", "Twilio"], []);

  useEffect(() => {
    if (prefersReducedMotion || !isAutoPlaying) return;
    const interval = window.setInterval(() => {
      setStep((prev) => LOOP_STEPS[(LOOP_STEPS.indexOf(prev) + 1) % LOOP_STEPS.length]);
    }, STEP_MS);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, isAutoPlaying]);

  useEffect(() => {
    if (prefersReducedMotion || !isAutoPlaying) return;
    if (step === 0) setSelectedProvider((p) => (p + 1) % providerCards.length);
  }, [prefersReducedMotion, providerCards.length, step, isAutoPlaying]);

  const handleSelectProvider = useCallback((index: number) => {
    setIsAutoPlaying(false);
    setSelectedProvider(index);
    setStep(4);
    const timeout = setTimeout(() => {
      setIsAutoPlaying(true);
      setStep(0);
    }, 4000);
    return () => clearTimeout(timeout);
  }, []);

  const isSelecting = step >= 3;
  const isResponding = step >= 4;

  return (
    <div ref={containerRef} className="relative glass rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 overflow-hidden w-full">
      <div className="absolute inset-0 bg-grid opacity-5" />

      <div className="relative z-10">
        {/* Main Flow - Responsive */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 w-full">
          <RequestBox step={step} />
          <DashedArrow isActive={step >= 1 && step <= 3} direction="right" label="Req" color="accent" />
          <OriginXCore step={step} />
          <DashedArrow isActive={step >= 3 && step <= 4} direction="right" label="Route" color="accent" />
          <ProviderStack
            isActive={isSelecting}
            selectedIndex={selectedProvider}
            cards={providerCards}
            isSendingResponse={isResponding}
            onSelectProvider={handleSelectProvider}
            scrollProgress={scrollValue}
          />
        </div>

        {/* Response Flow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isResponding ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="mt-3 sm:mt-4"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <DashedArrow isActive={step >= 4} direction="left" label="Response" color="green" />
          </div>

          <div className="flex items-center justify-center">
            <motion.div 
              className="flex items-center gap-2 sm:gap-4 bg-muted/50 rounded-lg px-3 py-1.5 border border-green-400/30"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
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
                <p className="text-sm sm:text-base font-bold text-foreground truncate max-w-[60px]">{providerCards[selectedProvider]}</p>
                <p className="text-[6px] sm:text-[7px] text-muted-foreground uppercase">Provider</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 pt-3 border-t border-border/40"
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
    </div>
  );
});

ApiFlowDiagram.displayName = "ApiFlowDiagram";
