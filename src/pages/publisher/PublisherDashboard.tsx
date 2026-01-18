import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Layers, Plus, DollarSign, Key, BarChart3,
  Wallet, Star, Settings, ChevronLeft, Zap, TrendingUp, Users, 
  Sparkles, Send, ArrowLeft, CheckCircle2, Building2, Mail, User, FileText, Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { OriginXLogo } from "@/components/OriginXLogo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import publisher pages
import CreateApiPage from "./CreateApiPage";
import PublisherApisPage from "./PublisherApisPage";
import PublisherRevenuePage from "./PublisherRevenuePage";
import PublisherPayoutsPage from "./PublisherPayoutsPage";

const publisherNavItems = [
  { title: "Overview", icon: LayoutDashboard, href: "/publisher" },
  { title: "My APIs", icon: Layers, href: "/publisher/apis" },
  { title: "Create New API", icon: Plus, href: "/publisher/create" },
  { title: "Pricing & Plans", icon: DollarSign, href: "/publisher/pricing" },
  { title: "Test & Live Keys", icon: Key, href: "/publisher/keys" },
  { title: "Usage & Revenue", icon: BarChart3, href: "/publisher/revenue" },
  { title: "Payouts", icon: Wallet, href: "/publisher/payouts" },
  { title: "Reviews & Issues", icon: Star, href: "/publisher/reviews" },
  { title: "Settings", icon: Settings, href: "/publisher/settings" },
];

function PublisherSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Link to="/" className="inline-block mb-4">
          <OriginXLogo size="md" showText showSubtext />
        </Link>
        <p className="text-xs text-muted-foreground mb-3">Publisher Console</p>
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="w-full justify-start">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {publisherNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">
          <a href="https://www.cropxon.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            Cropxon Innovations Pvt. Ltd
          </a>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}

function PublisherOverview() {
  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Publisher Dashboard</h1>
        <p className="text-muted-foreground">Manage your APIs, track revenue, and grow your business.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active APIs", value: "3", icon: Layers, change: "+1" },
          { label: "Total Requests", value: "124K", icon: Zap, change: "+15%" },
          { label: "Monthly Revenue", value: "$2,847", icon: TrendingUp, change: "+22%" },
          { label: "Pending Payout", value: "$847", icon: Wallet, change: "" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-accent" />
              {stat.change && (
                <span className="text-xs text-green-500">{stat.change}</span>
              )}
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/publisher/create">
            <Button variant="outline" className="justify-start h-auto py-4 w-full">
              <Plus className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Create New API</p>
                <p className="text-xs text-muted-foreground">Publish a new API</p>
              </div>
            </Button>
          </Link>
          <Link to="/publisher/revenue">
            <Button variant="outline" className="justify-start h-auto py-4 w-full">
              <BarChart3 className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">View Analytics</p>
                <p className="text-xs text-muted-foreground">Check performance</p>
              </div>
            </Button>
          </Link>
          <Link to="/publisher/payouts">
            <Button variant="outline" className="justify-start h-auto py-4 w-full">
              <Wallet className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Request Payout</p>
                <p className="text-xs text-muted-foreground">Withdraw earnings</p>
              </div>
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">This section is coming soon.</p>
      </motion.div>
    </div>
  );
}

// Apple-style animated floating particles
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-accent/20"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            scale: 0 
          }}
          animate={{ 
            y: [null, "-20%", "120%"],
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{ 
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

function PublisherRequestForm({ onBack }: { onBack: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    apiDescription: "",
    useCase: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await supabase.functions.invoke('send-publisher-request', {
        body: formData
      });

      if (response.error) throw response.error;

      setIsSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold mb-3"
        >
          Application Received!
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-8 max-w-md mx-auto"
        >
          Thank you for your interest! Our team will review your application and get back to you within 2-3 business days.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button onClick={onBack} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  const inputVariants = {
    focus: { scale: 1.01, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-2"
        >
          <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Full Name *
          </Label>
          <motion.div whileFocus="focus" variants={inputVariants}>
            <Input
              id="name"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent/50 transition-all duration-300"
            />
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-2"
        >
          <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="john@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent/50 transition-all duration-300"
          />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="space-y-2"
      >
        <Label htmlFor="company" className="text-sm font-medium flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          Company Name
        </Label>
        <Input
          id="company"
          placeholder="Acme Inc."
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent/50 transition-all duration-300"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="space-y-2"
      >
        <Label htmlFor="apiDescription" className="text-sm font-medium flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          What API do you want to publish? *
        </Label>
        <Textarea
          id="apiDescription"
          required
          placeholder="Describe your API - what does it do, what problem does it solve?"
          value={formData.apiDescription}
          onChange={(e) => setFormData({ ...formData, apiDescription: e.target.value })}
          className="min-h-[100px] bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent/50 transition-all duration-300 resize-none"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="space-y-2"
      >
        <Label htmlFor="useCase" className="text-sm font-medium flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-muted-foreground" />
          Target Use Cases
        </Label>
        <Textarea
          id="useCase"
          placeholder="Who would use your API? What industries or applications?"
          value={formData.useCase}
          onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
          className="min-h-[80px] bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent/50 transition-all duration-300 resize-none"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col sm:flex-row gap-4 pt-4"
      >
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 px-6 gap-2 transition-all duration-300 hover:bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 px-8 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground flex-1 sm:flex-none transition-all duration-300"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Application
            </>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}

function BecomePublisherPrompt() {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
      <FloatingParticles />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-2xl w-full bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-10 relative z-10 shadow-2xl shadow-accent/5"
      >
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              {/* Coming Soon Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex justify-center mb-6"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
                  <Sparkles className="w-4 h-4" />
                  Coming Soon
                </span>
              </motion.div>

              {/* Icon */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/10"
              >
                <Layers className="w-10 h-10 text-accent" />
              </motion.div>

              {/* Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-center mb-3 tracking-tight"
              >
                Become a Publisher
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-muted-foreground text-center mb-8 text-lg"
              >
                Publish your APIs on OriginX and reach thousands of developers worldwide.
              </motion.p>

              {/* Benefits */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
              >
                {[
                  { icon: Zap, title: "Instant Distribution", desc: "Reach developers globally" },
                  { icon: TrendingUp, title: "15% Commission", desc: "Transparent pricing" },
                  { icon: Wallet, title: "Fast Payouts", desc: "Twice monthly via Stripe" },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.1, duration: 0.4 }}
                    className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border/30 text-center"
                  >
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <item.icon className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="font-medium text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button 
                  variant="outline" 
                  onClick={handleBackToHome}
                  className="h-12 px-6 gap-2 transition-all duration-300 hover:bg-muted/50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="h-12 px-8 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 shadow-lg shadow-accent/20 hover:shadow-accent/30"
                >
                  <Send className="w-4 h-4" />
                  Request Early Access
                </Button>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs text-muted-foreground text-center mt-6"
              >
                Be among the first to publish APIs when we launch!
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold mb-2"
              >
                Request Early Access
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground mb-8"
              >
                Tell us about your API and we'll reach out when Publisher Portal launches.
              </motion.p>
              <PublisherRequestForm onBack={() => setShowForm(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function PublisherDashboard() {
  // For now, always show the "Coming Soon" prompt since publisher features are not ready
  return <BecomePublisherPrompt />;
}
