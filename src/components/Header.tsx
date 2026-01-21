import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Store, Info, FileText, DollarSign, Users, Gamepad2, Shield } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { OriginXLogo } from "./OriginXLogo";

const navLinks = [
  { label: "Marketplace", href: "/marketplace", isRoute: true, icon: Store },
  { label: "OriginX One", href: "/originx-one", isRoute: true, icon: Shield },
  { label: "About", href: "/about", isRoute: true, icon: Info },
  { label: "Docs", href: "#docs", isRoute: false, icon: FileText },
  { label: "Pricing", href: "#pricing", isRoute: false, icon: DollarSign },
  { label: "Publishers", href: "/publisher", isRoute: true, icon: Users },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const sectionId = href.substring(1);
      
      if (location.pathname !== "/") {
        // Navigate to home with state to scroll
        navigate("/", { state: { scrollTo: sectionId } });
      } else {
        // Already on home, just scroll
        const element = document.getElementById(sectionId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <OriginXLogo size="md" showText showSubtext />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </a>
              );
            })}
            <Link
              to="/playground"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Gamepad2 className="w-4 h-4" />
              Playground
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
              Get API Key
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border/30"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return link.isRoute ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </a>
                );
              })}
              <Link
                to="/playground"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Gamepad2 className="w-4 h-4" />
                Playground
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/30">
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
                  Get API Key
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};
