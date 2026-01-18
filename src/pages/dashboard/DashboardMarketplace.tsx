import { motion } from "framer-motion";
import { Store } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";

export default function DashboardMarketplace() {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <div className="p-4 rounded-2xl bg-accent/10 mb-6">
          <Store className="w-12 h-12 text-accent" />
        </div>
        <h1 className="text-2xl font-bold mb-2">API Marketplace</h1>
        <p className="text-muted-foreground max-w-md mb-6">
          Browse and subscribe to 700+ APIs across 15 categories. Discover the perfect APIs for your project.
        </p>
        <Button variant="hero" onClick={() => window.location.href = "/marketplace"}>
          Open Full Marketplace
        </Button>
      </motion.div>
    </DashboardLayout>
  );
}
