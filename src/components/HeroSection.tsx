import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book } from "lucide-react";
import { ApiFlowDiagram } from "./ApiFlowDiagram";
import { ScrollReveal } from "./ScrollReveal";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 overflow-hidden px-2 sm:px-4 md:px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-radial-fade" aria-hidden />

      {/* Calm glow effects */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.16, 0.28, 0.16] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-accent/15 rounded-full blur-3xl transform-gpu"
            style={{ willChange: "transform, opacity" }}
            aria-hidden
          />
          <motion.div
            animate={{ scale: [1.06, 1, 1.06], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-glow-secondary/15 rounded-full blur-3xl transform-gpu"
            style={{ willChange: "transform, opacity" }}
            aria-hidden
          />
        </>
      )}

      <div className="w-full max-w-7xl mx-auto relative z-10 px-1 sm:px-2">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <ScrollReveal delay={0.1}>
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent animate-pulse" />
              Now in Public Beta
            </span>
          </ScrollReveal>

          {/* Main Headline */}
          <ScrollReveal delay={0.2}>
            <h1 className="text-3xl sm:text-4xl md:text-display-lg lg:text-display-xl mb-4 sm:mb-6">
              One API.{" "}
              <span className="text-gradient">Every Capability.</span>
            </h1>
          </ScrollReveal>

          {/* Subheadline */}
          <ScrollReveal delay={0.3}>
            <p className="text-sm sm:text-base lg:text-body-lg text-muted-foreground max-w-2xl mx-auto mb-3 sm:mb-4 px-2">
              Access AI, Payments, Messaging, Web, Finance, and more — through a single, unified API layer.
            </p>
          </ScrollReveal>

          {/* Supporting Line */}
          <ScrollReveal delay={0.4}>
            <p className="text-xs sm:text-sm text-muted-foreground/70 mb-8 sm:mb-10">
              No more juggling keys. No more vendor lock-in. Just build.
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal delay={0.5}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate("/auth")}
                className="w-full sm:w-auto"
              >
                Get API Key
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button variant="hero-secondary" size="xl" className="w-full sm:w-auto">
                <Book className="w-4 h-4 sm:w-5 sm:h-5" />
                View Documentation
              </Button>
            </div>
          </ScrollReveal>
        </div>

        {/* API Flow Diagram - Full width with minimal padding */}
        <ScrollReveal delay={0.7} className="mt-10 sm:mt-14 lg:mt-16 w-full">
          <ApiFlowDiagram />
        </ScrollReveal>
      </div>
    </section>
  );
};

