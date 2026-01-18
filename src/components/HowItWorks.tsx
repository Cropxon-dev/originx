import { Send, Shield, Route, CheckCircle } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const steps = [
  {
    icon: Send,
    title: "Send Request",
    description: "Call api.originxcloud.com with your unified API key",
    code: 'fetch("https://api.originxcloud.com/v1/ai/chat")',
  },
  {
    icon: Shield,
    title: "Authenticate & Meter",
    description: "OriginX validates your key and tracks usage",
    code: "// ox_live_sk... validated ✓",
  },
  {
    icon: Route,
    title: "Intelligent Routing",
    description: "Best provider selected based on cost, latency, availability",
    code: "// Routing to optimal provider...",
  },
  {
    icon: CheckCircle,
    title: "Unified Response",
    description: "Receive standardized response format",
    code: '{ "data": {...}, "usage": { "tokens": 150 } }',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-20">
          <h2 className="text-display mb-4">How OriginX Works</h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            From request to response in milliseconds. One endpoint, infinite possibilities.
          </p>
        </ScrollReveal>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <ScrollReveal
                key={step.title}
                delay={index * 0.15}
                className="relative"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                )}
                
                <div className="glass rounded-xl p-6 h-full relative z-10 group hover:border-accent/30 transition-colors duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-accent-foreground text-xs font-bold">{index + 1}</span>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors duration-300">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                  
                  {/* Code Preview */}
                  <div className="code-block text-xs">
                    <code className="text-accent">{step.code}</code>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
