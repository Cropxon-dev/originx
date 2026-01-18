import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Sparkles } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { useNavigate } from "react-router-dom";
import { OriginXLogo } from "./OriginXLogo";

export const CtaSection = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-radial-fade opacity-50" />
      {!prefersReducedMotion && (
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"
        />
      )}

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Join 1,000+ developers building with</span>
            <OriginXLogo size="sm" animate={false} showText />
          </div>

          <h2 className="text-display-lg mb-6">
            Start building in minutes.
          </h2>

          <p className="text-body-lg text-muted-foreground mb-10">
            Get your API key, explore the docs, and ship your first integration today.
            No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
              Create Account
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="hero-secondary" size="xl">
              <Book className="w-5 h-5" />
              Read Docs
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
