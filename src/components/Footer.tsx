import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { OriginXLogo } from "./OriginXLogo";
import { Twitter, Github, MessageCircle, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "APIs", href: "/marketplace" },
    { label: "OneAuth", href: "/oneauth" },
    { label: "Docs", href: "#docs" },
    { label: "Pricing", href: "#pricing" },
    { label: "Playground", href: "/playground" },
  ],
  Resources: [
    { label: "Blog", href: "#" },
    { label: "Guides", href: "#" },
    { label: "Examples", href: "#" },
    { label: "Status", href: "#" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "#" },
    { label: "Publishers", href: "/publisher" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#security" },
    { label: "Compliance", href: "#" },
  ],
};

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && href !== "#") {
      e.preventDefault();
      const sectionId = href.substring(1);
      
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: sectionId } });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <footer className="relative z-10 py-16 border-t border-border/50 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
            {/* Logo & Description */}
            <div className="col-span-2">
              <Link to="/" className="inline-block mb-4">
                <OriginXLogo size="md" showText showSubtext animate={false} />
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                The universal API hub for modern developers.
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                A Product of{" "}
                <a 
                  href="https://www.originxlabs.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  ORIGINX LABS PVT LTD
                </a>
              </p>
              
              {/* Contact Information */}
              <div className="space-y-2 text-xs text-muted-foreground">
                <a href="mailto:hello@originxlabs.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  hello@originxlabs.com
                </a>
                <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  +91 98765 43210
                </a>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>Bangalore, Karnataka, India</span>
                </div>
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-medium text-sm mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith('/') ? (
                        <Link
                          to={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          onClick={(e) => handleAnchorClick(e, link.href)}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/30">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                <OriginXLogo size="sm" animate={false} />
                <span className="text-sm text-muted-foreground">© 2025 ORIGINX LABS PVT LTD. All rights reserved.</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="https://twitter.com/originxapi" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/originxlabs" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/originxlabs" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://discord.gg/originx" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Discord"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
