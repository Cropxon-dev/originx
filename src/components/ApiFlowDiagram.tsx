import { motion } from "framer-motion";
import { Zap, Shield, Route, Server } from "lucide-react";

const providers = [
  { name: "OpenAI", color: "from-emerald-500 to-emerald-600" },
  { name: "Stripe", color: "from-violet-500 to-violet-600" },
  { name: "Twilio", color: "from-red-500 to-red-600" },
  { name: "AWS", color: "from-amber-500 to-amber-600" },
];

export const ApiFlowDiagram = () => {
  return (
    <div className="relative glass rounded-2xl p-8 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="relative z-10">
        {/* Flow Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4">
          {/* Developer Request */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0 w-full lg:w-auto"
          >
            <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
                <code>
                  <span className="text-accent">POST</span> api.originxcloud.com/v1{"\n"}
                  <span className="text-muted-foreground/60">Authorization: Bearer ox_live_...</span>
                </code>
              </pre>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">Your Request</p>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="hidden lg:flex items-center"
          >
            <div className="w-16 h-px bg-gradient-to-r from-border to-accent" />
            <div className="w-2 h-2 rotate-45 border-t-2 border-r-2 border-accent -ml-1" />
          </motion.div>

          {/* OriginX Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-glow-secondary/20 rounded-2xl blur-xl" />
              <div className="relative bg-card border border-accent/30 rounded-xl p-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-glow-secondary flex items-center justify-center">
                    <span className="text-accent-foreground font-bold text-lg">O</span>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-sm">OriginX</h3>
                    <p className="text-xs text-muted-foreground mt-1">Unified API Layer</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3 text-accent" />
                      <span>Auth</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3 text-accent" />
                      <span>Meter</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Route className="w-3 h-3 text-accent" />
                      <span>Route</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="hidden lg:flex items-center"
          >
            <div className="w-16 h-px bg-gradient-to-r from-accent to-border" />
            <div className="w-2 h-2 rotate-45 border-t-2 border-r-2 border-muted-foreground -ml-1" />
          </motion.div>

          {/* Providers Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex-shrink-0"
          >
            <div className="grid grid-cols-2 gap-2">
              {providers.map((provider, i) => (
                <motion.div
                  key={provider.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.9 + i * 0.1 }}
                  className="bg-muted/30 rounded-lg p-3 border border-border/50 flex items-center gap-2"
                >
                  <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${provider.color} flex items-center justify-center`}>
                    <Server className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium">{provider.name}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">Best Provider Selected</p>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-border/50"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-gradient">50+</p>
            <p className="text-xs text-muted-foreground">API Providers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gradient">&lt;50ms</p>
            <p className="text-xs text-muted-foreground">Avg Latency</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gradient">99.99%</p>
            <p className="text-xs text-muted-foreground">Uptime SLA</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gradient">1B+</p>
            <p className="text-xs text-muted-foreground">Requests/Month</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
