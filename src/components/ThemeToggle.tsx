import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative p-2 rounded-lg glass border border-border/50 hover:border-accent/30 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? (
          <Moon className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Sun className="w-4 h-4 text-muted-foreground" />
        )}
      </motion.div>
    </motion.button>
  );
};
