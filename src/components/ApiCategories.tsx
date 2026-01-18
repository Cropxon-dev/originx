import { 
  Brain, 
  CreditCard, 
  MessageSquare, 
  Globe, 
  Server, 
  BarChart3,
  Building2,
  ArrowRight,
  MapPin,
  Shield,
  FileText,
  Workflow,
  Gamepad2,
  Heart,
  Briefcase,
  ChevronRight
} from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { motion } from "framer-motion";
import { useState } from "react";

const categories = [
  {
    icon: Brain,
    name: "AI & Machine Learning",
    description: "LLMs, Vision AI, Audio AI, NLP, Generative AI, AI Agents & MLOps unified.",
    modules: ["LLMs", "Multimodal AI", "Vision AI", "Audio AI", "NLP Utilities", "Generative AI", "AI Agents & Reasoning", "MLOps", "AI Safety & Moderation"],
    count: "9 modules",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Globe,
    name: "Web & Internet",
    description: "Search, Crawling, Scraping, Indexing, and Web Utilities.",
    modules: ["Search", "Crawling", "Scraping", "Indexing", "Web Utilities"],
    count: "5 modules",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    icon: MapPin,
    name: "Location & Maps",
    description: "Geocoding, Routing, Places, and Geo Intelligence APIs.",
    modules: ["Geocoding", "Routing", "Places", "Geo Intelligence"],
    count: "4 modules",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    icon: CreditCard,
    name: "Payments & Finance",
    description: "Payments, Subscriptions, Banking, Accounting, Markets & Crypto unified.",
    modules: ["Payments", "Subscriptions", "Banking", "Accounting", "Markets", "Crypto"],
    count: "6 modules",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Shield,
    name: "Identity, Auth & Security",
    description: "Authentication, Authorization, Verification, Fraud & Risk, Security Intel.",
    modules: ["Authentication", "Authorization", "Verification", "Fraud & Risk", "Security Intelligence"],
    count: "5 modules",
    gradient: "from-red-500 to-rose-600",
  },
  {
    icon: MessageSquare,
    name: "Communication & Messaging",
    description: "Messaging, Email, Voice, Push & Social Channels in one place.",
    modules: ["Messaging", "Email", "Voice", "Push", "Social Channels"],
    count: "5 modules",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: FileText,
    name: "File, Media & Content",
    description: "File Storage, Media Processing, Documents & Content Tools.",
    modules: ["File Storage", "Media Processing", "Documents", "Content Tools"],
    count: "4 modules",
    gradient: "from-pink-500 to-fuchsia-600",
  },
  {
    icon: BarChart3,
    name: "Analytics & Data",
    description: "Analytics, Metrics, Logs, BI & Reporting unified.",
    modules: ["Analytics", "Metrics", "Logs", "BI & Reporting"],
    count: "4 modules",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    icon: Workflow,
    name: "Automation & Workflow",
    description: "Workflow Engine, Task Automation, Integrations & Scheduling.",
    modules: ["Workflow Engine", "Task Automation", "Integrations", "Scheduling"],
    count: "4 modules",
    gradient: "from-teal-500 to-emerald-600",
  },
  {
    icon: Server,
    name: "Developer, DevOps & Infra",
    description: "Dev Tools, CI/CD, Monitoring & Infrastructure Utilities.",
    modules: ["Dev Tools", "CI/CD", "Monitoring", "Infra Utilities"],
    count: "4 modules",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: Building2,
    name: "Government, Legal & Compliance",
    description: "Government Data, Legal, Compliance & Regulatory APIs.",
    modules: ["Government Data", "Legal", "Compliance", "Regulatory APIs"],
    count: "4 modules",
    gradient: "from-slate-500 to-zinc-600",
  },
  {
    icon: Briefcase,
    name: "Commerce, Retail & Logistics",
    description: "E-commerce, Inventory, Shipping & Supply Chain unified.",
    modules: ["E-commerce", "Inventory", "Shipping", "Supply Chain"],
    count: "4 modules",
    gradient: "from-amber-500 to-yellow-600",
  },
  {
    icon: Gamepad2,
    name: "Media, Gaming & Entertainment",
    description: "Gaming, Streaming & Media Intelligence APIs.",
    modules: ["Gaming", "Streaming", "Media Intelligence"],
    count: "3 modules",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: Heart,
    name: "Healthcare & Life Sciences",
    description: "Health Records, Diagnostics, Wellness & Bioinformatics.",
    modules: ["Health Records", "Diagnostics", "Wellness", "Bioinformatics"],
    count: "4 modules",
    gradient: "from-red-400 to-pink-500",
  },
  {
    icon: Shield,
    name: "Custom, Private & Enterprise",
    description: "Private APIs, Partner APIs & Internal APIs for enterprises.",
    modules: ["Private APIs", "Partner APIs", "Internal APIs"],
    count: "3 modules",
    gradient: "from-gray-500 to-slate-600",
  },
];

export const ApiCategories = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-8">
          <h2 className="text-display mb-4">Enterprise-Grade API Marketplace</h2>
          <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">
            Access <span className="text-foreground font-semibold">700+ API endpoints</span> across <span className="text-foreground font-semibold">15 categories</span> and <span className="text-foreground font-semibold">65 modular domains</span>. 
            One unified gateway, one API key, infinite possibilities.
          </p>
        </ScrollReveal>

        {/* Stats Bar */}
        <ScrollReveal delay={0.1} className="flex justify-center gap-8 md:gap-16 mb-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient">15</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="w-px bg-border/50" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient">65</div>
            <div className="text-sm text-muted-foreground">Modules</div>
          </div>
          <div className="w-px bg-border/50" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient">700+</div>
            <div className="text-sm text-muted-foreground">Endpoints</div>
          </div>
        </ScrollReveal>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <ScrollReveal
              key={category.name}
              delay={index * 0.05}
            >
              <motion.a
                href="#"
                className="group relative block"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-full p-5 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-accent/30 transition-all duration-300">
                  {/* Icon with gradient background */}
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-semibold mb-1 text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{category.description}</p>
                  
                  {/* Modules preview on hover */}
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: hoveredIndex === index ? "auto" : 0,
                      opacity: hoveredIndex === index ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-1 mb-3">
                      {category.modules.slice(0, 3).map((module) => (
                        <span key={module} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                          {module}
                        </span>
                      ))}
                      {category.modules.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent">
                          +{category.modules.length - 3} more
                        </span>
                      )}
                    </div>
                  </motion.div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground/70">{category.count}</span>
                    <span className="flex items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.a>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.3} className="text-center mt-12">
          <a 
            href="/marketplace" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse full API marketplace
            <ArrowRight className="w-4 h-4" />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
};
