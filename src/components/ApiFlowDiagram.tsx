import { motion, useReducedMotion } from "framer-motion";
import { Zap, Shield, Route, CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState, memo } from "react";
import { OriginXLogoFilled } from "./OriginXLogo";

type FlowStep = 0 | 1 | 2 | 3 | 4 | 5;

const STEP_MS = 1200;
const LOOP_STEPS: FlowStep[] = [0, 1, 2, 3, 4, 5];

// Animated data packet for request/response
const DataPacket = memo(({
  isActive,
  direction,
  delay = 0,
}: {
  isActive: boolean;
  direction: "right" | "left";
  delay?: number;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isReverse = direction === "left";

  if (prefersReducedMotion || !isActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
            isReverse 
              ? "bg-gradient-to-l from-green-400 to-green-500 shadow-lg shadow-green-500/40" 
              : "bg-gradient-to-r from-accent to-purple-400 shadow-lg shadow-accent/40"
          }`}
          initial={{ 
            [isReverse ? "right" : "left"]: "-10%",
            opacity: 0,
            scale: 0.5,
          }}
          animate={{ 
            [isReverse ? "right" : "left"]: "110%",
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.12,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});

DataPacket.displayName = "DataPacket";

// Animated Arrow with flowing effect
const AnimatedArrow = memo(({
  isActive,
  direction = "right",
  delay = 0,
  label,
}: {
  isActive: boolean;
  direction?: "right" | "left";
  delay?: number;
  label?: string;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isReverse = direction === "left";

  const colorClass = isReverse 
    ? "from-green-500 to-green-400" 
    : "from-accent to-purple-400";

  return (
    <div className="relative flex-col items-center justify-center w-12 sm:w-16 md:w-20 lg:w-24 hidden lg:flex">
      {label && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          className={`text-[8px] sm:text-[9px] font-medium mb-1 ${
            isReverse ? "text-green-400" : "text-accent"
          }`}
        >
          {label}
        </motion.span>
      )}
      
      <div className="relative w-full h-6 flex items-center justify-center">
        {/* Arrow line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0.3 }}
          transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute w-full h-0.5 sm:h-1 rounded-full bg-gradient-to-r ${colorClass} ${
            isReverse ? "origin-right" : "origin-left"
          } opacity-${isActive ? "80" : "30"}`}
          style={{ willChange: "transform" }}
        />

        {/* Arrow head */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.7 }}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
          className={`absolute ${isReverse ? "left-0" : "right-0"}`}
        >
          {isReverse ? (
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
          ) : (
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
          )}
        </motion.div>

        {/* Data packets */}
        {!prefersReducedMotion && (
          <DataPacket isActive={isActive} direction={direction} delay={delay} />
        )}
      </div>
    </div>
  );
});

AnimatedArrow.displayName = "AnimatedArrow";

// Provider Card with enhanced hover effects
const ProviderCard = memo(({
  name,
  index,
  isSelected,
  isActive,
  isSendingResponse,
  totalCards,
}: {
  name: string;
  index: number;
  isSelected: boolean;
  isActive: boolean;
  isSendingResponse: boolean;
  totalCards: number;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  
  // Compact stack - only show top 8 cards, tighter spacing
  const maxVisible = 8;
  if (index >= maxVisible) return null;
  
  // Calculate stack position - tighter spacing for compact look
  const offsetY = index * 4;
  const scale = 1 - index * 0.015;
  const zIndex = totalCards - index + (isSelected && isActive ? 100 : 0);
  
  // Selected card lifts up
  const selectedLift = isActive && isSelected ? -20 : 0;
  const selectedScale = isActive && isSelected ? 1.05 : 1;
  const hoverLift = isHovered && !isSelected ? -8 : 0;
  const hoverScale = isHovered && !isSelected ? 1.02 : 1;

  const getCardColor = () => {
    const colors = [
      { bg: "from-blue-500/25 to-blue-600/15", border: "border-blue-400/30" },
      { bg: "from-purple-500/25 to-purple-600/15", border: "border-purple-400/30" },
      { bg: "from-green-500/25 to-green-600/15", border: "border-green-400/30" },
      { bg: "from-orange-500/25 to-orange-600/15", border: "border-orange-400/30" },
      { bg: "from-pink-500/25 to-pink-600/15", border: "border-pink-400/30" },
      { bg: "from-cyan-500/25 to-cyan-600/15", border: "border-cyan-400/30" },
      { bg: "from-yellow-500/25 to-yellow-600/15", border: "border-yellow-400/30" },
      { bg: "from-red-500/25 to-red-600/15", border: "border-red-400/30" },
    ];
    return colors[index % colors.length];
  };

  const cardColor = getCardColor();

  return (
    <motion.div
      className="absolute left-1/2"
      style={{
        zIndex,
        willChange: "transform",
      }}
      initial={prefersReducedMotion ? { y: offsetY, x: "-50%" } : { opacity: 0, y: offsetY + 20, x: "-50%" }}
      animate={{
        y: offsetY + selectedLift + hoverLift,
        x: "-50%",
        scale: scale * selectedScale * hoverScale,
        opacity: isActive ? (isSelected ? 1 : 0.9 - index * 0.08) : 0.7 - index * 0.06,
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0.15 }
          : {
              type: "spring",
              stiffness: 350,
              damping: 28,
              mass: 0.6,
            }
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={prefersReducedMotion ? {} : { 
        y: offsetY + selectedLift - 8,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div
        className={`w-36 sm:w-40 md:w-44 rounded-lg border p-2 sm:p-2.5 cursor-pointer transition-all duration-200 ${
          isSelected && isActive
            ? "bg-card border-accent shadow-lg shadow-accent/30"
            : isHovered
            ? "bg-card border-accent/40 shadow-md shadow-accent/10"
            : "bg-card/95 border-border/50"
        } ${isSendingResponse && isSelected ? "ring-2 ring-green-400/60 ring-offset-1 ring-offset-background" : ""}`}
        animate={
          isSelected && isActive && !prefersReducedMotion
            ? { boxShadow: ["0 10px 30px -10px hsl(var(--accent) / 0.3)", "0 15px 40px -10px hsl(var(--accent) / 0.4)", "0 10px 30px -10px hsl(var(--accent) / 0.3)"] }
            : {}
        }
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="flex items-center gap-2">
          {/* Provider icon with gradient */}
          <motion.div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gradient-to-br ${cardColor.bg} ${cardColor.border} border flex items-center justify-center flex-shrink-0`}
            animate={
              isSelected && isActive && !prefersReducedMotion
                ? { rotate: [0, 3, -3, 0] }
                : isHovered && !prefersReducedMotion
                ? { scale: [1, 1.1, 1] }
                : {}
            }
            transition={{ duration: 0.5, repeat: isSelected && isActive ? Infinity : 0 }}
          >
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {name.slice(0, 2).toUpperCase()}
            </span>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold truncate">{name}</p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">
              {isSelected && isActive 
                ? (isSendingResponse ? "Responding..." : "Best match") 
                : isHovered 
                ? "Click to select"
                : "Provider"}
            </p>
          </div>

          {/* Status indicator */}
          {isSelected && isActive ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isSendingResponse ? "text-green-400" : "text-accent"
              }`} />
            </motion.div>
          ) : isHovered ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
            </motion.div>
          ) : null}
        </div>

        {/* Expanded stats for selected card */}
        {isSelected && isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
            className="mt-2 pt-2 border-t border-border/50 grid grid-cols-2 gap-2 text-[9px] text-muted-foreground"
          >
            <div>
              <span className="text-foreground font-medium">23ms</span>
              <span className="block text-[8px]">Latency</span>
            </div>
            <div className="text-right">
              <span className="text-green-400 font-medium">99.99%</span>
              <span className="block text-[8px]">Uptime</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
});

ProviderCard.displayName = "ProviderCard";

// Provider Stack Component - Contained within bounds
const ProviderStack = memo(({
  isActive,
  selectedIndex,
  cards,
  isSendingResponse,
}: {
  isActive: boolean;
  selectedIndex: number;
  cards: string[];
  isSendingResponse: boolean;
}) => {
  const visibleCards = cards.slice(0, 8);

  return (
    <div className="relative flex-shrink-0">
      {/* Stack container with fixed height to prevent overflow */}
      <div className="relative h-[140px] sm:h-[160px] w-[150px] sm:w-[170px] md:w-[190px]">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent rounded-xl" />
        
        {/* Cards - positioned from top */}
        <div className="absolute top-4 left-0 right-0">
          {visibleCards.map((name, i) => (
            <ProviderCard
              key={name}
              name={name}
              index={i}
              isSelected={i === selectedIndex}
              isActive={isActive}
              isSendingResponse={isSendingResponse}
              totalCards={visibleCards.length}
            />
          ))}
        </div>
      </div>
      
      {/* Label below stack */}
      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 text-center font-medium">
        {isActive ? "Best Provider Selected" : "Evaluating..."}
      </p>
    </div>
  );
});

ProviderStack.displayName = "ProviderStack";

// OriginX Core Component - Compact version
const OriginXCore = memo(({
  step,
}: {
  step: FlowStep;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isProcessing = step >= 2 && step < 4;
  const isResponding = step >= 4;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex-shrink-0"
    >
      <div className="relative">
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-3 sm:-inset-4 rounded-xl blur-lg"
          animate={{
            background: isProcessing
              ? "linear-gradient(135deg, hsl(var(--accent) / 0.35), hsl(var(--glow-secondary) / 0.25))"
              : isResponding
              ? "linear-gradient(135deg, hsl(142 76% 36% / 0.25), hsl(var(--accent) / 0.15))"
              : "linear-gradient(135deg, hsl(var(--accent) / 0.15), hsl(var(--glow-secondary) / 0.1))",
          }}
          transition={{ duration: 0.4 }}
          aria-hidden
        />

        <div
          className={`relative bg-card border-2 rounded-xl p-3 sm:p-4 transition-all duration-300 ${
            isProcessing 
              ? "border-accent/60 shadow-lg shadow-accent/20" 
              : isResponding 
              ? "border-green-400/50 shadow-lg shadow-green-400/15"
              : "border-border/50"
          }`}
        >
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            {/* Animated Logo */}
            <motion.div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-accent/30 to-purple-500/20 border-2 border-accent/30 flex items-center justify-center"
              animate={
                prefersReducedMotion
                  ? {}
                  : isProcessing
                  ? { 
                      rotate: [0, 5, -5, 0], 
                      scale: [1, 1.08, 1.08, 1],
                    }
                  : isResponding
                  ? { scale: [1, 1.03, 1] }
                  : {}
              }
              transition={{ 
                duration: isProcessing ? 0.5 : 0.7, 
                repeat: isProcessing ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <OriginXLogoFilled 
                size="md" 
                className={`transition-colors duration-300 ${
                  isResponding ? "text-green-400" : "text-foreground"
                }`} 
              />
            </motion.div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <OriginXLogoFilled size="sm" className="text-foreground" />
                <h3 className="font-bold text-sm sm:text-base">OriginX</h3>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Unified API Layer
              </p>
            </div>

            {/* Feature icons - compact */}
            <div className="flex gap-2 sm:gap-3" aria-hidden>
              {[
                { icon: Shield, label: "Auth", active: step >= 2 },
                { icon: Zap, label: "Speed", active: step >= 2 },
                { icon: Route, label: "Route", active: step >= 3 },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  className={`flex flex-col items-center gap-0.5 text-[8px] sm:text-[9px] transition-colors duration-200 ${
                    item.active ? "text-accent" : "text-muted-foreground"
                  }`}
                  animate={
                    prefersReducedMotion
                      ? {}
                      : step === 2
                      ? { scale: [1, 1.15, 1] }
                      : {}
                  }
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                >
                  <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Status indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 2 ? 1 : 0 }}
              className="text-[10px] sm:text-xs font-medium text-center"
            >
              {step === 2 && <span className="text-accent">Processing...</span>}
              {step === 3 && <span className="text-accent">Routing...</span>}
              {step === 4 && <span className="text-green-400">✓ Ready</span>}
              {step === 5 && <span className="text-green-400">✓ Done</span>}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

OriginXCore.displayName = "OriginXCore";

// Developer Request Box - Compact
const RequestBox = memo(({
  step,
}: {
  step: FlowStep;
}) => {
  const isSending = step >= 1;
  const isComplete = step >= 5;

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex-shrink-0"
    >
      <motion.div
        className={`w-[140px] sm:w-[160px] md:w-[180px] bg-muted/50 rounded-lg p-2.5 sm:p-3 border transition-all duration-300 ${
          isSending && !isComplete
            ? "border-accent/50 shadow-md shadow-accent/15"
            : isComplete
            ? "border-green-400/50 shadow-md shadow-green-400/15"
            : "border-border/50"
        }`}
      >
        {/* Terminal dots */}
        <div className="flex items-center gap-1 mb-2" aria-hidden>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400/60" />
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400/60" />
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400/60" />
        </div>

        {/* Request code */}
        <pre className="font-mono text-[8px] sm:text-[9px] text-muted-foreground overflow-hidden">
          <code>
            <motion.span
              className={isSending ? "text-accent font-semibold" : "text-accent/60"}
              animate={step === 1 ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 0.4, repeat: step === 1 ? Infinity : 0 }}
            >
              POST
            </motion.span>{" "}
            <span className="text-foreground/80">/v1/chat</span>
            {"\n"}
            <span className="text-muted-foreground/60 text-[7px] sm:text-[8px]">ox_live_...</span>
          </code>
        </pre>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={isSending ? { opacity: 1, height: "auto" } : {}}
          className="mt-2 pt-2 border-t border-border/50"
        >
          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px]">
            <motion.div
              className={`w-1.5 h-1.5 rounded-full ${
                isComplete
                  ? "bg-green-400"
                  : step >= 1
                  ? "bg-accent"
                  : "bg-muted-foreground"
              }`}
              animate={step >= 1 && !isComplete ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.5, repeat: step >= 1 && !isComplete ? Infinity : 0 }}
            />
            <span className={isComplete ? "text-green-400" : "text-muted-foreground"}>
              {isComplete ? "Done ✓" : step >= 1 ? "Sending..." : "Ready"}
            </span>
          </div>
        </motion.div>

        {/* Response preview */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 pt-2 border-t border-green-400/30"
          >
            <pre className="font-mono text-[8px] text-green-400 truncate">
              <code>200 OK • 45ms</code>
            </pre>
          </motion.div>
        )}
      </motion.div>
      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1.5 text-center font-medium">
        Your App
      </p>
    </motion.div>
  );
});

RequestBox.displayName = "RequestBox";

export const ApiFlowDiagram = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState<FlowStep>(0);
  const [selectedProvider, setSelectedProvider] = useState(0);

  const providerCards = useMemo(
    () => [
      "OpenAI",
      "Anthropic",
      "Google",
      "AWS",
      "Azure",
      "Stripe",
      "Twilio",
      "Vercel",
    ],
    []
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setStep((prev) => {
        const idx = LOOP_STEPS.indexOf(prev);
        const next = LOOP_STEPS[(idx + 1) % LOOP_STEPS.length];
        return next;
      });
    }, STEP_MS);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (step === 0) {
      setSelectedProvider((p) => (p + 1) % providerCards.length);
    }
  }, [prefersReducedMotion, providerCards.length, step]);

  const isSelecting = step >= 3;
  const isResponding = step >= 4;

  return (
    <div className="relative glass rounded-2xl p-4 sm:p-5 lg:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" aria-hidden />

      <div className="relative z-10">
        {/* Main Flow - Horizontal layout */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
          {/* Request Box */}
          <RequestBox step={step} />

          {/* Request Arrow */}
          <AnimatedArrow 
            isActive={step >= 1 && step < 5} 
            direction="right" 
            label="Request"
          />

          {/* OriginX Core */}
          <OriginXCore step={step} />

          {/* To Providers Arrow */}
          <AnimatedArrow 
            isActive={step >= 3 && step < 5} 
            direction="right"
            delay={0.1}
            label="Route"
          />

          {/* Provider Stack */}
          <ProviderStack
            isActive={isSelecting}
            selectedIndex={selectedProvider}
            cards={providerCards}
            isSendingResponse={isResponding}
          />
        </div>

        {/* Response Flow Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isResponding ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="mt-4 sm:mt-5"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            {/* Response arrow indicator */}
            <motion.div 
              className="flex items-center gap-2 text-green-400"
              animate={isResponding ? { x: [0, -5, 0] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-medium">Response</span>
            </motion.div>

            {/* Response stats */}
            <div className="flex items-center gap-3 sm:gap-4 bg-muted/40 rounded-lg px-3 py-1.5 border border-green-400/20">
              <div className="text-center">
                <p className="text-sm sm:text-base font-bold text-green-400">200</p>
                <p className="text-[8px] sm:text-[9px] text-muted-foreground">Status</p>
              </div>
              <div className="h-6 w-px bg-border/50" />
              <div className="text-center">
                <p className="text-sm sm:text-base font-bold text-foreground">45ms</p>
                <p className="text-[8px] sm:text-[9px] text-muted-foreground">Latency</p>
              </div>
              <div className="h-6 w-px bg-border/50" />
              <div className="text-center">
                <p className="text-sm sm:text-base font-bold text-foreground truncate max-w-[60px]">
                  {providerCards[selectedProvider]}
                </p>
                <p className="text-[8px] sm:text-[9px] text-muted-foreground">Provider</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-5 pt-4 border-t border-border/50"
        >
          {[
            { value: "50+", label: "Providers" },
            { value: "<50ms", label: "Latency" },
            { value: "99.99%", label: "Uptime" },
            { value: "1B+", label: "API Calls" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg sm:text-xl font-bold text-gradient">{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
});

ApiFlowDiagram.displayName = "ApiFlowDiagram";
