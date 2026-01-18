import { motion } from "framer-motion";

const footerLinks = {
  Product: ["APIs", "Docs", "Pricing", "Changelog"],
  Resources: ["Blog", "Guides", "Examples", "Status"],
  Company: ["About", "Careers", "Press", "Contact"],
  Legal: ["Privacy", "Terms", "Security", "Compliance"],
};

export const Footer = () => {
  return (
    <footer className="py-16 border-t border-border/50">
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
              <a href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-glow-secondary flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">O</span>
                </div>
                <span className="font-semibold text-lg tracking-tight">OriginX</span>
              </a>
              <p className="text-sm text-muted-foreground">
                The universal API hub for modern developers.
              </p>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-medium text-sm mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              © 2025 OriginX. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
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
