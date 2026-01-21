import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Zap, Shield, Globe, Users, TrendingUp, Award,
  Building2, Rocket, Target, Heart
} from "lucide-react";

const stats = [
  { label: "APIs Available", value: "700+", icon: Zap },
  { label: "Active Developers", value: "50K+", icon: Users },
  { label: "Requests/Month", value: "1B+", icon: TrendingUp },
  { label: "Uptime SLA", value: "99.99%", icon: Shield },
];

const values = [
  {
    icon: Target,
    title: "Developer First",
    description: "Every decision we make prioritizes developer experience. Clean APIs, clear documentation, predictable pricing."
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "We show you exactly how your requests are routed, what they cost, and why. No hidden fees, no surprises."
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "We're constantly pushing boundaries—intelligent routing, real-time optimization, and seamless integrations."
  },
  {
    icon: Heart,
    title: "Community",
    description: "We believe in the power of shared infrastructure. Publishers earn, developers save, everyone wins."
  },
];

const team = [
  { name: "Leadership", count: "5" },
  { name: "Engineering", count: "25" },
  { name: "Product", count: "8" },
  { name: "Operations", count: "12" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Building2 className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent">About OriginX One</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              One API.
              <br />
              <span className="text-gradient">Every Capability.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              OriginX One is the unified API hub that connects developers to 700+ APIs 
              through a single endpoint, one API key, and transparent billing.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>A Product of</span>
              <a 
                href="https://www.originxlabs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline font-medium"
              >
                ORIGINX LABS PVT LTD
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              To democratize access to world-class APIs by creating a unified, 
              transparent, and intelligent infrastructure layer that serves both 
              API consumers and publishers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <Globe className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">For Developers</h3>
              <p className="text-muted-foreground">
                One endpoint, one key, one bill. Access AI models, payment processors, 
                messaging services, and 12+ categories without managing multiple vendors, 
                credentials, or invoices.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <Award className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">For Publishers</h3>
              <p className="text-muted-foreground">
                Reach thousands of developers instantly. Publish your API, set your pricing, 
                and let OriginX One handle distribution, billing, and payouts while you focus 
                on building great products.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we build.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 flex gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground">
              A diverse team of engineers, designers, and operators building the future of API infrastructure.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((dept, i) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 text-center"
              >
                <p className="text-3xl font-bold text-accent mb-2">{dept.count}</p>
                <p className="text-sm text-muted-foreground">{dept.name}</p>
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
              Ready to Build?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers using OriginX One to power their applications.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/auth" className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                Get Started Free
              </a>
              <a href="/marketplace" className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
                Explore APIs
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}