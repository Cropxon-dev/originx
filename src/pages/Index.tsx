import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyOriginX } from "@/components/WhyOriginX";
import { ApiCategories } from "@/components/ApiCategories";
import { PlaygroundTeaser } from "@/components/PlaygroundTeaser";
import { SecuritySection } from "@/components/SecuritySection";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <WhyOriginX />
        <ApiCategories />
        <PlaygroundTeaser />
        <SecuritySection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
