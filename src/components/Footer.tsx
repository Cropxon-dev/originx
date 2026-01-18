import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { OriginXLogo } from "./OriginXLogo";

const footerLinks = {
  Product: [
    { label: "APIs", href: "/marketplace" },
    { label: "Docs", href: "/dashboard/docs" },
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
    { label: "Security", href: "#" },
    { label: "Compliance", href: "#" },
  ],
};

export const Footer = () => {
  return (
    <footer className="relative z-10 py-16 border-t border-border/50 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Logo & Description */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="inline-block mb-4">
                <OriginXLogo size="md" showText showSubtext animate={false} />
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                The universal API hub for modern developers.
              </p>
              <p className="text-xs text-muted-foreground">
                A Product Division of{" "}
                <a 
                  href="https://www.cropxon.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Cropxon Innovations Pvt. Ltd
                </a>
              </p>
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
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
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
              <p className="text-sm text-muted-foreground">
                © 2025 OriginX. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                OriginX - A Product Division of{" "}
                <a 
                  href="https://www.cropxon.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Cropxon Innovations Pvt. Ltd
                </a>
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Discord
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
