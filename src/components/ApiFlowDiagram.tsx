import { motion, useReducedMotion } from "framer-motion";
import { Zap, Shield, Route, CheckCircle2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState, memo, useCallback } from "react";
import { OriginXLogoFilled } from "./OriginXLogo";

type FlowStep = 0 | 1 | 2 | 3 | 4 | 5;

const STEP_MS = 1400;
const LOOP_STEPS: FlowStep[] = [0, 1, 2, 3, 4, 5];

// Dashed Arrow with flowing animation
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
    <div className="relative flex flex-col items-center justify-center w-16 sm:w-20 md:w-28 lg:w-36">
      {label && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.4 }}
          className={`text-[8px] sm:text-[9px] font-semibold mb-1.5 uppercase tracking-wider ${colorClasses.text}`}
        >
          {label}
        </motion.span>
      )}
      
      <div className="relative w-full h-8 flex items-center justify-center overflow-hidden">
        {/* Dashed line */}
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          className={`absolute w-full border-t-2 border-dashed ${colorClasses.line}`}
          style={{ 
            borderStyle: "dashed",
            borderSpacing: "4px",
          }}
        />

        {/* Animated dots flowing along the line */}
        {!prefersReducedMotion && isActive && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${colorClasses.dot} shadow-lg ${colorClasses.glow}`}
                initial={{ 
                  [isReverse ? "right" : "left"]: "-10%",
                  opacity: 0,
                }}
                animate={{ 
                  [isReverse ? "right" : "left"]: "110%",
                  opacity: [0, 1, 1, 1, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.25,
                  repeat: Infinity,
                  repeatDelay: 0.2,
                  ease: "linear",
                }}
              />
            ))}
          </>
        )}

        {/* Arrow head */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
          className={`absolute ${isReverse ? "left-0" : "right-0"} ${colorClasses.text}`}
        >
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="currentColor"
            className={isReverse ? "rotate-180" : ""}
          >
            <path d="M2 6L8 1V4H12V8H8V11L2 6Z" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
});

DashedArrow.displayName = "DashedArrow";

// Provider Card with click interaction
const ProviderCard = memo(({
  name,
  index,
  isSelected,
  isActive,
  isSendingResponse,
  totalCards,
  onSelect,
}: {
  name: string;
  index: number;
  isSelected: boolean;
  isActive: boolean;
  isSendingResponse: boolean;
  totalCards: number;
  onSelect: (index: number) => void;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  
  // Show top 8 cards only
  const maxVisible = 8;
  if (index >= maxVisible) return null;
  
  // Stack positioning - centered and aligned
  const offsetY = index * 5;
  const scale = 1 - index * 0.018;
  const zIndex = totalCards - index + (isSelected && isActive ? 100 : 0);
  
  // Animations
  const selectedLift = isActive && isSelected ? -22 : 0;
  const selectedScale = isActive && isSelected ? 1.06 : 1;
  const hoverLift = isHovered && !isSelected ? -6 : 0;
  const hoverScale = isHovered && !isSelected ? 1.02 : 1;

  const getCardStyle = () => {
    const styles = [
      { gradient: "from-blue-500/30 to-blue-600/20", border: "border-blue-400/40", icon: "bg-blue-500" },
      { gradient: "from-purple-500/30 to-purple-600/20", border: "border-purple-400/40", icon: "bg-purple-500" },
      { gradient: "from-emerald-500/30 to-emerald-600/20", border: "border-emerald-400/40", icon: "bg-emerald-500" },
      { gradient: "from-orange-500/30 to-orange-600/20", border: "border-orange-400/40", icon: "bg-orange-500" },
      { gradient: "from-pink-500/30 to-pink-600/20", border: "border-pink-400/40", icon: "bg-pink-500" },
      { gradient: "from-cyan-500/30 to-cyan-600/20", border: "border-cyan-400/40", icon: "bg-cyan-500" },
      { gradient: "from-amber-500/30 to-amber-600/20", border: "border-amber-400/40", icon: "bg-amber-500" },
      { gradient: "from-rose-500/30 to-rose-600/20", border: "border-rose-400/40", icon: "bg-rose-500" },
    ];
    return styles[index % styles.length];
  };

  const cardStyle = getCardStyle();

  const handleClick = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  return (
    <motion.div
      className="absolute left-1/2 cursor-pointer"
      style={{
        zIndex,
        willChange: "transform",
      }}
      initial={prefersReducedMotion ? { y: offsetY, x: "-50%" } : { opacity: 0, y: offsetY + 25, x: "-50%" }}
      animate={{
        y: offsetY + selectedLift + hoverLift,
        x: "-50%",
        scale: scale * selectedScale * hoverScale,
        opacity: isActive ? (isSelected ? 1 : 0.88 - index * 0.06) : 0.65 - index * 0.05,
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0.15 }
          : {
              type: "spring",
              stiffness: 380,
              damping: 30,
              mass: 0.5,
            }
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      whileTap={{ scale: scale * 0.98 }}
    >
      <motion.div
        className={`w-32 sm:w-36 md:w-40 rounded-xl border-2 p-2 sm:p-2.5 transition-colors duration-200 ${
          isSelected && isActive
            ? `bg-gradient-to-br ${cardStyle.gradient} border-accent shadow-xl shadow-accent/25`
            : isHovered
            ? `bg-card/95 ${cardStyle.border} shadow-lg`
            : "bg-card/90 border-border/50"
        } ${isSendingResponse && isSelected ? "ring-2 ring-green-400/70 ring-offset-2 ring-offset-background" : ""}`}
        layout
      >
        <div className="flex items-center gap-2">
          {/* Provider icon */}
          <motion.div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isSelected && isActive 
                ? `${cardStyle.icon} text-white` 
                : `bg-gradient-to-br ${cardStyle.gradient} ${cardStyle.border} border`
            }`}
            animate={
              isSelected && isActive && !prefersReducedMotion
                ? { rotate: [0, 5, -5, 0] }
                : isHovered && !prefersReducedMotion
                ? { scale: [1, 1.15, 1] }
                : {}
            }
            transition={{ duration: 0.4, repeat: isSelected && isActive ? Infinity : 0 }}
          >
            <span className={`text-[10px] sm:text-xs font-bold ${isSelected && isActive ? "text-white" : "text-foreground"}`}>
              {name.slice(0, 2).toUpperCase()}
            </span>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[11px] sm:text-xs font-semibold truncate">{name}</p>
            <p className="text-[8px] sm:text-[9px] text-muted-foreground truncate">
              {isSelected && isActive 
                ? (isSendingResponse ? "Responding..." : "✓ Selected") 
                : isHovered 
                ? "Click to select"
                : "Provider"}
            </p>
          </div>

          {/* Status icon */}
          {isSelected && isActive ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isSendingResponse ? "text-green-400" : "text-accent"
              }`} />
            </motion.div>
          ) : isHovered ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              transition={{ duration: 0.15 }}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
            </motion.div>
          ) : null}
        </div>

        {/* Expanded info for selected card */}
        {isSelected && isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 pt-2 border-t border-border/50"
          >
            <div className="flex justify-between text-[8px] sm:text-[9px]">
              <div>
                <span className="text-foreground font-semibold">24ms</span>
                <span className="text-muted-foreground block">Latency</span>
              </div>
              <div className="text-right">
                <span className="text-green-400 font-semibold">99.99%</span>
                <span className="text-muted-foreground block">Uptime</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
});

ProviderCard.displayName = "ProviderCard";

// Provider Stack - Properly contained and aligned
const ProviderStack = memo(({
  isActive,
  selectedIndex,
  cards,
  isSendingResponse,
  onSelectProvider,
}: {
  isActive: boolean;
  selectedIndex: number;
  cards: string[];
  isSendingResponse: boolean;
  onSelectProvider: (index: number) => void;
}) => {
  const visibleCards = cards.slice(0, 8);

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      {/* Stack container - fixed dimensions for alignment */}
      <div className="relative h-[130px] sm:h-[145px] md:h-[160px] w-[140px] sm:w-[155px] md:w-[175px]">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent rounded-xl" />
        
        {/* Cards */}
        <div className="absolute top-3 left-0 right-0">
          {visibleCards.map((name, i) => (
            <ProviderCard
              key={name}
              name={name}
              index={i}
              isSelected={i === selectedIndex}
              isActive={isActive}
              isSendingResponse={isSendingResponse}
              totalCards={visibleCards.length}
              onSelect={onSelectProvider}
            />
          ))}
        </div>
      </div>
      
      {/* Label */}
      <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium mt-1">
        {isActive ? "Best Provider" : "Evaluating..."}
      </p>
    </div>
  );
});

ProviderStack.displayName = "ProviderStack";

// OriginX Core - Aligned center column
const OriginXCore = memo(({
  step,
}: {
  step: FlowStep;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isProcessing = step >= 2 && step < 4;
  const isResponding = step >= 4;

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative">
          {/* Glow effect */}
          <motion.div
            className="absolute -inset-3 sm:-inset-4 rounded-xl blur-lg"
            animate={{
              background: isProcessing
                ? "linear-gradient(135deg, hsl(var(--accent) / 0.4), hsl(var(--glow-secondary) / 0.3))"
                : isResponding
                ? "linear-gradient(135deg, hsl(142 76% 36% / 0.3), hsl(var(--accent) / 0.2))"
                : "linear-gradient(135deg, hsl(var(--accent) / 0.15), hsl(var(--glow-secondary) / 0.1))",
            }}
            transition={{ duration: 0.4 }}
            aria-hidden
          />

          <div
            className={`relative bg-card border-2 rounded-xl p-3 sm:p-4 transition-all duration-300 ${
              isProcessing 
                ? "border-accent/70 shadow-lg shadow-accent/25" 
                : isResponding 
                ? "border-green-400/60 shadow-lg shadow-green-400/20"
                : "border-border/50"
            }`}
          >
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              {/* Logo */}
              <motion.div
                className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                  isResponding 
                    ? "bg-gradient-to-br from-green-400/30 to-green-500/20 border-2 border-green-400/40" 
                    : "bg-gradient-to-br from-accent/30 to-purple-500/20 border-2 border-accent/40"
                }`}
                animate={
                  prefersReducedMotion
                    ? {}
                    : isProcessing
                    ? { rotate: [0, 8, -8, 0], scale: [1, 1.08, 1.08, 1] }
                    : isResponding
                    ? { scale: [1, 1.04, 1] }
                    : {}
                }
                transition={{ 
                  duration: isProcessing ? 0.6 : 1, 
                  repeat: isProcessing ? Infinity : isResponding ? Infinity : 0,
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

              {/* Title */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <OriginXLogoFilled size="sm" className="text-foreground" />
                  <h3 className="font-bold text-xs sm:text-sm">OriginX</h3>
                </div>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                  Unified API Layer
                </p>
              </div>

              {/* Feature icons */}
              <div className="flex gap-2 sm:gap-3" aria-hidden>
                {[
                  { icon: Shield, label: "Auth", active: step >= 2 },
                  { icon: Zap, label: "Fast", active: step >= 2 },
                  { icon: Route, label: "Route", active: step >= 3 },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    className={`flex flex-col items-center gap-0.5 text-[7px] sm:text-[8px] transition-colors duration-200 ${
                      item.active ? "text-accent" : "text-muted-foreground/60"
                    }`}
                    animate={
                      prefersReducedMotion || step !== 2
                        ? {}
                        : { scale: [1, 1.2, 1] }
                    }
                    transition={{ duration: 0.25, delay: idx * 0.08 }}
                  >
                    <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{item.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Status */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: step >= 2 ? 1 : 0 }}
                className="text-[9px] sm:text-[10px] font-medium"
              >
                {step === 2 && <span className="text-accent">Processing...</span>}
                {step === 3 && <span className="text-accent">Routing...</span>}
                {step >= 4 && <span className="text-green-400">✓ Complete</span>}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

OriginXCore.displayName = "OriginXCore";

// Request Box - Left column aligned
const RequestBox = memo(({
  step,
}: {
  step: FlowStep;
}) => {
  const isSending = step >= 1;
  const isComplete = step >= 5;

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className={`w-[130px] sm:w-[145px] md:w-[160px] bg-muted/60 rounded-xl p-2.5 sm:p-3 border-2 transition-all duration-300 ${
            isSending && !isComplete
              ? "border-accent/60 shadow-lg shadow-accent/20"
              : isComplete
              ? "border-green-400/60 shadow-lg shadow-green-400/20"
              : "border-border/50"
          }`}
        >
          {/* Terminal dots */}
          <div className="flex items-center gap-1 mb-2" aria-hidden>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400/70" />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400/70" />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400/70" />
          </div>

          {/* Code */}
          <pre className="font-mono text-[8px] sm:text-[9px] text-muted-foreground">
            <code>
              <motion.span
                className={isSending ? "text-accent font-bold" : "text-accent/60"}
                animate={step === 1 ? { opacity: [1, 0.4, 1] } : {}}
                transition={{ duration: 0.5, repeat: step === 1 ? Infinity : 0 }}
              >
                POST
              </motion.span>{" "}
              <span className="text-foreground/80">/v1/chat</span>
              {"\n"}
              <span className="text-muted-foreground/60 text-[7px]">Bearer: ox_live_...</span>
            </code>
          </pre>

          {/* Status indicator */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={isSending ? { opacity: 1, height: "auto" } : {}}
            className="mt-2 pt-2 border-t border-border/50"
          >
            <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px]">
              <motion.div
                className={`w-1.5 h-1.5 rounded-full ${
                  isComplete ? "bg-green-400" : step >= 1 ? "bg-accent" : "bg-muted-foreground"
                }`}
                animate={step >= 1 && !isComplete ? { scale: [1, 1.5, 1], opacity: [1, 0.7, 1] } : {}}
                transition={{ duration: 0.6, repeat: step >= 1 && !isComplete ? Infinity : 0 }}
              />
              <span className={isComplete ? "text-green-400 font-medium" : "text-muted-foreground"}>
                {isComplete ? "Done ✓" : step >= 1 ? "Sending..." : "Ready"}
              </span>
            </div>
          </motion.div>

          {/* Response */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 pt-2 border-t border-green-400/40"
            >
              <pre className="font-mono text-[8px] text-green-400 font-medium">
                <code>200 OK • 45ms</code>
              </pre>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      
      <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium mt-1.5">
        Your App
      </p>
    </div>
  );
});

RequestBox.displayName = "RequestBox";

// Main Component
export const ApiFlowDiagram = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState<FlowStep>(0);
  const [selectedProvider, setSelectedProvider] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const providerCards = useMemo(
    () => ["OpenAI", "Anthropic", "Google", "AWS", "Azure", "Stripe", "Twilio", "Vercel"],
    []
  );

  // Auto-play loop
  useEffect(() => {
    if (prefersReducedMotion || !isAutoPlaying) return;

    const interval = window.setInterval(() => {
      setStep((prev) => {
        const idx = LOOP_STEPS.indexOf(prev);
        return LOOP_STEPS[(idx + 1) % LOOP_STEPS.length];
      });
    }, STEP_MS);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, isAutoPlaying]);

  // Cycle provider on loop reset
  useEffect(() => {
    if (prefersReducedMotion || !isAutoPlaying) return;
    if (step === 0) {
      setSelectedProvider((p) => (p + 1) % providerCards.length);
    }
  }, [prefersReducedMotion, providerCards.length, step, isAutoPlaying]);

  // Handle manual provider selection
  const handleSelectProvider = useCallback((index: number) => {
    setIsAutoPlaying(false);
    setSelectedProvider(index);
    setStep(4); // Jump to selected state
    
    // Resume auto-play after 5 seconds
    const timeout = setTimeout(() => {
      setIsAutoPlaying(true);
      setStep(0);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const isSelecting = step >= 3;
  const isResponding = step >= 4;

  return (
    <div className="relative glass rounded-2xl p-4 sm:p-5 lg:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-8" aria-hidden />

      <div className="relative z-10">
        {/* Main 3-Column Flow */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-3">
          {/* Column 1: Request */}
          <RequestBox step={step} />

          {/* Arrow: Request → OriginX */}
          <DashedArrow 
            isActive={step >= 1 && step <= 3} 
            direction="right" 
            label="Request"
            color="accent"
          />

          {/* Column 2: OriginX Core */}
          <OriginXCore step={step} />

          {/* Arrow: OriginX → Provider */}
          <DashedArrow 
            isActive={step >= 3 && step <= 4} 
            direction="right"
            label="Route"
            color="accent"
          />

          {/* Column 3: Provider Stack */}
          <ProviderStack
            isActive={isSelecting}
            selectedIndex={selectedProvider}
            cards={providerCards}
            isSendingResponse={isResponding}
            onSelectProvider={handleSelectProvider}
          />
        </div>

        {/* Response Flow - Bidirectional */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isResponding ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.4 }}
          className="mt-4 sm:mt-5"
        >
          {/* Response Arrow Path */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
            <div className="flex items-center gap-1">
              <DashedArrow 
                isActive={step >= 4} 
                direction="left"
                label="Response"
                color="green"
              />
            </div>
          </div>

          {/* Response Stats */}
          <div className="flex items-center justify-center">
            <motion.div 
              className="flex items-center gap-3 sm:gap-5 bg-muted/50 rounded-lg px-4 py-2 border border-green-400/30"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <p className="text-base sm:text-lg font-bold text-green-400">200</p>
                <p className="text-[7px] sm:text-[8px] text-muted-foreground uppercase tracking-wider">Status</p>
              </div>
              <div className="h-6 w-px bg-border/60" />
              <div className="text-center">
                <p className="text-base sm:text-lg font-bold text-foreground">45ms</p>
                <p className="text-[7px] sm:text-[8px] text-muted-foreground uppercase tracking-wider">Latency</p>
              </div>
              <div className="h-6 w-px bg-border/60" />
              <div className="text-center">
                <p className="text-base sm:text-lg font-bold text-foreground truncate max-w-[70px]">
                  {providerCards[selectedProvider]}
                </p>
                <p className="text-[7px] sm:text-[8px] text-muted-foreground uppercase tracking-wider">Provider</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mt-5 pt-4 border-t border-border/50"
        >
          {[
            { value: "50+", label: "Providers" },
            { value: "<50ms", label: "Latency" },
            { value: "99.99%", label: "Uptime" },
            { value: "1B+", label: "API Calls" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg sm:text-xl font-bold text-gradient">{stat.value}</p>
              <p className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
});

ApiFlowDiagram.displayName = "ApiFlowDiagram";
