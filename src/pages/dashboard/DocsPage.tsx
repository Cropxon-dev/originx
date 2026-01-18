import { useState } from "react";
import { motion } from "framer-motion";
import { Book, Search, ChevronRight, ExternalLink, Code, FileText, Zap } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const docSections = [
  {
    title: "Getting Started",
    icon: Zap,
    items: [
      { title: "Quick Start Guide", description: "Get up and running in 5 minutes" },
      { title: "Authentication", description: "API key setup and security" },
      { title: "Making Your First Request", description: "Hello world example" },
    ],
  },
  {
    title: "API Reference",
    icon: Code,
    items: [
      { title: "AI & Machine Learning", description: "LLMs, Vision, Audio APIs" },
      { title: "Payments & Finance", description: "Stripe, Banking, Crypto" },
      { title: "Communication", description: "SMS, Email, Voice" },
      { title: "Web & Internet", description: "Search, Scraping, Indexing" },
    ],
  },
  {
    title: "Guides",
    icon: Book,
    items: [
      { title: "Error Handling", description: "Best practices for resilience" },
      { title: "Rate Limits", description: "Understanding and managing limits" },
      { title: "Webhooks", description: "Real-time event notifications" },
      { title: "SDKs & Libraries", description: "Official client libraries" },
    ],
  },
];

const popularApis = [
  { name: "GPT-4 Turbo", category: "AI & ML" },
  { name: "Claude 3 Opus", category: "AI & ML" },
  { name: "Stripe Payments", category: "Payments" },
  { name: "Twilio SMS", category: "Communication" },
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState(0);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Documentation</h1>
        <p className="text-muted-foreground">
          Explore API reference, guides, and examples.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-1"
        >
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold mb-4">Quick Access</h3>
            <nav className="space-y-1">
              {docSections.map((section, index) => (
                <button
                  key={section.title}
                  onClick={() => setSelectedSection(index)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors",
                    selectedSection === index
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.title}</span>
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-sm font-medium mb-3">Popular APIs</h4>
              <div className="space-y-2">
                {popularApis.map((api) => (
                  <button
                    key={api.name}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <span>{api.name}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              {(() => {
                const Icon = docSections[selectedSection].icon;
                return <Icon className="w-6 h-6 text-accent" />;
              })()}
              <h2 className="text-xl font-semibold">{docSections[selectedSection].title}</h2>
            </div>

            <div className="space-y-4">
              {docSections[selectedSection].items.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent/30 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-accent/10 transition-colors">
                      <FileText className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-medium group-hover:text-accent transition-colors">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">Need help?</p>
                <p className="text-sm text-muted-foreground">Contact our developer support team</p>
              </div>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Support
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
