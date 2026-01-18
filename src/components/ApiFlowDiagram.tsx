import { motion, useReducedMotion } from "framer-motion";
import { Zap, Shield, Route, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
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
          className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
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
            duration: 0.8,
            delay: delay + i * 0.15,
            repeat: Infinity,
            repeatDelay: 1.2,
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
    <div className="relative flex flex-col items-center justify-center w-20 sm:w-28 md:w-36 lg:w-44">
      {label && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          className={`text-[9px] sm:text-[10px] font-medium mb-1 ${
            isReverse ? "text-green-400" : "text-accent"
          }`}
        >
          {label}
        </motion.span>
      )}
      
      <div className="relative w-full h-8 flex items-center justify-center">
        {/* Arrow line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0.3 }}
          transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute w-full h-1 sm:h-1.5 rounded-full bg-gradient-to-r ${colorClass} ${
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
            <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 text-green-400`} />
          ) : (
            <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 text-accent`} />
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

// Provider Card with enhanced visibility
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
  
  // Calculate stack position - cards stacked in center
  const offsetY = index * 6;
  const offsetX = 0;
  const scale = 1 - index * 0.02;
  const zIndex = totalCards - index + (isSelected && isActive ? 100 : 0);
  
  // Selected card pops up
  const selectedLift = isActive && isSelected ? -25 : 0;
  const selectedScale = isActive && isSelected ? 1.08 : 1;

  const getCardColor = () => {
    const colors = [
      "from-blue-500/20 to-blue-600/10",
      "from-purple-500/20 to-purple-600/10",
      "from-green-500/20 to-green-600/10",
      "from-orange-500/20 to-orange-600/10",
      "from-pink-500/20 to-pink-600/10",
      "from-cyan-500/20 to-cyan-600/10",
      "from-yellow-500/20 to-yellow-600/10",
      "from-red-500/20 to-red-600/10",
      "from-indigo-500/20 to-indigo-600/10",
      "from-teal-500/20 to-teal-600/10",
      "from-lime-500/20 to-lime-600/10",
      "from-rose-500/20 to-rose-600/10",
    ];
    return colors[index % colors.length];
  };

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        zIndex,
        willChange: "transform",
      }}
      initial={prefersReducedMotion ? { y: offsetY } : { opacity: 0, y: offsetY + 30 }}
      animate={{
        y: offsetY + selectedLift,
        x: offsetX,
        scale: scale * selectedScale,
        opacity: isActive ? (isSelected ? 1 : 0.85 - index * 0.05) : 0.6 - index * 0.04,
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0.2 }
          : {
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.8,
            }
      }
    >
      <div
        className={`w-44 sm:w-52 md:w-60 rounded-xl border-2 p-3 sm:p-4 transition-all duration-300 ${
          isSelected && isActive
            ? "bg-card border-accent shadow-xl shadow-accent/25"
            : "bg-card/90 border-border/60"
        } ${isSendingResponse && isSelected ? "ring-2 ring-green-400/50" : ""}`}
      >
        <div className="flex items-center gap-3">
          {/* Provider icon */}
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${getCardColor()} border border-border/50 flex items-center justify-center`}
          >
            <span className="text-sm sm:text-base font-bold text-foreground">
              {name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-semibold truncate">{name}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {isSelected && isActive ? (isSendingResponse ? "Responding..." : "Best match") : "Provider"}
            </p>
          </div>

          {isSelected && isActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <CheckCircle2 className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isSendingResponse ? "text-green-400" : "text-accent"
              }`} />
            </motion.div>
          )}
        </div>

        {/* Latency indicator for selected card */}
        {isSelected && isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 pt-2 border-t border-border/50 flex justify-between text-[10px] text-muted-foreground"
          >
            <span>Latency: <span className="text-foreground">23ms</span></span>
            <span>Uptime: <span className="text-green-400">99.99%</span></span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

ProviderCard.displayName = "ProviderCard";

// Provider Stack Component
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
  const visibleCards = cards.slice(0, 12);

  return (
    <div className="relative w-full flex justify-center">
      <div className="relative h-[280px] sm:h-[320px] md:h-[360px] w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px]">
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
  );
});

ProviderStack.displayName = "ProviderStack";

// OriginX Core Component
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
          className="absolute -inset-4 sm:-inset-6 rounded-2xl blur-xl"
          animate={{
            background: isProcessing
              ? "linear-gradient(135deg, hsl(var(--accent) / 0.4), hsl(var(--glow-secondary) / 0.3))"
              : isResponding
              ? "linear-gradient(135deg, hsl(142 76% 36% / 0.3), hsl(var(--accent) / 0.2))"
              : "linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--glow-secondary) / 0.15))",
          }}
          transition={{ duration: 0.4 }}
          aria-hidden
        />

        <div
          className={`relative bg-card border-2 rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
            isProcessing 
              ? "border-accent/60 shadow-lg shadow-accent/20" 
              : isResponding 
              ? "border-green-400/50 shadow-lg shadow-green-400/15"
              : "border-border/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            {/* Animated Logo */}
            <motion.div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-accent/30 to-purple-500/20 border-2 border-accent/30 flex items-center justify-center"
              animate={
                prefersReducedMotion
                  ? {}
                  : isProcessing
                  ? { 
                      rotate: [0, 5, -5, 0], 
                      scale: [1, 1.05, 1.05, 1],
                    }
                  : isResponding
                  ? { scale: [1, 1.02, 1] }
                  : {}
              }
              transition={{ 
                duration: isProcessing ? 0.6 : 0.8, 
                repeat: isProcessing ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <OriginXLogoFilled 
                size="lg" 
                className={`transition-colors duration-300 ${
                  isResponding ? "text-green-400" : "text-foreground"
                }`} 
              />
            </motion.div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <OriginXLogoFilled size="sm" className="text-foreground" />
                <h3 className="font-bold text-base sm:text-lg">OriginX</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Unified API Layer
              </p>
            </div>

            {/* Feature icons */}
            <div className="flex gap-3 sm:gap-4" aria-hidden>
              {[
                { icon: Shield, label: "Auth", active: step >= 2 },
                { icon: Zap, label: "Meter", active: step >= 2 },
                { icon: Route, label: "Route", active: step >= 3 },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  className={`flex flex-col items-center gap-1 text-[10px] sm:text-xs transition-colors duration-200 ${
                    item.active ? "text-accent" : "text-muted-foreground"
                  }`}
                  animate={
                    prefersReducedMotion
                      ? {}
                      : step === 2
                      ? { scale: [1, 1.1, 1] }
                      : {}
                  }
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Status indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 2 ? 1 : 0 }}
              className="text-xs sm:text-sm font-medium text-center"
            >
              {step === 2 && <span className="text-accent">Processing...</span>}
              {step === 3 && <span className="text-accent">Routing...</span>}
              {step === 4 && <span className="text-green-400">✓ Response Ready</span>}
              {step === 5 && <span className="text-green-400">✓ Delivered</span>}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

OriginXCore.displayName = "OriginXCore";

// Developer Request Box
const RequestBox = memo(({
  step,
}: {
  step: FlowStep;
}) => {
  const isSending = step >= 1;
  const isComplete = step >= 5;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[220px] sm:max-w-[260px]"
    >
      <motion.div
        className={`bg-muted/50 rounded-xl p-4 border-2 transition-all duration-300 ${
          isSending && !isComplete
            ? "border-accent/50 shadow-lg shadow-accent/15"
            : isComplete
            ? "border-green-400/50 shadow-lg shadow-green-400/15"
            : "border-border/50"
        }`}
      >
        {/* Terminal dots */}
        <div className="flex items-center gap-1.5 mb-3" aria-hidden>
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>

        {/* Request code */}
        <pre className="font-mono text-[10px] sm:text-xs text-muted-foreground overflow-x-auto">
          <code>
            <motion.span
              className={isSending ? "text-accent font-semibold" : "text-accent/60"}
              animate={step === 1 ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 0.5, repeat: step === 1 ? Infinity : 0 }}
            >
              POST
            </motion.span>{" "}
            <span className="text-foreground/80">/v1/chat</span>
            {"\n"}
            <span className="text-muted-foreground/70">Authorization: ox_live_...</span>
          </code>
        </pre>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={isSending ? { opacity: 1, height: "auto" } : {}}
          className="mt-3 pt-3 border-t border-border/50"
        >
          <div className="flex items-center gap-2 text-xs">
            <motion.div
              className={`w-2 h-2 rounded-full ${
                isComplete
                  ? "bg-green-400"
                  : step >= 1
                  ? "bg-accent"
                  : "bg-muted-foreground"
              }`}
              animate={step >= 1 && !isComplete ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.6, repeat: step >= 1 && !isComplete ? Infinity : 0 }}
            />
            <span className={isComplete ? "text-green-400" : "text-muted-foreground"}>
              {isComplete ? "Response received" : step >= 1 ? "Sending..." : "Ready"}
            </span>
          </div>
        </motion.div>

        {/* Response preview */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={isComplete ? { opacity: 1, height: "auto" } : {}}
          className="mt-3 pt-3 border-t border-green-400/30"
        >
          <pre className="font-mono text-[10px] text-green-400">
            <code>
              {"{"} "status": 200, "latency": "45ms" {"}"}
            </code>
          </pre>
        </motion.div>
      </motion.div>
      <p className="text-xs text-muted-foreground mt-3 text-center font-medium">
        Your Application
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
      "Google Cloud",
      "AWS",
      "Azure",
      "Stripe",
      "Twilio",
      "SendGrid",
      "Cloudflare",
      "MongoDB",
      "Pinecone",
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
  const isComplete = step >= 5;

  return (
    <div className="relative glass rounded-2xl p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" aria-hidden />

      <div className="relative z-10">
        {/* Main Flow - Horizontal on desktop, vertical on mobile */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-4">
          
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

        {/* Response Flow - Shows when responding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isResponding ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6 sm:mt-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
            {/* Response path visualization */}
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-medium text-green-400">Response Flow</span>
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatedArrow 
                  isActive={step >= 4} 
                  direction="left" 
                  label=""
                />
              </motion.div>
            </div>

            {/* Response stats */}
            <div className="flex items-center gap-4 sm:gap-6 bg-muted/30 rounded-lg px-4 py-2 border border-green-400/20">
              <div className="text-center">
                <p className="text-lg sm:text-xl font-bold text-green-400">200</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Status</p>
              </div>
              <div className="h-8 w-px bg-border/50" />
              <div className="text-center">
                <p className="text-lg sm:text-xl font-bold text-foreground">45ms</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Latency</p>
              </div>
              <div className="h-8 w-px bg-border/50" />
              <div className="text-center">
                <p className="text-lg sm:text-xl font-bold text-foreground">{providerCards[selectedProvider]}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Provider</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 pt-6 border-t border-border/50"
        >
          {[
            { value: "50+", label: "Providers" },
            { value: "<50ms", label: "Avg Latency" },
            { value: "99.99%", label: "Uptime" },
            { value: "1B+", label: "API Calls" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-gradient">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
});

ApiFlowDiagram.displayName = "ApiFlowDiagram";
