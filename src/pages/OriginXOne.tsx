import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LiveDemoMode } from "@/components/LiveDemoMode";
import { SdkCodeSnippets } from "@/components/SdkCodeSnippets";
import { FaqSection } from "@/components/FaqSection";
import { 
  User, Smartphone, Globe, Key, Shield, UserCog,
  Fingerprint, AlertTriangle, Lock, RefreshCw, FileText,
  Database, Zap, BarChart3, Server, ArrowRight, CheckCircle,
  Play, Pause, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
// Flow steps configuration
const flowSteps = [
  { id: 0, label: "User Initiates", description: "User requests access from trusted device" },
  { id: 1, label: "App Request", description: "Enterprise application receives the request" },
  { id: 2, label: "Protocol Selection", description: "OIDC/SAML/SCIM protocol routes the request" },
  { id: 3, label: "Authentication", description: "Auth Engine verifies identity with OTP/Passkeys" },
  { id: 4, label: "Risk Assessment", description: "Risk Engine analyzes signals and calculates score" },
  { id: 5, label: "Policy Check", description: "Policy Engine applies RBAC/ABAC rules" },
  { id: 6, label: "Session Created", description: "Session Engine establishes continuous trust" },
  { id: 7, label: "Access Granted", description: "User gains secure access to applications" },
];

// Animated connector with data flow pulse
const AnimatedConnector = ({ 
  isActive, 
  direction = "down",
  delay = 0 
}: { 
  isActive: boolean; 
  direction?: "down" | "right";
  delay?: number;
}) => (
  <div className={`relative flex items-center justify-center ${direction === "down" ? "h-10 w-full" : "w-12 h-full"}`}>
    <div className={`${direction === "down" ? "w-0.5 h-full" : "h-0.5 w-full"} bg-border`} />
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ 
            opacity: 0, 
            [direction === "down" ? "y" : "x"]: direction === "down" ? "-100%" : "-100%" 
          }}
          animate={{ 
            opacity: [0, 1, 1, 0], 
            [direction === "down" ? "y" : "x"]: direction === "down" ? "100%" : "100%" 
          }}
          transition={{ 
            duration: 0.8, 
            delay,
            ease: "easeInOut"
          }}
          className={`absolute ${direction === "down" ? "w-3 h-3" : "w-3 h-3"} rounded-full bg-accent shadow-[0_0_12px_4px_hsl(var(--accent)/0.6)]`}
        />
      )}
    </AnimatePresence>
  </div>
);

// Interactive flow node
const FlowNode = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  isActive,
  isCompleted,
  stepNumber,
  onClick,
}: { 
  icon: any; 
  title: string; 
  subtitle?: string; 
  isActive: boolean;
  isCompleted: boolean;
  stepNumber: number;
  onClick?: () => void;
}) => (
  <motion.div
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`
      relative p-4 rounded-xl border-2 text-center cursor-pointer transition-all duration-300
      ${isActive 
        ? "bg-accent/20 border-accent shadow-[0_0_20px_4px_hsl(var(--accent)/0.3)]" 
        : isCompleted 
          ? "bg-card border-accent/50" 
          : "bg-card border-border hover:border-muted-foreground/50"
      }
    `}
  >
    {/* Step indicator */}
    <div className={`
      absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
      ${isActive 
        ? "bg-accent text-accent-foreground" 
        : isCompleted 
          ? "bg-accent/80 text-accent-foreground" 
          : "bg-muted text-muted-foreground"
      }
    `}>
      {isCompleted && !isActive ? <CheckCircle className="w-3.5 h-3.5" /> : stepNumber}
    </div>
    
    <div className={`
      w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center transition-colors duration-300
      ${isActive ? "bg-accent/30" : "bg-muted"}
    `}>
      <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
    </div>
    <p className={`text-xs font-medium leading-tight transition-colors duration-300 ${isActive ? "text-foreground" : ""}`}>
      {title}
    </p>
    {subtitle && (
      <p className={`text-[10px] mt-1 transition-colors duration-300 ${isActive ? "text-accent" : "text-muted-foreground"}`}>
        {subtitle}
      </p>
    )}
    
    {/* Active pulse ring */}
    {isActive && (
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-xl border-2 border-accent"
      />
    )}
  </motion.div>
);

const features = [
  {
    icon: Fingerprint,
    title: "Passwordless Authentication",
    description: "OTP, Push notifications, and Passkey support for modern, secure authentication."
  },
  {
    icon: AlertTriangle,
    title: "Risk-Based Scoring",
    description: "Real-time risk signals and scoring to detect and prevent unauthorized access."
  },
  {
    icon: Lock,
    title: "Adaptive Policies",
    description: "RBAC, ABAC, and context-aware policies that adapt to your security needs."
  },
  {
    icon: RefreshCw,
    title: "Continuous Trust",
    description: "Session management with continuous validation and trust verification."
  },
  {
    icon: FileText,
    title: "Compliance Ready",
    description: "Built-in audit trails and SIEM integration for regulatory compliance."
  },
  {
    icon: Database,
    title: "Identity Store",
    description: "Unified identity management for users, tenants, and devices."
  }
];

export default function OriginXOne() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showDataPulse, setShowDataPulse] = useState(false);

  // Auto-advance steps
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= flowSteps.length) {
          return 0;
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Show data pulse when step changes
  useEffect(() => {
    setShowDataPulse(true);
    const timeout = setTimeout(() => setShowDataPulse(false), 800);
    return () => clearTimeout(timeout);
  }, [currentStep]);

  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
    setIsPlaying(false);
  }, []);

  const resetFlow = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent">Enterprise Identity Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              OneAuth
              <br />
              <span className="text-gradient">Identity Decision Core</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              A unified identity and access management platform that combines authentication, 
              risk scoring, policy enforcement, and continuous trust validation into a single, 
              seamless experience.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" onClick={() => navigate("/auth")}>
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Architecture Flow Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Architecture Flow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Watch the identity flow in action. Click any step to explore, or let it animate automatically.
            </p>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <Button
                variant={isPlaying ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFlow}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            {/* Current Step Info */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent/10 border border-accent/20"
            >
              <span className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                {currentStep + 1}
              </span>
              <div className="text-left">
                <p className="font-medium text-sm">{flowSteps[currentStep].label}</p>
                <p className="text-xs text-muted-foreground">{flowSteps[currentStep].description}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Flow Diagram */}
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[1000px] mx-auto space-y-2">
              
              {/* Row 1: User & Device */}
              <div className="flex items-center justify-center gap-6">
                <FlowNode
                  icon={User}
                  title="User"
                  subtitle="Workforce"
                  isActive={currentStep === 0}
                  isCompleted={currentStep > 0}
                  stepNumber={1}
                  onClick={() => handleStepClick(0)}
                />
                <AnimatedConnector isActive={showDataPulse && currentStep === 0} direction="right" />
                <FlowNode
                  icon={Smartphone}
                  title="Trusted Device"
                  subtitle="iOS · Android · Browser"
                  isActive={currentStep === 0}
                  isCompleted={currentStep > 0}
                  stepNumber={1}
                  onClick={() => handleStepClick(0)}
                />
              </div>

              <AnimatedConnector isActive={showDataPulse && currentStep === 0} delay={0.2} />

              {/* Row 2: Applications */}
              <div className="flex items-center justify-center gap-8">
                <FlowNode
                  icon={Globe}
                  title="Enterprise Apps"
                  subtitle="Web · Mobile · APIs"
                  isActive={currentStep === 1}
                  isCompleted={currentStep > 1}
                  stepNumber={2}
                  onClick={() => handleStepClick(1)}
                />
                <FlowNode
                  icon={Server}
                  title="Legacy Apps"
                  subtitle="SAML Support"
                  isActive={currentStep === 1}
                  isCompleted={currentStep > 1}
                  stepNumber={2}
                  onClick={() => handleStepClick(1)}
                />
              </div>

              <AnimatedConnector isActive={showDataPulse && currentStep === 1} delay={0.2} />

              {/* Row 3: Protocol Layer */}
              <div className="flex items-center justify-center gap-4">
                <FlowNode
                  icon={Key}
                  title="OIDC"
                  isActive={currentStep === 2}
                  isCompleted={currentStep > 2}
                  stepNumber={3}
                  onClick={() => handleStepClick(2)}
                />
                <FlowNode
                  icon={Shield}
                  title="SAML 2.0"
                  isActive={currentStep === 2}
                  isCompleted={currentStep > 2}
                  stepNumber={3}
                  onClick={() => handleStepClick(2)}
                />
                <FlowNode
                  icon={UserCog}
                  title="SCIM 2.0"
                  isActive={currentStep === 2}
                  isCompleted={currentStep > 2}
                  stepNumber={3}
                  onClick={() => handleStepClick(2)}
                />
              </div>

              <AnimatedConnector isActive={showDataPulse && currentStep === 2} delay={0.2} />

              {/* Row 4: OriginX One Core */}
              <motion.div
                animate={{
                  boxShadow: currentStep >= 3 && currentStep <= 6
                    ? "0 0 40px 8px hsl(var(--accent) / 0.2)"
                    : "0 0 0px 0px transparent"
                }}
                className="relative p-8 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/30"
              >
                <motion.div 
                  animate={{ 
                    scale: currentStep >= 3 && currentStep <= 6 ? [1, 1.02, 1] : 1,
                    opacity: 1 
                  }}
                  transition={{ duration: 2, repeat: currentStep >= 3 && currentStep <= 6 ? Infinity : 0 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full whitespace-nowrap"
                >
                  OneAuth — Identity Decision Core
                </motion.div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                  <FlowNode
                    icon={Database}
                    title="Identity Core"
                    subtitle="Users · Tenants"
                    isActive={currentStep === 3}
                    isCompleted={currentStep > 3}
                    stepNumber={4}
                    onClick={() => handleStepClick(3)}
                  />
                  <FlowNode
                    icon={Fingerprint}
                    title="Auth Engine"
                    subtitle="OTP · Push · Passkeys"
                    isActive={currentStep === 3}
                    isCompleted={currentStep > 3}
                    stepNumber={4}
                    onClick={() => handleStepClick(3)}
                  />
                  <FlowNode
                    icon={AlertTriangle}
                    title="Risk Engine"
                    subtitle="Signals · Scoring"
                    isActive={currentStep === 4}
                    isCompleted={currentStep > 4}
                    stepNumber={5}
                    onClick={() => handleStepClick(4)}
                  />
                  <FlowNode
                    icon={Lock}
                    title="Policy Engine"
                    subtitle="RBAC · ABAC"
                    isActive={currentStep === 5}
                    isCompleted={currentStep > 5}
                    stepNumber={6}
                    onClick={() => handleStepClick(5)}
                  />
                  <FlowNode
                    icon={RefreshCw}
                    title="Session Engine"
                    subtitle="Continuous Trust"
                    isActive={currentStep === 6}
                    isCompleted={currentStep > 6}
                    stepNumber={7}
                    onClick={() => handleStepClick(6)}
                  />
                  <FlowNode
                    icon={FileText}
                    title="Audit Engine"
                    subtitle="Compliance"
                    isActive={currentStep >= 3 && currentStep <= 6}
                    isCompleted={currentStep > 6}
                    stepNumber={7}
                    onClick={() => handleStepClick(6)}
                  />
                </div>
              </motion.div>

              <AnimatedConnector isActive={showDataPulse && currentStep === 6} delay={0.2} />

              {/* Row 5: Data Stores */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {[
                  { icon: Database, title: "PostgreSQL", subtitle: "Identity Store" },
                  { icon: Zap, title: "Redis", subtitle: "Sessions" },
                  { icon: BarChart3, title: "ClickHouse", subtitle: "Analytics" },
                  { icon: Shield, title: "Cloud KMS", subtitle: "Encryption" },
                  { icon: FileText, title: "SIEM", subtitle: "SOC Tools" },
                ].map((store, i) => (
                  <motion.div
                    key={store.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`
                      px-5 py-3 rounded-xl border text-center transition-all duration-300
                      ${currentStep === 7 
                        ? "bg-card border-accent/50 shadow-[0_0_12px_2px_hsl(var(--accent)/0.2)]" 
                        : "bg-muted border-border"
                      }
                    `}
                  >
                    <store.icon className={`w-6 h-6 mx-auto mb-1 transition-colors duration-300 ${currentStep === 7 ? "text-accent" : "text-muted-foreground"}`} />
                    <p className="text-xs font-medium">{store.title}</p>
                    <p className="text-[9px] text-muted-foreground">{store.subtitle}</p>
                  </motion.div>
                ))}
              </div>

              {/* Access Granted */}
              <AnimatePresence>
                {currentStep === 7 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex justify-center mt-6"
                  >
                    <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-green-500/20 border-2 border-green-500/50 shadow-[0_0_20px_4px_rgba(34,197,94,0.3)]">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                      <div className="text-left">
                        <p className="font-bold text-green-500">Access Granted</p>
                        <p className="text-xs text-green-400">User authenticated and session established</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Step Progress Bar */}
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-1">
              {flowSteps.map((step, i) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(i)}
                  className={`
                    flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer
                    ${i < currentStep 
                      ? "bg-accent" 
                      : i === currentStep 
                        ? "bg-accent animate-pulse" 
                        : "bg-border hover:bg-muted-foreground/30"
                    }
                  `}
                  title={step.label}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
              <span>Start</span>
              <span>Authentication</span>
              <span>Authorization</span>
              <span>Complete</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-green-500">Interactive Demo</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Try OneAuth Live</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the authentication flow in real-time. Enter test credentials and watch as OneAuth
              processes your request through each security layer.
            </p>
          </motion.div>

          <LiveDemoMode />
        </div>
      </section>

      {/* SDK Integration Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <span className="text-sm text-accent">Developer Friendly</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Integrate in Minutes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              OneAuth SDK provides simple, type-safe APIs for all major platforms. 
              Get started with just a few lines of code.
            </p>
          </motion.div>

          <SdkCodeSnippets />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Capabilities</h2>
            <p className="text-muted-foreground">Everything you need for enterprise-grade identity management.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="p-6 bg-card border border-border rounded-xl hover:border-accent/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Secure Your Identity?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get started with OneAuth and experience enterprise-grade identity management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" onClick={() => navigate("/auth")}>
                Start Free Trial
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                Talk to Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
