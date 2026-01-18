import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyOriginX } from "@/components/WhyOriginX";
import { ApiCategories } from "@/components/ApiCategories";
import { ProvidersSection } from "@/components/ProvidersSection";
import { PlaygroundTeaser } from "@/components/PlaygroundTeaser";
import { DocsLandingSection } from "@/components/DocsLandingSection";
import { SecuritySection } from "@/components/SecuritySection";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10 flex-1 pt-16">
        <section id="hero">
          <HeroSection />
        </section>
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="why">
          <WhyOriginX />
        </section>
        <section id="apis">
          <ApiCategories />
        </section>
        <section id="providers">
          <ProvidersSection />
        </section>
        <section id="playground">
          <PlaygroundTeaser />
        </section>
        <section id="docs">
          <DocsLandingSection />
        </section>
        <section id="security">
          <SecuritySection />
        </section>
        <section id="pricing">
          <CtaSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
