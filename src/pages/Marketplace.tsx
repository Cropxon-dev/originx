import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, ChevronRight, ChevronDown, Star, Zap, Shield, 
  Globe, Check, X, ExternalLink, Clock, Server, Lock, CreditCard,
  Brain, Globe2, MapPin, Wallet, Users, MessageSquare, FileText,
  BarChart3, Cog, Code, Building, ShoppingCart, Gamepad2, Heart,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

// Complete API Categories Data
const apiCategories = [
  {
    id: "ai",
    name: "AI & Machine Learning",
    icon: Brain,
    path: "ai",
    color: "from-violet-500 to-purple-600",
    apiCount: 127,
    modules: [
      { name: "LLMs", apis: 24, description: "Large Language Models" },
      { name: "Multimodal AI", apis: 18, description: "Text, Image, Audio combined" },
      { name: "Vision AI", apis: 15, description: "Image recognition & analysis" },
      { name: "Audio AI", apis: 12, description: "Speech & audio processing" },
      { name: "NLP Utilities", apis: 14, description: "Text processing tools" },
      { name: "Generative AI", apis: 16, description: "Content generation" },
      { name: "AI Agents", apis: 10, description: "Autonomous AI systems" },
      { name: "MLOps", apis: 8, description: "ML operations & pipelines" },
      { name: "AI Safety", apis: 10, description: "Content moderation" },
    ],
  },
  {
    id: "web",
    name: "Web & Internet",
    icon: Globe2,
    path: "web",
    color: "from-blue-500 to-cyan-600",
    apiCount: 45,
    modules: [
      { name: "Search", apis: 12, description: "Web search engines" },
      { name: "Crawling", apis: 8, description: "Web crawlers" },
      { name: "Scraping", apis: 10, description: "Data extraction" },
      { name: "Indexing", apis: 7, description: "Content indexing" },
      { name: "Web Utilities", apis: 8, description: "URL, DNS, etc." },
    ],
  },
  {
    id: "geo",
    name: "Location & Maps",
    icon: MapPin,
    path: "geo",
    color: "from-emerald-500 to-green-600",
    apiCount: 38,
    modules: [
      { name: "Geocoding", apis: 10, description: "Address to coordinates" },
      { name: "Routing", apis: 12, description: "Directions & navigation" },
      { name: "Places", apis: 8, description: "POI & business data" },
      { name: "Geo Intelligence", apis: 8, description: "Location analytics" },
    ],
  },
  {
    id: "payments",
    name: "Payments & Finance",
    icon: Wallet,
    path: "payments",
    color: "from-green-500 to-emerald-600",
    apiCount: 62,
    modules: [
      { name: "Payments", apis: 15, description: "Payment processing" },
      { name: "Subscriptions", apis: 10, description: "Recurring billing" },
      { name: "Banking", apis: 12, description: "Bank connections" },
      { name: "Accounting", apis: 10, description: "Financial tools" },
      { name: "Markets", apis: 8, description: "Stock & crypto data" },
      { name: "Crypto", apis: 7, description: "Blockchain & crypto" },
    ],
  },
  {
    id: "auth",
    name: "Identity & Security",
    icon: Users,
    path: "auth",
    color: "from-orange-500 to-red-600",
    apiCount: 48,
    modules: [
      { name: "Authentication", apis: 12, description: "User auth systems" },
      { name: "Authorization", apis: 10, description: "Access control" },
      { name: "Verification", apis: 10, description: "ID verification" },
      { name: "Fraud & Risk", apis: 8, description: "Fraud detection" },
      { name: "Security Intel", apis: 8, description: "Threat intelligence" },
    ],
  },
  {
    id: "comm",
    name: "Communication",
    icon: MessageSquare,
    path: "comm",
    color: "from-pink-500 to-rose-600",
    apiCount: 52,
    modules: [
      { name: "Messaging", apis: 12, description: "SMS, WhatsApp, etc." },
      { name: "Email", apis: 14, description: "Email delivery" },
      { name: "Voice", apis: 10, description: "Voice calls & IVR" },
      { name: "Push", apis: 8, description: "Push notifications" },
      { name: "Social Channels", apis: 8, description: "Social messaging" },
    ],
  },
  {
    id: "files",
    name: "File & Media",
    icon: FileText,
    path: "files",
    color: "from-amber-500 to-yellow-600",
    apiCount: 42,
    modules: [
      { name: "File Storage", apis: 12, description: "Cloud storage" },
      { name: "Media Processing", apis: 14, description: "Image, video tools" },
      { name: "Documents", apis: 10, description: "PDF, DOC processing" },
      { name: "Content Tools", apis: 6, description: "Content utilities" },
    ],
  },
  {
    id: "analytics",
    name: "Analytics & Data",
    icon: BarChart3,
    path: "analytics",
    color: "from-indigo-500 to-blue-600",
    apiCount: 35,
    modules: [
      { name: "Analytics", apis: 10, description: "User analytics" },
      { name: "Metrics", apis: 8, description: "Performance metrics" },
      { name: "Logs", apis: 9, description: "Log management" },
      { name: "BI & Reporting", apis: 8, description: "Business intelligence" },
    ],
  },
  {
    id: "automation",
    name: "Automation & Workflow",
    icon: Cog,
    path: "automation",
    color: "from-slate-500 to-gray-600",
    apiCount: 32,
    modules: [
      { name: "Workflow Engine", apis: 10, description: "Workflow automation" },
      { name: "Task Automation", apis: 8, description: "Task runners" },
      { name: "Integrations", apis: 8, description: "App connectors" },
      { name: "Scheduling", apis: 6, description: "Cron & scheduling" },
    ],
  },
  {
    id: "devops",
    name: "DevOps & Infra",
    icon: Code,
    path: "devops",
    color: "from-teal-500 to-cyan-600",
    apiCount: 36,
    modules: [
      { name: "Dev Tools", apis: 10, description: "Developer utilities" },
      { name: "CI/CD", apis: 10, description: "Build & deploy" },
      { name: "Monitoring", apis: 10, description: "Uptime & alerts" },
      { name: "Infra Utilities", apis: 6, description: "Cloud management" },
    ],
  },
  {
    id: "gov",
    name: "Government & Compliance",
    icon: Building,
    path: "gov",
    color: "from-slate-600 to-gray-700",
    apiCount: 28,
    modules: [
      { name: "Government Data", apis: 8, description: "Public records" },
      { name: "Legal", apis: 6, description: "Legal document APIs" },
      { name: "Compliance", apis: 8, description: "Compliance checks" },
      { name: "Regulatory", apis: 6, description: "Regulatory APIs" },
    ],
  },
  {
    id: "commerce",
    name: "Commerce & Logistics",
    icon: ShoppingCart,
    path: "commerce",
    color: "from-orange-500 to-amber-600",
    apiCount: 40,
    modules: [
      { name: "E-commerce", apis: 12, description: "Shopping & carts" },
      { name: "Inventory", apis: 10, description: "Stock management" },
      { name: "Shipping", apis: 10, description: "Delivery & tracking" },
      { name: "Supply Chain", apis: 8, description: "Logistics APIs" },
    ],
  },
  {
    id: "media",
    name: "Media & Gaming",
    icon: Gamepad2,
    path: "media",
    color: "from-purple-500 to-pink-600",
    apiCount: 28,
    modules: [
      { name: "Gaming", apis: 10, description: "Game services" },
      { name: "Streaming", apis: 10, description: "Video streaming" },
      { name: "Media Intelligence", apis: 8, description: "Media analytics" },
    ],
  },
  {
    id: "health",
    name: "Healthcare",
    icon: Heart,
    path: "health",
    color: "from-red-500 to-rose-600",
    apiCount: 32,
    modules: [
      { name: "Health Records", apis: 10, description: "EHR & medical data" },
      { name: "Diagnostics", apis: 8, description: "Medical diagnosis" },
      { name: "Wellness", apis: 8, description: "Fitness & wellness" },
      { name: "Bioinformatics", apis: 6, description: "Genomics & bio data" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise & Private",
    icon: Building2,
    path: "enterprise",
    color: "from-gray-600 to-slate-700",
    apiCount: 24,
    modules: [
      { name: "Private APIs", apis: 8, description: "Custom private APIs" },
      { name: "Partner APIs", apis: 10, description: "Partner integrations" },
      { name: "Internal APIs", apis: 6, description: "Internal tools" },
    ],
  },
];

// Filter options
const pricingFilters = [
  { id: "free", label: "Free" },
  { id: "payg", label: "Pay-as-you-go" },
  { id: "subscription", label: "Subscription" },
  { id: "under-001", label: "Under $0.01/call" },
];

const providerFilters = [
  { id: "originx", label: "OriginX Native" },
  { id: "verified", label: "Verified Partner" },
  { id: "community", label: "Community" },
  { id: "enterprise", label: "Enterprise" },
];

const authFilters = [
  { id: "api-key", label: "API Key" },
  { id: "oauth", label: "OAuth" },
  { id: "jwt", label: "JWT" },
  { id: "webhook", label: "Webhook" },
];

const slaFilters = [
  { id: "99.9", label: "SLA ≥ 99.9%" },
  { id: "99.99", label: "SLA ≥ 99.99%" },
  { id: "enterprise", label: "Enterprise-grade" },
];

const regionFilters = [
  { id: "global", label: "Global" },
  { id: "us", label: "United States" },
  { id: "eu", label: "European Union" },
  { id: "in", label: "India" },
];

const complianceFilters = [
  { id: "gdpr", label: "GDPR-ready" },
  { id: "soc2", label: "SOC2-ready" },
  { id: "iso", label: "ISO-certified" },
  { id: "gov", label: "Government-approved" },
];

// Sample APIs for listing
const sampleApis = [
  {
    id: 1,
    name: "GPT-4 Turbo",
    description: "Most capable GPT-4 model with 128k context",
    module: "LLMs",
    category: "ai",
    provider: "OriginX Native",
    pricing: "$0.01/1k tokens",
    sla: "99.99%",
    rating: 4.9,
    calls: "2.5M/day",
    auth: "API Key",
  },
  {
    id: 2,
    name: "Claude 3 Opus",
    description: "Advanced reasoning and analysis capabilities",
    module: "LLMs",
    category: "ai",
    provider: "Verified Partner",
    pricing: "$0.015/1k tokens",
    sla: "99.95%",
    rating: 4.8,
    calls: "1.8M/day",
    auth: "API Key",
  },
  {
    id: 3,
    name: "DALL-E 3",
    description: "State-of-the-art image generation",
    module: "Generative AI",
    category: "ai",
    provider: "OriginX Native",
    pricing: "$0.04/image",
    sla: "99.9%",
    rating: 4.7,
    calls: "500K/day",
    auth: "API Key",
  },
  {
    id: 4,
    name: "Whisper",
    description: "Robust speech recognition in multiple languages",
    module: "Audio AI",
    category: "ai",
    provider: "OriginX Native",
    pricing: "$0.006/minute",
    sla: "99.9%",
    rating: 4.8,
    calls: "1.2M/day",
    auth: "API Key",
  },
  {
    id: 5,
    name: "Stripe Payments",
    description: "Complete payment processing solution",
    module: "Payments",
    category: "payments",
    provider: "Verified Partner",
    pricing: "2.9% + $0.30",
    sla: "99.99%",
    rating: 4.9,
    calls: "10M/day",
    auth: "OAuth",
  },
  {
    id: 6,
    name: "Twilio SMS",
    description: "Global SMS messaging at scale",
    module: "Messaging",
    category: "comm",
    provider: "Verified Partner",
    pricing: "$0.0075/message",
    sla: "99.95%",
    rating: 4.7,
    calls: "5M/day",
    auth: "API Key",
  },
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["ai"]);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    pricing: [],
    provider: [],
    auth: [],
    sla: [],
    region: [],
    compliance: [],
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleFilter = (filterGroup: string, filterId: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterGroup]: prev[filterGroup].includes(filterId)
        ? prev[filterGroup].filter((id) => id !== filterId)
        : [...prev[filterGroup], filterId],
    }));
  };

  const totalActiveFilters = Object.values(selectedFilters).flat().length;

  const filteredApis = useMemo(() => {
    let apis = sampleApis;
    if (selectedCategory) {
      apis = apis.filter((api) => api.category === selectedCategory);
    }
    if (selectedModule) {
      apis = apis.filter((api) => api.module === selectedModule);
    }
    if (searchQuery) {
      apis = apis.filter(
        (api) =>
          api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          api.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return apis;
  }, [selectedCategory, selectedModule, searchQuery]);

  const selectedCategoryData = selectedCategory
    ? apiCategories.find((cat) => cat.id === selectedCategory)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative py-16 border-b border-border overflow-hidden">
          <div className="absolute inset-0 bg-radial-fade opacity-50" />
          <div className="container mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="max-w-3xl">
                <h1 className="text-display-lg mb-4">
                  API <span className="text-gradient">Marketplace</span>
                </h1>
                <p className="text-body-lg text-muted-foreground mb-6">
                  Discover 700+ APIs across 15 categories. One unified gateway, one API key, infinite possibilities.
                </p>
                
                {/* Search Bar */}
                <div className="relative max-w-xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search APIs, categories, or use cases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-6 text-lg bg-card border-border"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Main Content */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-80 border-r border-border min-h-[calc(100vh-12rem)] hidden lg:block">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-6">
                {/* Filter Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="font-semibold">Filters</span>
                    {totalActiveFilters > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {totalActiveFilters}
                      </Badge>
                    )}
                  </div>
                  {totalActiveFilters > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSelectedFilters({
                          pricing: [],
                          provider: [],
                          auth: [],
                          sla: [],
                          region: [],
                          compliance: [],
                        })
                      }
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Filter Groups */}
                <div className="space-y-6">
                  {/* Pricing */}
                  <FilterGroup
                    title="Pricing"
                    options={pricingFilters}
                    selected={selectedFilters.pricing}
                    onToggle={(id) => toggleFilter("pricing", id)}
                  />

                  {/* Provider Type */}
                  <FilterGroup
                    title="Provider Type"
                    options={providerFilters}
                    selected={selectedFilters.provider}
                    onToggle={(id) => toggleFilter("provider", id)}
                  />

                  {/* Auth Type */}
                  <FilterGroup
                    title="Auth Type"
                    options={authFilters}
                    selected={selectedFilters.auth}
                    onToggle={(id) => toggleFilter("auth", id)}
                  />

                  {/* SLA */}
                  <FilterGroup
                    title="SLA & Reliability"
                    options={slaFilters}
                    selected={selectedFilters.sla}
                    onToggle={(id) => toggleFilter("sla", id)}
                  />

                  {/* Region */}
                  <FilterGroup
                    title="Region"
                    options={regionFilters}
                    selected={selectedFilters.region}
                    onToggle={(id) => toggleFilter("region", id)}
                  />

                  {/* Compliance */}
                  <FilterGroup
                    title="Compliance"
                    options={complianceFilters}
                    selected={selectedFilters.compliance}
                    onToggle={(id) => toggleFilter("compliance", id)}
                  />
                </div>

                {/* Category Navigation */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-1">
                    {apiCategories.map((category) => (
                      <div key={category.id}>
                        <button
                          onClick={() => {
                            setSelectedCategory(
                              selectedCategory === category.id ? null : category.id
                            );
                            toggleCategory(category.id);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? "bg-accent/10 text-accent"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <category.icon className="w-4 h-4" />
                            <span className="text-sm">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {category.apiCount}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                expandedCategories.includes(category.id)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </div>
                        </button>
                        <AnimatePresence>
                          {expandedCategories.includes(category.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-6 pl-4 border-l border-border space-y-1 py-2">
                                {category.modules.map((module) => (
                                  <button
                                    key={module.name}
                                    onClick={() =>
                                      setSelectedModule(
                                        selectedModule === module.name
                                          ? null
                                          : module.name
                                      )
                                    }
                                    className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                                      selectedModule === module.name
                                        ? "bg-accent/10 text-accent"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                                  >
                                    <span>{module.name}</span>
                                    <span className="text-xs">{module.apis}</span>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="p-6">
              {/* Breadcrumb & Results Count */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>All APIs</span>
                  {selectedCategoryData && (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      <span className="text-foreground">{selectedCategoryData.name}</span>
                    </>
                  )}
                  {selectedModule && (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      <span className="text-foreground">{selectedModule}</span>
                    </>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {filteredApis.length} APIs found
                </span>
              </div>

              {/* Category Cards (when no category selected) */}
              {!selectedCategory && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                  {apiCategories.slice(0, 6).map((category, index) => (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        if (!expandedCategories.includes(category.id)) {
                          toggleCategory(category.id);
                        }
                      }}
                      className="p-6 rounded-xl border border-border bg-card hover:border-accent/50 transition-all text-left group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.modules.length} modules · {category.apiCount} APIs
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {category.modules.slice(0, 3).map((module) => (
                          <Badge key={module.name} variant="secondary" className="text-xs">
                            {module.name}
                          </Badge>
                        ))}
                        {category.modules.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{category.modules.length - 3}
                          </Badge>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* API Listings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                  {selectedModule
                    ? `${selectedModule} APIs`
                    : selectedCategoryData
                    ? `${selectedCategoryData.name} APIs`
                    : "Featured APIs"}
                </h3>
                
                {filteredApis.map((api, index) => (
                  <motion.div
                    key={api.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl border border-border bg-card hover:border-accent/30 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold group-hover:text-accent transition-colors">
                            {api.name}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {api.module}
                          </Badge>
                          {api.provider === "OriginX Native" && (
                            <Badge className="text-xs bg-accent/10 text-accent border-accent/20">
                              <Zap className="w-3 h-3 mr-1" />
                              Native
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {api.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            {api.pricing}
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {api.sla} SLA
                          </div>
                          <div className="flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            {api.auth}
                          </div>
                          <div className="flex items-center gap-1">
                            <Server className="w-3 h-3" />
                            {api.calls}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {api.rating}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        View Docs
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Filter Group Component
function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-3">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <Checkbox
              checked={selected.includes(option.id)}
              onCheckedChange={() => onToggle(option.id)}
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
