import { motion } from "framer-motion";
import { 
  Brain, 
  CreditCard, 
  MessageSquare, 
  Globe, 
  Server, 
  BarChart3,
  Building2,
  ArrowRight
} from "lucide-react";

const categories = [
  {
    icon: Brain,
    name: "AI & LLMs",
    description: "GPT-4, Claude, Gemini, Mistral, and more. One API for all models.",
    count: "15+ providers",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: CreditCard,
    name: "Payments & Finance",
    description: "Stripe, PayPal, Plaid, and financial APIs unified.",
    count: "8+ providers",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: MessageSquare,
    name: "Messaging & Communication",
    description: "Twilio, SendGrid, Mailgun — SMS, Email, Voice in one place.",
    count: "12+ providers",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Globe,
    name: "Web & Data",
    description: "Web scraping, search APIs, translation, and data enrichment.",
    count: "10+ providers",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    icon: Server,
    name: "DevOps & Infra",
    description: "Cloud providers, storage, CDN, and infrastructure APIs.",
    count: "6+ providers",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: BarChart3,
    name: "Analytics & Automation",
    description: "Analytics, monitoring, workflow automation unified.",
    count: "8+ providers",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    icon: Building2,
    name: "Government & Compliance",
    description: "KYC, identity verification, and compliance APIs.",
    count: "5+ providers",
    gradient: "from-slate-500 to-zinc-600",
  },
];

export const ApiCategories = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-display mb-4">Every API You Need</h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            50+ providers across 7 categories. All accessible through one unified endpoint.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <motion.a
              key={category.name}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative"
            >
              <div className="h-full p-5 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-accent/30 transition-all duration-300">
                {/* Icon with gradient background */}
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{category.description}</p>
                
                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground/70">{category.count}</span>
                  <span className="flex items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
