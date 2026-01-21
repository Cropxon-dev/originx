import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  User, Smartphone, Globe, Key, Shield, UserCog,
  Fingerprint, AlertTriangle, Lock, RefreshCw, FileText,
  Database, Zap, BarChart3, Server, ArrowRight, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Flow node component
const FlowNode = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  color = "accent",
  delay = 0,
  size = "default"
}: { 
  icon: any; 
  title: string; 
  subtitle?: string; 
  color?: string;
  delay?: number;
  size?: "small" | "default" | "large";
}) => {
  const sizeClasses = {
    small: "w-32 p-3",
    default: "w-40 p-4",
    large: "w-48 p-5"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className={`${sizeClasses[size]} bg-card border border-border rounded-xl text-center`}
    >
      <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-${color}/10 flex items-center justify-center`}>
        <Icon className={`w-5 h-5 text-${color}`} />
      </div>
      <p className="text-xs font-medium leading-tight">{title}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground mt-1">{subtitle}</p>}
    </motion.div>
  );
};

// Connector line
const Connector = ({ direction = "down", delay = 0 }: { direction?: "down" | "right" | "left"; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className={`flex items-center justify-center ${direction === "down" ? "h-8" : "w-8"}`}
  >
    <div className={`${direction === "down" ? "w-0.5 h-full" : "h-0.5 w-full"} bg-gradient-to-${direction === "down" ? "b" : "r"} from-accent/50 to-accent/20`} />
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
              OriginX One
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

      {/* Architecture Flow Section */}
      <section className="py-20 px-6 bg-muted/30 overflow-x-auto">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Architecture Flow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From user authentication to continuous trust validation, OriginX One handles the entire identity lifecycle.
            </p>
          </motion.div>

          {/* Flow Diagram */}
          <div className="min-w-[900px] mx-auto">
            {/* Row 1: User & Device */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="w-20 h-20 rounded-2xl bg-card border border-border flex flex-col items-center justify-center">
                  <User className="w-8 h-8 text-accent mb-1" />
                  <span className="text-[10px] text-muted-foreground">User</span>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <div className="w-24 h-20 rounded-2xl bg-card border border-border flex flex-col items-center justify-center">
                  <Smartphone className="w-8 h-8 text-accent mb-1" />
                  <span className="text-[10px] text-muted-foreground text-center">Trusted Device</span>
                </div>
              </motion.div>
            </div>

            {/* Connector */}
            <Connector delay={0.1} />

            {/* Row 2: Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-6 mb-6"
            >
              <div className="px-6 py-4 rounded-xl bg-card border border-border text-center">
                <Globe className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium">Enterprise Applications</p>
                <p className="text-[10px] text-muted-foreground">Web · Mobile · APIs</p>
              </div>
              <div className="px-6 py-4 rounded-xl bg-card border border-border text-center">
                <Server className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Legacy Apps</p>
                <p className="text-[10px] text-muted-foreground">SAML Support</p>
              </div>
            </motion.div>

            {/* Connector */}
            <Connector delay={0.3} />

            {/* Row 3: Protocol Layer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/20 text-center">
                <Key className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xs font-medium">OIDC</p>
              </div>
              <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/20 text-center">
                <Shield className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xs font-medium">SAML 2.0</p>
              </div>
              <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/20 text-center">
                <UserCog className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xs font-medium">SCIM 2.0</p>
              </div>
            </motion.div>

            {/* Connector */}
            <Connector delay={0.5} />

            {/* Row 4: OriginX One Core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 mb-6"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                OriginX One — Identity Decision Core
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Database className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-xs font-medium">Identity Core</p>
                  <p className="text-[9px] text-muted-foreground">Users · Tenants</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Fingerprint className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-xs font-medium">Auth Engine</p>
                  <p className="text-[9px] text-muted-foreground">OTP · Push · Passkeys</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <AlertTriangle className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-xs font-medium">Risk Engine</p>
                  <p className="text-[9px] text-muted-foreground">Signals · Scoring</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Lock className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-xs font-medium">Policy Engine</p>
                  <p className="text-[9px] text-muted-foreground">RBAC · ABAC</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <RefreshCw className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-xs font-medium">Session Engine</p>
                  <p className="text-[9px] text-muted-foreground">Continuous Trust</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <FileText className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-xs font-medium">Audit Engine</p>
                  <p className="text-[9px] text-muted-foreground">Compliance</p>
                </div>
              </div>
            </motion.div>

            {/* Connector */}
            <Connector delay={0.7} />

            {/* Row 5: Data Stores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-6"
            >
              <div className="px-5 py-3 rounded-xl bg-muted border border-border text-center">
                <Database className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <p className="text-xs font-medium">PostgreSQL</p>
                <p className="text-[9px] text-muted-foreground">Identity Store</p>
              </div>
              <div className="px-5 py-3 rounded-xl bg-muted border border-border text-center">
                <Zap className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <p className="text-xs font-medium">Redis</p>
                <p className="text-[9px] text-muted-foreground">Sessions</p>
              </div>
              <div className="px-5 py-3 rounded-xl bg-muted border border-border text-center">
                <BarChart3 className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <p className="text-xs font-medium">ClickHouse</p>
                <p className="text-[9px] text-muted-foreground">Analytics</p>
              </div>
              <div className="px-5 py-3 rounded-xl bg-muted border border-border text-center">
                <Shield className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <p className="text-xs font-medium">Cloud KMS</p>
                <p className="text-[9px] text-muted-foreground">Encryption</p>
              </div>
              <div className="px-5 py-3 rounded-xl bg-muted border border-border text-center">
                <FileText className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <p className="text-xs font-medium">SIEM</p>
                <p className="text-[9px] text-muted-foreground">SOC Tools</p>
              </div>
            </motion.div>
          </div>
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
                className="p-6 bg-card border border-border rounded-xl"
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
              Get started with OriginX One and experience enterprise-grade identity management.
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
