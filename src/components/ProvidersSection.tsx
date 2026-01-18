import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import { Globe, Clock, Activity, CheckCircle2, Server } from "lucide-react";
import { OriginXLogoFilled } from "./OriginXLogo";

interface Provider {
  name: string;
  category: string;
  latency: string;
  uptime: string;
  regions: string[];
  gradient: string;
}

const providers: Provider[] = [
  { name: "OpenAI", category: "AI & ML", latency: "45ms", uptime: "99.99%", regions: ["US", "EU", "APAC"], gradient: "from-emerald-500 to-emerald-600" },
  { name: "Anthropic", category: "AI & ML", latency: "52ms", uptime: "99.98%", regions: ["US", "EU"], gradient: "from-amber-500 to-orange-500" },
  { name: "Google AI", category: "AI & ML", latency: "38ms", uptime: "99.99%", regions: ["US", "EU", "APAC"], gradient: "from-blue-500 to-indigo-500" },
  { name: "Stripe", category: "Payments", latency: "120ms", uptime: "99.99%", regions: ["Global"], gradient: "from-violet-500 to-purple-600" },
  { name: "Twilio", category: "Communication", latency: "85ms", uptime: "99.95%", regions: ["US", "EU", "APAC"], gradient: "from-red-500 to-rose-500" },
  { name: "AWS", category: "Cloud", latency: "25ms", uptime: "99.99%", regions: ["Global"], gradient: "from-orange-500 to-amber-500" },
  { name: "SendGrid", category: "Email", latency: "150ms", uptime: "99.97%", regions: ["US", "EU"], gradient: "from-blue-400 to-cyan-500" },
  { name: "Pinecone", category: "Vector DB", latency: "35ms", uptime: "99.95%", regions: ["US", "EU"], gradient: "from-teal-500 to-emerald-500" },
];

const ProviderCard = memo(({ provider, index }: { provider: Provider; index: number }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.02 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-glow-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
      
      <div className="relative glass rounded-2xl p-5 border border-border/50 hover:border-accent/40 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${provider.gradient} flex items-center justify-center shadow-lg`}>
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{provider.name}</h3>
              <p className="text-[11px] text-muted-foreground">{provider.category}</p>
            </div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="font-mono text-foreground">{provider.latency}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <Activity className="w-3 h-3 text-accent" />
            <span className="font-mono text-accent">{provider.uptime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <Globe className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">{provider.regions.length}</span>
          </div>
        </div>

        {/* Regions */}
        <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-1">
          {provider.regions.map((region) => (
            <span key={region} className="px-2 py-0.5 rounded-full bg-muted/50 text-[10px] text-muted-foreground">
              {region}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

ProviderCard.displayName = "ProviderCard";

export const ProvidersSection = memo(() => {
  const stats = useMemo(() => [
    { value: "50+", label: "Providers Integrated" },
    { value: "<50ms", label: "Average Latency" },
    { value: "99.99%", label: "Platform Uptime" },
    { value: "6", label: "Global Regions" },
  ], []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <OriginXLogoFilled size="md" className="text-foreground" />
            <h2 className="text-display">Provider Network</h2>
          </div>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time metrics from our global provider network. Intelligent routing ensures optimal performance.
          </p>
        </ScrollReveal>

        {/* Stats Bar */}
        <ScrollReveal delay={0.1} className="mb-12">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gradient">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Provider Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {providers.map((provider, index) => (
            <ProviderCard key={provider.name} provider={provider} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.3} className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All providers monitored 24/7 with automatic failover and load balancing
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
});

ProvidersSection.displayName = "ProvidersSection";
