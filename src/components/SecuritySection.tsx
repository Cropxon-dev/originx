import { Lock, Clock, FileText, Globe2, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const securityFeatures = [
  { icon: Lock, label: "API Key Scoping" },
  { icon: Clock, label: "Rate Limiting" },
  { icon: FileText, label: "Audit Logs" },
  { icon: Globe2, label: "Data Residency" },
  { icon: ShieldCheck, label: "Compliance Ready" },
];

export const SecuritySection = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-display mb-4">Enterprise Security</h2>
            <p className="text-body-lg text-muted-foreground">
              Built for teams that take security seriously. SOC 2 Type II compliant infrastructure.
            </p>
          </ScrollReveal>

          {/* Security Features */}
          <ScrollReveal delay={0.2} className="flex flex-wrap items-center justify-center gap-4">
            {securityFeatures.map((feature, index) => (
              <div
                key={feature.label}
                className="flex items-center gap-3 px-5 py-3 rounded-full glass border-border/50"
              >
                <feature.icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </ScrollReveal>

          {/* Billing Philosophy */}
          <ScrollReveal delay={0.4} className="mt-24 text-center">
            <h3 className="text-title mb-4">Simple, Transparent Pricing</h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Pay only for what you use. We charge pass-through costs from providers plus a minimal margin. 
              No hidden fees, no surprises, no vendor lock-in.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient">$0</p>
                <p className="text-sm text-muted-foreground">Platform fee</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient">Pay-as-you-go</p>
                <p className="text-sm text-muted-foreground">Metered billing</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient">100%</p>
                <p className="text-sm text-muted-foreground">Transparent</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
