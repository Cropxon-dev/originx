import { motion } from "framer-motion";
import { Play, Zap } from "lucide-react";
import { useState, useEffect } from "react";

const sampleRequest = `{
  "model": "gpt-4o",
  "messages": [
    { "role": "user", "content": "Explain quantum computing" }
  ],
  "max_tokens": 150
}`;

const sampleResponse = `{
  "id": "ox_resp_1a2b3c4d",
  "object": "chat.completion",
  "model": "gpt-4o",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Quantum computing harnesses quantum mechanics..."
      }
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 138,
    "total_tokens": 150
  }
}`;

export const PlaygroundTeaser = () => {
  const [tokens, setTokens] = useState(0);
  const [cost, setCost] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTokens(0);
      setCost(0);
      
      // Animate tokens counting up
      let currentTokens = 0;
      const tokenInterval = setInterval(() => {
        currentTokens += 10;
        if (currentTokens >= 150) {
          currentTokens = 150;
          clearInterval(tokenInterval);
          setIsAnimating(false);
        }
        setTokens(currentTokens);
        setCost(currentTokens * 0.00003);
      }, 50);
    }, 5000);

    // Initial animation
    setTimeout(() => {
      let currentTokens = 0;
      const tokenInterval = setInterval(() => {
        currentTokens += 10;
        if (currentTokens >= 150) {
          currentTokens = 150;
          clearInterval(tokenInterval);
        }
        setTokens(currentTokens);
        setCost(currentTokens * 0.00003);
      }, 50);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-display mb-4">Try Before You Ship</h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time API playground with live cost estimation. No signup required to explore.
          </p>
        </motion.div>

        {/* Playground Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-glow-secondary/20 to-accent/20 rounded-3xl blur-xl opacity-50" />
            
            {/* Main Container */}
            <div className="relative glass rounded-2xl overflow-hidden border border-accent/20">
              {/* Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-sm text-muted-foreground font-mono">playground.originxcloud.com</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors">
                  <Play className="w-4 h-4" />
                  Run Request
                </button>
              </div>

              {/* Code Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Request Panel */}
                <div className="p-6 border-r border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Request</span>
                    <span className="text-xs text-accent font-mono">POST /v1/ai/chat</span>
                  </div>
                  <pre className="font-mono text-xs text-foreground/80 overflow-x-auto">
                    <code>{sampleRequest}</code>
                  </pre>
                </div>

                {/* Response Panel */}
                <div className="p-6 bg-muted/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Response</span>
                    <span className="text-xs text-green-500 font-mono">200 OK</span>
                  </div>
                  <pre className="font-mono text-xs text-foreground/80 overflow-x-auto">
                    <code>{sampleResponse}</code>
                  </pre>
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-t border-border/50">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Zap className={`w-4 h-4 ${isAnimating ? 'text-accent animate-pulse' : 'text-muted-foreground'}`} />
                    <span className="text-sm">
                      <span className="font-mono font-semibold text-foreground">{tokens}</span>
                      <span className="text-muted-foreground"> tokens</span>
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Cost: </span>
                    <span className="font-mono font-semibold text-accent">${cost.toFixed(5)}</span>
                  </span>
                  <div className="h-4 w-px bg-border" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Latency: </span>
                    <span className="font-mono font-semibold text-foreground">234ms</span>
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Routed via: OpenAI GPT-4o</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
