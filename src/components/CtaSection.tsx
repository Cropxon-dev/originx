import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Sparkles } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { useNavigate } from "react-router-dom";

export const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-radial-fade opacity-50" />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            Join 1,000+ developers building with OriginX
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
