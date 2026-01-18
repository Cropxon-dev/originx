import { memo, useState, useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import { 
  Book, Search, ChevronRight, Code, Zap, Terminal, 
  MessageSquare, CreditCard, Globe, FileText, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OriginXLogoFilled } from "./OriginXLogo";
import { cn } from "@/lib/utils";

interface DocCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  endpoints: string[];
}

const docCategories: DocCategory[] = [
  { 
    id: "ai", 
    title: "AI & Machine Learning", 
    icon: Zap, 
    description: "LLMs, embeddings, vision, and audio APIs",
    endpoints: ["POST /v1/ai/chat", "POST /v1/ai/embeddings", "POST /v1/ai/vision", "POST /v1/ai/audio"]
  },
  { 
    id: "payments", 
    title: "Payments & Finance", 
    icon: CreditCard, 
    description: "Stripe, banking, and crypto integrations",
    endpoints: ["POST /v1/payments/charge", "GET /v1/payments/balance", "POST /v1/payments/payout"]
  },
  { 
    id: "communication", 
    title: "Communication", 
    icon: MessageSquare, 
    description: "SMS, email, voice, and push notifications",
    endpoints: ["POST /v1/sms/send", "POST /v1/email/send", "POST /v1/voice/call"]
  },
  { 
    id: "web", 
    title: "Web & Internet", 
    icon: Globe, 
    description: "Search, scraping, and web data APIs",
    endpoints: ["POST /v1/web/search", "POST /v1/web/scrape", "GET /v1/web/screenshot"]
  },
];

const quickLinks = [
  { label: "Quick Start Guide", href: "#", time: "5 min" },
  { label: "Authentication", href: "#", time: "3 min" },
  { label: "Error Handling", href: "#", time: "4 min" },
  { label: "Rate Limits", href: "#", time: "2 min" },
];

const CategoryCard = memo(({ 
  category, 
  isSelected, 
  onSelect 
}: { 
  category: DocCategory; 
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const Icon = category.icon;

  return (
    <motion.button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all duration-200",
        isSelected 
          ? "bg-accent/10 border-accent/40 shadow-lg shadow-accent/10" 
          : "bg-card/50 border-border/50 hover:border-accent/30 hover:bg-card/80"
      )}
      whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
          isSelected ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-medium text-sm">{category.title}</h3>
      </div>
      <p className="text-xs text-muted-foreground">{category.description}</p>
    </motion.button>
  );
});

CategoryCard.displayName = "CategoryCard";

const EndpointList = memo(({ endpoints }: { endpoints: string[] }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="space-y-2">
      {endpoints.map((endpoint, index) => {
        const [method, path] = endpoint.split(" ");
        return (
          <motion.div
            key={endpoint}
            initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold",
                method === "POST" ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"
              )}>
                {method}
              </span>
              <code className="text-xs text-foreground/80 font-mono">{path}</code>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
          </motion.div>
        );
      })}
    </div>
  );
});

EndpointList.displayName = "EndpointList";

export const DocsLandingSection = memo(() => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategorySelect = useCallback((index: number) => {
    setSelectedCategory(index);
  }, []);

  const filteredEndpoints = useMemo(() => {
    const category = docCategories[selectedCategory];
    if (!searchQuery) return category.endpoints;
    return category.endpoints.filter(e => 
      e.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedCategory, searchQuery]);

  return (
    <section id="docs" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className="w-8 h-8 text-accent" />
            <h2 className="text-display">Documentation</h2>
          </div>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to integrate with OriginX. Comprehensive guides and API reference.
          </p>
        </ScrollReveal>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          <ScrollReveal delay={0.1}>
            <div className="glass rounded-2xl border border-border/50 overflow-hidden">
              {/* Search Bar */}
              <div className="p-4 border-b border-border/50 bg-muted/20">
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search endpoints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Sidebar */}
                <div className="p-4 border-r border-border/50 bg-card/30">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    API Categories
                  </h3>
                  <div className="space-y-2">
                    {docCategories.map((category, index) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        isSelected={selectedCategory === index}
                        onSelect={() => handleCategorySelect(index)}
                      />
                    ))}
                  </div>

                  {/* Quick Links */}
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Quick Links
                    </h3>
                    <div className="space-y-1">
                      {quickLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          className="flex items-center justify-between p-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        >
                          <span>{link.label}</span>
                          <span className="text-[10px] text-muted-foreground/70">{link.time}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = docCategories[selectedCategory].icon;
                        return <Icon className="w-5 h-5 text-accent" />;
                      })()}
                      <h3 className="font-semibold">{docCategories[selectedCategory].title}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {filteredEndpoints.length} endpoints
                    </span>
                  </div>

                  <EndpointList endpoints={filteredEndpoints} />

                  {/* CTA */}
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-glow-secondary/10 border border-accent/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <OriginXLogoFilled size="sm" className="text-accent" />
                        <div>
                          <p className="text-sm font-medium">Ready to start building?</p>
                          <p className="text-xs text-muted-foreground">Get your API key and ship today</p>
                        </div>
                      </div>
                      <Button size="sm" className="gap-2">
                        Get Started
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
});

DocsLandingSection.displayName = "DocsLandingSection";
