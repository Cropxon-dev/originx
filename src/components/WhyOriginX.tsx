import { Key, CreditCard, Zap, Shield, Terminal, Layers } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const features = [
  {
    icon: Key,
    title: "One Unified API Key",
    description: "Replace dozens of vendor keys with one ox_live_* key. Manage everything from a single dashboard.",
  },
  {
    icon: CreditCard,
    title: "Transparent Metered Billing",
    description: "Pay only for what you use. Clear pricing, no hidden fees. Pass-through costs with minimal margin.",
  },
  {
    icon: Zap,
    title: "Intelligent Routing",
    description: "Automatic failover, load balancing, and smart provider selection based on cost, latency, and availability.",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "API key scoping, rate limiting, audit logs, and compliance-ready infrastructure out of the box.",
  },
  {
    icon: Layers,
    title: "Sandbox & Production",
    description: "Separate environments with ox_test_* and ox_live_* keys. Test safely, deploy confidently.",
  },
  {
    icon: Terminal,
    title: "Developer-First DX",
    description: "Beautiful SDKs, comprehensive docs, real-time logs, and a playground to test before you ship.",
  },
];

export const WhyOriginX = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="text-center mb-20">
          <h2 className="text-display mb-4">Why OriginX</h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Infrastructure-grade reliability with startup-level simplicity. Built for teams who move fast.
          </p>
        </ScrollReveal>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal
              key={feature.title}
              delay={index * 0.1}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-accent/30 transition-all duration-300">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-5 group-hover:bg-accent/10 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                
                {/* Content */}
                <h3 className="text-title text-lg mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
