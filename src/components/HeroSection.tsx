import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book } from "lucide-react";
import { ApiFlowDiagram } from "./ApiFlowDiagram";
import { ScrollReveal } from "./ScrollReveal";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-radial-fade" />
      
      {/* Animated glow orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-glow-secondary/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <ScrollReveal delay={0.1}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Now in Public Beta
            </span>
          </ScrollReveal>

          {/* Main Headline */}
          <ScrollReveal delay={0.2}>
            <h1 className="text-display-lg md:text-display-xl mb-6">
              One API.{" "}
              <span className="text-gradient">Every Capability.</span>
            </h1>
          </ScrollReveal>

          {/* Subheadline */}
          <ScrollReveal delay={0.3}>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              Access AI, Payments, Messaging, Web, Finance, and more — through a single, unified API layer.
            </p>
          </ScrollReveal>

          {/* Supporting Line */}
          <ScrollReveal delay={0.4}>
            <p className="text-sm text-muted-foreground/70 mb-10">
              No more juggling keys. No more vendor lock-in. Just build.
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal delay={0.5}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
                Get API Key
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="hero-secondary" size="xl">
                <Book className="w-5 h-5" />
                View Documentation
              </Button>
            </div>
          </ScrollReveal>
        </div>

        {/* API Flow Diagram */}
        <ScrollReveal delay={0.7} className="mt-20 max-w-5xl mx-auto">
          <ApiFlowDiagram />
        </ScrollReveal>
      </div>
    </section>
  );
};
