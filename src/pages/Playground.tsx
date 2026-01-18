import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Play,
  ArrowLeft,
  Copy,
  Check,
  Zap,
  Clock,
  DollarSign,
  ChevronDown,
} from "lucide-react";

const endpoints = [
  { 
    method: "POST", 
    path: "/v1/ai/chat", 
    name: "Chat Completion",
    defaultBody: {
      model: "gpt-4o",
      messages: [
        { role: "user", content: "Explain quantum computing in simple terms" }
      ],
      max_tokens: 150
    }
  },
  { 
    method: "POST", 
    path: "/v1/ai/embeddings", 
    name: "Embeddings",
    defaultBody: {
      model: "text-embedding-3-small",
      input: "The quick brown fox jumps over the lazy dog"
    }
  },
  { 
    method: "POST", 
    path: "/v1/payments/charge", 
    name: "Create Charge",
    defaultBody: {
      amount: 2000,
      currency: "usd",
      source: "tok_visa"
    }
  },
  { 
    method: "POST", 
    path: "/v1/messaging/sms", 
    name: "Send SMS",
    defaultBody: {
      to: "+1234567890",
      body: "Hello from OriginX!"
    }
  },
];

const sampleResponses: Record<string, any> = {
  "/v1/ai/chat": {
    id: "ox_resp_1a2b3c4d",
    object: "chat.completion",
    model: "gpt-4o",
    choices: [
      {
        message: {
          role: "assistant",
          content: "Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously, unlike classical bits that are either 0 or 1. This allows quantum computers to process vast amounts of information in parallel, making them incredibly powerful for specific tasks like cryptography and complex simulations."
        },
        finish_reason: "stop"
      }
    ],
    usage: {
      prompt_tokens: 12,
      completion_tokens: 68,
      total_tokens: 80
    }
  },
  "/v1/ai/embeddings": {
    object: "list",
    data: [
      {
        object: "embedding",
        index: 0,
        embedding: [0.0023064255, -0.009327292, "..."]
      }
    ],
    model: "text-embedding-3-small",
    usage: { prompt_tokens: 10, total_tokens: 10 }
  },
  "/v1/payments/charge": {
    id: "ch_1234567890",
    object: "charge",
    amount: 2000,
    currency: "usd",
    status: "succeeded",
    created: Date.now()
  },
  "/v1/messaging/sms": {
    sid: "SM1234567890",
    status: "queued",
    to: "+1234567890",
    body: "Hello from OriginX!"
  }
};

const Playground = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
  const [requestBody, setRequestBody] = useState(
    JSON.stringify(endpoints[0].defaultBody, null, 2)
  );
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    tokens: 0,
    latency: 0,
    cost: 0,
  });
  const [copied, setCopied] = useState(false);
  const [endpointOpen, setEndpointOpen] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    setResponse("");
    setMetrics({ tokens: 0, latency: 0, cost: 0 });

    // Simulate API call with typing effect
    const startTime = Date.now();
    
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    const sampleResponse = sampleResponses[selectedEndpoint.path];
    const responseStr = JSON.stringify(sampleResponse, null, 2);
    
    // Animate response appearing
    let currentResponse = "";
    const lines = responseStr.split("\n");
    
    for (let i = 0; i < lines.length; i++) {
      currentResponse += (i > 0 ? "\n" : "") + lines[i];
      setResponse(currentResponse);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    const latency = Date.now() - startTime;
    const tokens = sampleResponse.usage?.total_tokens || Math.floor(Math.random() * 100 + 50);
    
    // Animate metrics
    let currentTokens = 0;
    const tokenStep = tokens / 20;
    const tokenInterval = setInterval(() => {
      currentTokens = Math.min(currentTokens + tokenStep, tokens);
      setMetrics({
        tokens: Math.floor(currentTokens),
        latency,
        cost: currentTokens * 0.00003,
      });
      if (currentTokens >= tokens) clearInterval(tokenInterval);
    }, 30);

    setIsLoading(false);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEndpointChange = (endpoint: typeof endpoints[0]) => {
    setSelectedEndpoint(endpoint);
    setRequestBody(JSON.stringify(endpoint.defaultBody, null, 2));
    setResponse("");
    setMetrics({ tokens: 0, latency: 0, cost: 0 });
    setEndpointOpen(false);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </a>
              <div className="h-6 w-px bg-border" />
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-glow-secondary flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">O</span>
                </div>
                <span className="font-semibold text-lg tracking-tight">Playground</span>
              </a>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-display mb-2">API Playground</h1>
            <p className="text-muted-foreground text-lg">
              Test API calls in real-time. No authentication required.
            </p>
          </motion.div>

          {/* Playground Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/10 via-glow-secondary/10 to-accent/10 rounded-3xl blur-2xl opacity-50" />

            {/* Main Container */}
            <div className="relative glass rounded-2xl overflow-hidden border border-accent/20">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/20">
                {/* Endpoint Selector */}
                <div className="relative">
                  <button
                    onClick={() => setEndpointOpen(!endpointOpen)}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-background/50 border border-border/50 hover:border-accent/30 transition-colors"
                  >
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      selectedEndpoint.method === "POST" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {selectedEndpoint.method}
                    </span>
                    <span className="font-mono text-sm">{selectedEndpoint.path}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                  
                  {endpointOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-2 w-72 glass rounded-xl border border-border/50 overflow-hidden z-20"
                    >
                      {endpoints.map((endpoint) => (
                        <button
                          key={endpoint.path}
                          onClick={() => handleEndpointChange(endpoint)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                        >
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            endpoint.method === "POST" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                          }`}>
                            {endpoint.method}
                          </span>
                          <div>
                            <p className="text-sm font-medium">{endpoint.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{endpoint.path}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Run Button */}
                <Button
                  variant="hero"
                  onClick={handleRun}
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Running...
                    </span>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Request
                    </>
                  )}
                </Button>
              </div>

              {/* Code Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                {/* Request Panel */}
                <div className="p-6 border-r border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Request Body</span>
                    <button
                      onClick={() => handleCopy(requestBody)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full h-[400px] font-mono text-sm bg-transparent resize-none focus:outline-none text-foreground/90"
                    spellCheck={false}
                  />
                </div>

                {/* Response Panel */}
                <div className="p-6 bg-muted/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Response</span>
                    {response && (
                      <span className="text-xs text-green-500 font-mono">200 OK</span>
                    )}
                  </div>
                  <pre className="font-mono text-sm text-foreground/90 overflow-auto h-[400px]">
                    <code>{response || "// Response will appear here..."}</code>
                  </pre>
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-t border-border/50">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Zap className={`w-4 h-4 ${isLoading ? "text-accent animate-pulse" : "text-muted-foreground"}`} />
                    <span className="text-sm">
                      <span className="font-mono font-semibold text-foreground">{metrics.tokens}</span>
                      <span className="text-muted-foreground"> tokens</span>
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-mono font-semibold text-foreground">{metrics.latency}</span>
                      <span className="text-muted-foreground">ms</span>
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Cost: </span>
                      <span className="font-mono font-semibold text-accent">${metrics.cost.toFixed(5)}</span>
                    </span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  Routed via: {selectedEndpoint.path.includes("ai") ? "OpenAI GPT-4o" : selectedEndpoint.path.includes("payment") ? "Stripe" : "Twilio"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Playground;
