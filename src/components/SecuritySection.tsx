import { motion } from "framer-motion";
import { Lock, Clock, FileText, Globe2, ShieldCheck } from "lucide-react";

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-display mb-4">Enterprise Security</h2>
            <p className="text-body-lg text-muted-foreground">
              Built for teams that take security seriously. SOC 2 Type II compliant infrastructure.
            </p>
          </motion.div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 px-5 py-3 rounded-full glass border-border/50"
              >
                <feature.icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Billing Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-24 text-center"
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};
