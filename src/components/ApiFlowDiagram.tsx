import { motion, useReducedMotion } from "framer-motion";
import { Zap, Shield, Route, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { OriginXLogoFilled } from "./OriginXLogo";

type FlowStep = 0 | 1 | 2 | 3 | 4;

const STEP_MS = 1300;
const LOOP_STEPS: FlowStep[] = [0, 1, 2, 3, 4];

// Animated Arrow Component with flowing particles
function AnimatedArrow({
  isActive,
  direction = "right",
  delay = 0,
  emphasis = "primary",
}: {
  isActive: boolean;
  direction?: "right" | "left" | "down";
  delay?: number;
  emphasis?: "primary" | "secondary";
}) {
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
          isHorizontal ? "w-20 md:w-24 lg:w-28" : "h-12"
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
        isHorizontal ? "w-20 md:w-24 lg:w-28" : "h-12"
      }`}
      style={{ willChange: "transform" }}
    >
      {/* Arrow line */}
      <motion.div
        initial={{ scaleX: 0, scaleY: 0 }}
        animate={{
          scaleX: isActive && isHorizontal ? 1 : isHorizontal ? 0 : 1,
          scaleY: isActive && !isHorizontal ? 1 : isHorizontal ? 1 : 0,
        }}
        transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
        className={`${
          isHorizontal ? "w-full h-0.5" : "w-0.5 h-full"
        } bg-gradient-to-${isHorizontal ? "r" : "b"} ${gradientClass} ${
          isHorizontal ? "origin-left" : "origin-top"
        } ${isReverse ? "-scale-x-100" : ""}`}
      />

      {/* Arrow head */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0 }}
        transition={{ duration: 0.25, delay: delay + 0.3 }}
        className={`absolute ${
          isHorizontal ? (isReverse ? "left-0" : "right-0") : "bottom-0"
        }`}
      >
        {direction === "right" && (
          <div className="w-0 h-0 border-l-[8px] border-l-accent border-y-[5px] border-y-transparent" />
        )}
        {direction === "left" && (
          <div className="w-0 h-0 border-r-[8px] border-r-accent border-y-[5px] border-y-transparent" />
        )}
        {direction === "down" && (
          <div className="w-0 h-0 border-t-[8px] border-t-accent border-x-[5px] border-x-transparent" />
        )}
      </motion.div>

      {/* Flowing particles */}
      {isActive && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-accent shadow-lg shadow-accent/30"
              initial={{
                [
                  isHorizontal
                    ? isReverse
                      ? "right"
                      : "left"
                    : "top"
                ]: 0,
                opacity: 0,
                scale: 0.6,
              }}
              animate={{
                [
                  isHorizontal
                    ? isReverse
                      ? "right"
                      : "left"
                    : "top"
                ]: "100%",
                opacity: [0, 1, 1, 0],
                scale: [0.6, 1, 1, 0.6],
              }}
              transition={{
                duration: 0.85,
                delay: delay + i * 0.14,
                repeat: Infinity,
                repeatDelay: 0.9,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

function ProviderStack({
  isActive,
  selectedLabel,
  cards,
}: {
  isActive: boolean;
  selectedLabel: string;
  cards: string[];
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative w-full lg:w-[320px]">
      <div className="relative h-[230px]">
        {cards.slice(0, 15).map((name, i) => {
          const isSelected = name === selectedLabel;
          const depth = Math.min(i, 12);

          const baseY = depth * 6;
          const baseScale = 1 - depth * 0.018;

          const selectedLift = isActive && isSelected ? -24 : 0;
          const selectedScale = isActive && isSelected ? 1.02 : 1;

          return (
            <motion.div
              key={name}
              className="absolute left-0 right-0"
              style={{
                top: 0,
                zIndex: 200 - depth,
                willChange: "transform",
              }}
              initial={false}
              animate={
                prefersReducedMotion
                  ? { y: baseY }
                  : {
                      y: baseY + selectedLift,
                      scale: baseScale * selectedScale,
                      rotate: isActive ? (isSelected ? 0 : -0.2) : 0,
                      opacity: 1,
                    }
              }
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 26,
                mass: 0.9,
              }}
            >
              <div
                className={`rounded-xl border bg-card/70 backdrop-blur-md px-3 py-2.5 flex items-center justify-between shadow-sm transition-colors ${
                  isSelected && isActive
                    ? "border-accent/50"
                    : "border-border/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-lg bg-gradient-to-br from-accent/25 to-glow-secondary/20 border border-border/40 flex items-center justify-center`}
                    aria-hidden
                  >
                    <span className="text-xs font-semibold text-foreground/90">
                      {name.slice(0, 1)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      Latency • Cost • Region
                    </p>
                  </div>
                </div>

                {isSelected && isActive ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="text-[10px] font-medium text-accent">
                      Selected
                    </span>
                  </motion.div>
                ) : (
                  <span className="text-[10px] text-muted-foreground">
                    Candidate
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export const ApiFlowDiagram = () => {
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
      "Postgres",
      "Vercel",
      "Notion",
      "Slack",
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

  const selectedLabel = providerCards[selectedProvider];

  const isSending = step >= 1;
  const isProcessing = step >= 2;
  const isSelecting = step >= 3;
  const isResponding = step >= 4;

  return (
    <div className="relative glass rounded-2xl p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />

      <div className="relative z-10">
        {/* Flow Container - Desktop Horizontal / Mobile Vertical */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0">
          {/* Developer Request */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-auto lg:flex-shrink-0"
          >
            <motion.div
              className={`bg-muted/40 rounded-xl p-3 sm:p-4 border transition-all duration-300 ${
                isSending
                  ? "border-accent/40 shadow-lg shadow-accent/10"
                  : "border-border/50"
              }`}
              animate={step === 1 ? { scale: [1, 1.012, 1] } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3" aria-hidden>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-muted-foreground/40" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-muted-foreground/40" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-muted-foreground/40" />
              </div>
              <pre className="font-mono text-[10px] sm:text-xs text-muted-foreground overflow-x-auto">
                <code>
                  <motion.span
                    className={isSending ? "text-accent" : "text-accent/60"}
                    animate={step === 1 ? { opacity: [1, 0.5, 1] } : {}}
                  >
                    POST
                  </motion.span>{" "}
                  <span className="hidden sm:inline">api.originxcloud.com</span>
                  <span className="sm:hidden">api.origin...</span>
                  /v1{"\n"}
                  <span className="text-muted-foreground/60 text-[9px] sm:text-xs">
                    Bearer ox_live_...
                  </span>
                </code>
              </pre>

              {/* Request indicator */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={isSending ? { opacity: 1, height: "auto" } : {}}
                className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border/50"
              >
                <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                  <motion.div
                    animate={step === 1 ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.6, repeat: step === 1 ? Infinity : 0 }}
                    className={`w-2 h-2 rounded-full ${
                      step >= 2 ? "bg-foreground/70" : "bg-accent"
                    }`}
                  />
                  <span className="text-muted-foreground">
                    {step === 1 ? "Sending…" : "Sent"}
                  </span>
                </div>
              </motion.div>
            </motion.div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3 text-center">
              Your Request
            </p>
          </motion.div>

          {/* Arrow 1 */}
          <div className="hidden lg:block">
            <AnimatedArrow
              isActive={step >= 1}
              direction="right"
              delay={0}
              emphasis="primary"
            />
          </div>
          <div className="lg:hidden">
            <AnimatedArrow
              isActive={step >= 1}
              direction="down"
              delay={0}
              emphasis="primary"
            />
          </div>

          {/* OriginX Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0"
          >
            <motion.div
              className="relative"
              animate={step === 2 ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                className="absolute -inset-3 sm:-inset-4 rounded-2xl blur-xl"
                animate={{
                  background:
                    step >= 2
                      ? "linear-gradient(135deg, hsl(var(--accent) / 0.35), hsl(var(--glow-secondary) / 0.25))"
                      : "linear-gradient(135deg, hsl(var(--accent) / 0.18), hsl(var(--glow-secondary) / 0.12))",
                }}
                transition={{ duration: 0.35 }}
                aria-hidden
              />

              <div
                className={`relative bg-card border rounded-xl p-4 sm:p-6 transition-all duration-300 ${
                  step >= 2 ? "border-accent/45" : "border-border/50"
                }`}
              >
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-accent/20 to-glow-secondary/15 border border-border/50 flex items-center justify-center"
                    animate={
                      step === 2
                        ? { rotate: [0, 10, -10, 0], scale: [1, 1.06, 1] }
                        : {}
                    }
                    transition={{ duration: 0.9, repeat: step === 2 ? Infinity : 0 }}
                    style={{ willChange: "transform" }}
                  >
                    <motion.div
                      animate={step >= 1 ? { opacity: [0.85, 1, 0.85] } : {}}
                      transition={{ duration: 1.2, repeat: step >= 1 ? Infinity : 0 }}
                    >
                      <OriginXLogoFilled size="md" className="text-foreground" />
                    </motion.div>
                  </motion.div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <OriginXLogoFilled size="sm" className="text-foreground" />
                      <h3 className="font-semibold text-xs sm:text-sm">OriginX</h3>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                      Unified API Layer
                    </p>
                  </div>

                  {/* Processing indicators */}
                  <div className="flex gap-2 sm:gap-3" aria-hidden>
                    {[
                      { icon: Shield, label: "Auth", delay: 0 },
                      { icon: Zap, label: "Meter", delay: 0.08 },
                      { icon: Route, label: "Route", delay: 0.16 },
                    ].map((item) => (
                      <motion.div
                        key={item.label}
                        className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground"
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
                        transition={{ duration: 0.6, delay: item.delay }}
                      >
                        <motion.div
                          animate={step === 2 ? { scale: [1, 1.18, 1] } : {}}
                          transition={{ duration: 0.45, delay: item.delay + 0.12 }}
                        >
                          <item.icon
                            className={`w-3 h-3 ${step >= 2 ? "text-accent" : ""}`}
                          />
                        </motion.div>
                        <span className="hidden sm:inline">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Processing status */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={step >= 2 ? { opacity: 1, height: "auto" } : {}}
                    className="text-[10px] sm:text-xs text-center"
                  >
                    <motion.span
                      animate={
                        step === 2 ? { opacity: [1, 0.55, 1] } : {}
                      }
                      transition={{ duration: 0.75, repeat: step === 2 ? Infinity : 0 }}
                      className="text-accent"
                    >
                      {step === 2
                        ? "Processing…"
                        : step > 2
                          ? "✓ Routed"
                          : ""}
                    </motion.span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Arrow 2 */}
          <div className="hidden lg:block">
            <AnimatedArrow
              isActive={step >= 3}
              direction="right"
              delay={0.05}
              emphasis="secondary"
            />
          </div>
          <div className="lg:hidden">
            <AnimatedArrow
              isActive={step >= 3}
              direction="down"
              delay={0.05}
              emphasis="secondary"
            />
          </div>

          {/* Providers Stack */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-auto lg:flex-shrink-0"
          >
            <ProviderStack
              isActive={isSelecting}
              selectedLabel={selectedLabel}
              cards={providerCards}
            />
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3 text-center">
              {isSelecting ? "Best Provider Selected" : "Evaluating providers…"}
            </p>
          </motion.div>
        </div>

        {/* Response Flow (return arrow) */}
        <div className="mt-4 sm:mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isResponding ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                Response
              </span>
              <span className="text-xs sm:text-sm font-medium text-accent">
                200 OK
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">
                • 45ms • 1,247 tokens
              </span>
            </div>

            <div className="mt-3 flex items-center justify-center w-full">
              <div className="hidden lg:block">
                <AnimatedArrow
                  isActive={isResponding}
                  direction="left"
                  delay={0}
                  emphasis="primary"
                />
              </div>
              <div className="lg:hidden">
                <AnimatedArrow
                  isActive={isResponding}
                  direction="down"
                  delay={0}
                  emphasis="primary"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/50"
        >
          {[
            { value: "50+", label: "Providers" },
            { value: "<50ms", label: "Latency" },
            { value: "99.99%", label: "Uptime" },
            { value: "1B+", label: "Requests" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg sm:text-2xl font-bold text-gradient">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
