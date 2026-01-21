import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: "integration" | "security" | "pricing";
}

const faqs: FaqItem[] = [
  // Integration
  {
    category: "integration",
    question: "How long does it take to integrate OneAuth?",
    answer: "Most developers can complete a basic integration in under 30 minutes using our SDKs. For enterprise deployments with custom policies and SSO configurations, plan for 1-2 weeks with our onboarding team's support."
  },
  {
    category: "integration",
    question: "Which authentication protocols does OneAuth support?",
    answer: "OneAuth supports OIDC (OpenID Connect), SAML 2.0, and SCIM 2.0 for provisioning. This covers virtually all enterprise and modern application requirements, including legacy system integration via our SAML bridge."
  },
  {
    category: "integration",
    question: "Can I migrate from Auth0, Okta, or other providers?",
    answer: "Yes! We provide migration tools and scripts for Auth0, Okta, Azure AD, and other major identity providers. Our migration service handles user data, passwords (when possible), and configuration settings with zero downtime."
  },
  {
    category: "integration",
    question: "Do you offer SDKs for mobile platforms?",
    answer: "Absolutely. We provide native SDKs for iOS (Swift), Android (Kotlin), React Native, and Flutter. All mobile SDKs support biometric authentication, push notifications, and secure token storage."
  },
  // Security
  {
    category: "security",
    question: "How does the Risk Engine work?",
    answer: "Our Risk Engine analyzes 50+ signals in real-time including device fingerprint, geolocation, behavioral patterns, IP reputation, and login velocity. It calculates a risk score (0-100) that informs adaptive authentication decisions."
  },
  {
    category: "security",
    question: "What MFA methods are supported?",
    answer: "OneAuth supports SMS/Email OTP, TOTP authenticator apps, push notifications, WebAuthn/Passkeys, hardware security keys (FIDO2), and biometric authentication. You can configure multiple methods and fallback options."
  },
  {
    category: "security",
    question: "Is OneAuth SOC 2 and GDPR compliant?",
    answer: "Yes. OneAuth is SOC 2 Type II certified and fully GDPR compliant. We also support HIPAA, PCI-DSS, and ISO 27001 requirements. Audit logs are retained for 7 years and available for export."
  },
  {
    category: "security",
    question: "How are encryption keys managed?",
    answer: "All sensitive data is encrypted using AES-256. Encryption keys are managed through your choice of Cloud KMS (AWS, GCP, Azure) or dedicated HSM. We never store plaintext passwords—only bcrypt hashes with unique salts."
  },
  // Pricing
  {
    category: "pricing",
    question: "How is OneAuth priced?",
    answer: "OneAuth uses simple per-MAU (Monthly Active User) pricing. Our Starter tier is free up to 10,000 MAUs. Pro tier starts at $0.02/MAU with volume discounts. Enterprise pricing includes dedicated support and custom SLAs."
  },
  {
    category: "pricing",
    question: "Is there a free tier available?",
    answer: "Yes! Our Starter tier includes 10,000 MAUs free forever, with full access to core features including passwordless auth, basic MFA, and standard support. Perfect for startups and side projects."
  },
  {
    category: "pricing",
    question: "What's included in Enterprise pricing?",
    answer: "Enterprise includes unlimited MAUs with volume discounts, 99.99% SLA, dedicated support engineer, custom integrations, on-premise deployment options, advanced audit & compliance features, and priority feature requests."
  },
  {
    category: "pricing",
    question: "Do you charge for inactive users?",
    answer: "No. We only count Monthly Active Users who actually authenticate during the billing period. Dormant accounts don't count toward your MAU limit, so you only pay for real usage."
  },
];

const categories = [
  { id: "all", label: "All Questions" },
  { id: "integration", label: "Integration" },
  { id: "security", label: "Security" },
  { id: "pricing", label: "Pricing" },
] as const;

export const FaqSection = () => {
  const [activeCategory, setActiveCategory] = useState<"all" | "integration" | "security" | "pricing">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = activeCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <HelpCircle className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about OneAuth. Can't find what you're looking for? 
            Contact our support team.
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setOpenIndex(null);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeCategory === category.id
                  ? "bg-accent text-accent-foreground"
                  : "bg-card border border-border hover:border-muted-foreground/50"
                }
              `}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={`${faq.category}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3 pr-4">
                  <span className={`
                    mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide
                    ${faq.category === "integration" 
                      ? "bg-blue-500/10 text-blue-500" 
                      : faq.category === "security" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-orange-500/10 text-orange-500"
                    }
                  `}>
                    {faq.category}
                  </span>
                  <span className="font-medium">{faq.question}</span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pl-[72px]">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 text-center"
        >
          <h3 className="font-semibold mb-2">Still have questions?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our team is here to help with your specific use case.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a 
              href="mailto:support@originxlabs.com" 
              className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Contact Support
            </a>
            <a 
              href="#" 
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Book a Demo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
