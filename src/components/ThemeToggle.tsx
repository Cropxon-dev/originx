import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ThemeToggle = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const iconVariants = {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0, rotate: 180, opacity: 0 },
  };

  const getCurrentIcon = () => {
    if (theme === "system") {
      return <Monitor className="w-4 h-4" />;
    }
    return resolvedTheme === "dark" ? (
      <Moon className="w-4 h-4" />
    ) : (
      <Sun className="w-4 h-4" />
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg glass border border-border/50 hover:border-accent/30 transition-colors overflow-hidden"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-muted-foreground"
            >
              {getCurrentIcon()}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={theme === "light" ? "bg-accent/10" : ""}
        >
          <Sun className="w-4 h-4 mr-2" />
          Light
          {theme === "light" && (
            <motion.span
              layoutId="theme-check"
              className="ml-auto w-2 h-2 rounded-full bg-accent"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "bg-accent/10" : ""}
        >
          <Moon className="w-4 h-4 mr-2" />
          Dark
          {theme === "dark" && (
            <motion.span
              layoutId="theme-check"
              className="ml-auto w-2 h-2 rounded-full bg-accent"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={theme === "system" ? "bg-accent/10" : ""}
        >
          <Monitor className="w-4 h-4 mr-2" />
          System
          {theme === "system" && (
            <motion.span
              layoutId="theme-check"
              className="ml-auto w-2 h-2 rounded-full bg-accent"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Simple toggle version (without dropdown)
export const ThemeToggleSimple = () => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative p-2 rounded-lg glass border border-border/50 hover:border-accent/30 transition-colors overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={resolvedTheme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-muted-foreground"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};
