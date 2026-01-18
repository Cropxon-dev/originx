import { motion, useReducedMotion } from "framer-motion";
import { Zap, Shield, Route, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState, memo, useCallback } from "react";
import { OriginXLogoFilled } from "./OriginXLogo";

type FlowStep = 0 | 1 | 2 | 3 | 4;

const STEP_MS = 1400;
const LOOP_STEPS: FlowStep[] = [0, 1, 2, 3, 4];

// Memoized Arrow Component
const AnimatedArrow = memo(({
  isActive,
  direction = "right",
  delay = 0,
  emphasis = "primary",
}: {
  isActive: boolean;
  direction?: "right" | "left" | "down";
  delay?: number;
  emphasis?: "primary" | "secondary";
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isHorizontal = direction === "right" || direction === "left";
  const isReverse = direction === "left";

  const gradientClass =
    emphasis === "primary"
      ? "from-accent to-glow-secondary"
      : "from-glow-secondary to-muted-foreground";

  if (prefersReducedMotion) {
    return (
      <div
        className={`relative flex items-center justify-center ${
          isHorizontal ? "w-16 md:w-20 lg:w-24" : "h-10"
        }`}
      >
        <div
          className={`${
            isHorizontal ? "w-full h-0.5" : "w-0.5 h-full"
          } bg-gradient-to-${isHorizontal ? "r" : "b"} ${gradientClass} opacity-40`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center ${
        isHorizontal ? "w-16 md:w-20 lg:w-24" : "h-10"
      }`}
      style={{ willChange: "transform" }}
    >
      <motion.div
        initial={{ scaleX: 0, scaleY: 0 }}
        animate={{
          scaleX: isActive && isHorizontal ? 1 : isHorizontal ? 0 : 1,
          scaleY: isActive && !isHorizontal ? 1 : isHorizontal ? 1 : 0,
        }}
        transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
        className={`${
          isHorizontal ? "w-full h-0.5" : "w-0.5 h-full"
        } bg-gradient-to-${isHorizontal ? "r" : "b"} ${gradientClass} ${
          isHorizontal ? "origin-left" : "origin-top"
        } ${isReverse ? "-scale-x-100" : ""}`}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0 }}
        transition={{ duration: 0.2, delay: delay + 0.25 }}
        className={`absolute ${
          isHorizontal ? (isReverse ? "left-0" : "right-0") : "bottom-0"
        }`}
      >
        {direction === "right" && (
          <div className="w-0 h-0 border-l-[6px] border-l-accent border-y-[4px] border-y-transparent" />
        )}
        {direction === "left" && (
          <div className="w-0 h-0 border-r-[6px] border-r-accent border-y-[4px] border-y-transparent" />
        )}
        {direction === "down" && (
          <div className="w-0 h-0 border-t-[6px] border-t-accent border-x-[4px] border-x-transparent" />
        )}
      </motion.div>

      {isActive && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-accent shadow-sm shadow-accent/30"
              initial={{
                [isHorizontal ? (isReverse ? "right" : "left") : "top"]: 0,
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                [isHorizontal ? (isReverse ? "right" : "left") : "top"]: "100%",
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 1, 0.5],
              }}
              transition={{
                duration: 0.7,
                delay: delay + i * 0.12,
                repeat: Infinity,
                repeatDelay: 0.8,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
});

AnimatedArrow.displayName = "AnimatedArrow";

// Provider Card Stack with proper staggered animation
const ProviderStack = memo(({
  isActive,
  selectedIndex,
  cards,
}: {
  isActive: boolean;
  selectedIndex: number;
  cards: string[];
}) => {
  const prefersReducedMotion = useReducedMotion();
  const visibleCards = cards.slice(0, 12);

  return (
    <div className="relative w-full lg:w-[280px]">
      <div className="relative h-[200px] overflow-visible">
        {visibleCards.map((name, i) => {
          const isSelected = i === selectedIndex;
          const depth = i;
          
          // Stack cards with proper offset
          const baseY = depth * 5;
          const baseScale = 1 - depth * 0.015;
          const baseOpacity = 1 - depth * 0.06;

          // Selected card rises up
          const selectedLift = isActive && isSelected ? -18 : 0;
          const selectedScale = isActive && isSelected ? 1.03 : 1;
          const selectedGlow = isActive && isSelected;

          return (
            <motion.div
              key={name}
              className="absolute left-0 right-0 mx-auto"
              style={{
                top: 0,
                zIndex: 100 - depth + (isSelected && isActive ? 50 : 0),
                willChange: "transform",
              }}
              initial={prefersReducedMotion ? { y: baseY } : { opacity: 0, y: baseY + 20 }}
              animate={
                prefersReducedMotion
                  ? { y: baseY + selectedLift }
                  : {
                      y: baseY + selectedLift,
                      scale: baseScale * selectedScale,
                      opacity: baseOpacity,
                    }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0.2 }
                  : {
                      type: "spring",
                      stiffness: 280,
                      damping: 24,
                      mass: 0.8,
                      delay: isActive ? 0 : i * 0.04,
                    }
              }
            >
              <div
                className={`rounded-lg border px-3 py-2 flex items-center justify-between transition-all duration-200 ${
                  selectedGlow
                    ? "bg-card border-accent/50 shadow-lg shadow-accent/15"
                    : "bg-card/80 border-border/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-md bg-gradient-to-br from-accent/20 to-glow-secondary/15 border border-border/40 flex items-center justify-center"
                    aria-hidden
                  >
                    <span className="text-[10px] font-semibold text-foreground/80">
                      {name.slice(0, 1)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium truncate">{name}</p>
                    <p className="text-[9px] text-muted-foreground truncate">
                      {isSelected && isActive ? "Best match" : "Candidate"}
                    </p>
                  </div>
                </div>

                {isSelected && isActive && (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

ProviderStack.displayName = "ProviderStack";

export const ApiFlowDiagram = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState<FlowStep>(0);
  const [selectedProvider, setSelectedProvider] = useState(0);

  const providerCards = useMemo(
    () => [
      "OpenAI",
      "Stripe",
      "Twilio",
      "AWS",
      "Anthropic",
      "Google",
      "Azure",
      "Cloudflare",
      "SendGrid",
      "Pinecone",
      "MongoDB",
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
    if (step === 3) {
      setSelectedProvider((p) => (p + 1) % providerCards.length);
    }
  }, [prefersReducedMotion, providerCards.length, step]);

  const isSending = step >= 1;
  const isProcessing = step >= 2;
  const isSelecting = step >= 3;
  const isResponding = step >= 4;

  return (
    <div className="relative glass rounded-2xl p-4 sm:p-5 lg:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-15" aria-hidden />

      <div className="relative z-10">
        {/* Flow Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-2">
          {/* Developer Request */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-auto lg:flex-shrink-0"
          >
            <motion.div
              className={`bg-muted/40 rounded-lg p-3 border transition-all duration-200 ${
                isSending ? "border-accent/40 shadow-md shadow-accent/10" : "border-border/50"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-2" aria-hidden>
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
              </div>
              <pre className="font-mono text-[10px] text-muted-foreground overflow-x-auto">
                <code>
                  <motion.span
                    className={isSending ? "text-accent" : "text-accent/60"}
                    animate={step === 1 ? { opacity: [1, 0.5, 1] } : {}}
                  >
                    POST
                  </motion.span>{" "}
                  api.originxcloud.com/v1{"\n"}
                  <span className="text-muted-foreground/60 text-[9px]">Bearer ox_live_...</span>
                </code>
              </pre>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={isSending ? { opacity: 1, height: "auto" } : {}}
                className="mt-2 pt-2 border-t border-border/50"
              >
                <div className="flex items-center gap-2 text-[10px]">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      step >= 2 ? "bg-foreground/70" : "bg-accent animate-pulse"
                    }`}
                  />
                  <span className="text-muted-foreground">{step === 1 ? "Sending…" : "Sent"}</span>
                </div>
              </motion.div>
            </motion.div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">Your Request</p>
          </motion.div>

          {/* Arrow 1 */}
          <div className="hidden lg:block">
            <AnimatedArrow isActive={step >= 1} direction="right" emphasis="primary" />
          </div>
          <div className="lg:hidden">
            <AnimatedArrow isActive={step >= 1} direction="down" emphasis="primary" />
          </div>

          {/* OriginX Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0"
          >
            <motion.div className="relative">
              <motion.div
                className="absolute -inset-2 sm:-inset-3 rounded-xl blur-lg"
                animate={{
                  background:
                    step >= 2
                      ? "linear-gradient(135deg, hsl(var(--accent) / 0.3), hsl(var(--glow-secondary) / 0.2))"
                      : "linear-gradient(135deg, hsl(var(--accent) / 0.15), hsl(var(--glow-secondary) / 0.1))",
                }}
                transition={{ duration: 0.3 }}
                aria-hidden
              />

              <div
                className={`relative bg-card border rounded-lg p-3 sm:p-4 transition-all duration-200 ${
                  step >= 2 ? "border-accent/40" : "border-border/50"
                }`}
              >
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                  <motion.div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-accent/20 to-glow-secondary/15 border border-border/50 flex items-center justify-center"
                    animate={
                      step === 2
                        ? { rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }
                        : {}
                    }
                    transition={{ duration: 0.8, repeat: step === 2 ? Infinity : 0 }}
                  >
                    <OriginXLogoFilled size="sm" className="text-foreground" />
                  </motion.div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <OriginXLogoFilled size="sm" className="text-foreground" />
                      <h3 className="font-semibold text-[11px] sm:text-xs">OriginX</h3>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">
                      Unified API Layer
                    </p>
                  </div>

                  <div className="flex gap-2" aria-hidden>
                    {[
                      { icon: Shield, label: "Auth" },
                      { icon: Zap, label: "Meter" },
                      { icon: Route, label: "Route" },
                    ].map((item, idx) => (
                      <motion.div
                        key={item.label}
                        className="flex items-center gap-1 text-[9px] text-muted-foreground"
                        animate={
                          step === 2
                            ? {
                                color: [
                                  "hsl(var(--muted-foreground))",
                                  "hsl(var(--accent))",
                                  "hsl(var(--muted-foreground))",
                                ],
                              }
                            : {}
                        }
                        transition={{ duration: 0.5, delay: idx * 0.08 }}
                      >
                        <item.icon className={`w-2.5 h-2.5 ${step >= 2 ? "text-accent" : ""}`} />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={step >= 2 ? { opacity: 1, height: "auto" } : {}}
                    className="text-[9px] sm:text-[10px] text-center"
                  >
                    <span className="text-accent">
                      {step === 2 ? "Processing…" : step > 2 ? "✓ Routed" : ""}
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Arrow 2 */}
          <div className="hidden lg:block">
            <AnimatedArrow isActive={step >= 3} direction="right" delay={0.03} emphasis="secondary" />
          </div>
          <div className="lg:hidden">
            <AnimatedArrow isActive={step >= 3} direction="down" delay={0.03} emphasis="secondary" />
          </div>

          {/* Providers Stack */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-auto lg:flex-shrink-0"
          >
            <ProviderStack isActive={isSelecting} selectedIndex={selectedProvider} cards={providerCards} />
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              {isSelecting ? "Best Provider Selected" : "Evaluating providers…"}
            </p>
          </motion.div>
        </div>

        {/* Response Flow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isResponding ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          className="mt-4 flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-3 text-[10px] sm:text-xs">
            <span className="text-muted-foreground">Response</span>
            <span className="font-medium text-accent">200 OK</span>
            <span className="text-muted-foreground hidden sm:inline">• 45ms</span>
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-5 pt-4 border-t border-border/50"
        >
          {[
            { value: "50+", label: "Providers" },
            { value: "<50ms", label: "Latency" },
            { value: "99.99%", label: "Uptime" },
            { value: "1B+", label: "Requests" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-base sm:text-lg font-bold text-gradient">{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
});

ApiFlowDiagram.displayName = "ApiFlowDiagram";
