import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OriginXLogo } from "@/components/OriginXLogo";

interface ErrorPageProps {
  errorCode?: string;
  errorMessage?: string;
  isGenericError?: boolean;
}

const ErrorPage = ({ errorCode = "404", errorMessage = "Page not found", isGenericError = false }: ErrorPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.error(`${errorCode} Error: User attempted to access:`, location.pathname);
  }, [location.pathname, errorCode]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid opacity-5" />
      
      {/* Gradient Orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)",
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
        style={{
          background: "radial-gradient(circle, hsl(var(--glow-secondary)) 0%, transparent 70%)",
          x: -mousePosition.x * 1.5,
          y: -mousePosition.y * 1.5,
        }}
        animate={{
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <OriginXLogo size="xl" animate showText className="mx-auto" />
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mb-6"
        >
          <span className="text-[120px] sm:text-[160px] md:text-[200px] font-bold text-gradient leading-none select-none">
            {errorCode}
          </span>
          
          {/* Glitch effect layers */}
          <motion.span
            className="absolute inset-0 text-[120px] sm:text-[160px] md:text-[200px] font-bold text-accent/30 leading-none select-none"
            animate={{
              x: [0, -3, 3, 0],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
          >
            {errorCode}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-[120px] sm:text-[160px] md:text-[200px] font-bold text-purple-500/30 leading-none select-none"
            animate={{
              x: [0, 3, -3, 0],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3, delay: 0.1 }}
          >
            {errorCode}
          </motion.span>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-accent" />
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
              {isGenericError ? "Something went wrong" : errorMessage}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-md mx-auto">
            {isGenericError 
              ? "An unexpected error occurred. Our team has been notified and is working on a fix."
              : "The page you're looking for doesn't exist or has been moved. Let's get you back on track."
            }
          </p>
        </motion.div>

        {/* Path Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border/50 font-mono text-xs sm:text-sm text-muted-foreground">
            <span className="text-accent">GET</span>
            <span className="truncate max-w-[200px] sm:max-w-[300px]">{location.pathname}</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 flex items-center justify-center gap-2 text-xs text-muted-foreground/60"
        >
          <span>OriginX</span>
          <span>•</span>
          <span>Unified API Layer</span>
          <span>•</span>
          <span>A Product of Cropxon</span>
        </motion.div>
      </div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent/40"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
};

// Export for use as 404 page
const NotFound = () => <ErrorPage errorCode="404" errorMessage="Page not found" />;

// Export generic error component for error boundary
export const GenericError = () => <ErrorPage errorCode="500" errorMessage="Internal error" isGenericError />;

export default NotFound;