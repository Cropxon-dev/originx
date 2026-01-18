import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 300 + 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));
};

const particles = generateParticles(3);

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      
      {/* Animated mesh gradient */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(ellipse 80% 50% at 20% 30%, hsl(var(--glow-primary) / 0.15), transparent 50%)",
            "radial-gradient(ellipse 80% 50% at 80% 70%, hsl(var(--glow-primary) / 0.15), transparent 50%)",
            "radial-gradient(ellipse 80% 50% at 50% 50%, hsl(var(--glow-primary) / 0.15), transparent 50%)",
            "radial-gradient(ellipse 80% 50% at 20% 30%, hsl(var(--glow-primary) / 0.15), transparent 50%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      />

      {/* Floating orbs */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.03, 0.08, 0.04, 0.03],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div 
            className="w-full h-full rounded-full blur-3xl"
            style={{
              background: particle.id % 2 === 0 
                ? "hsl(var(--glow-primary))" 
                : "hsl(var(--glow-secondary))",
            }}
          />
        </motion.div>
      ))}

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-[0.02]" />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Moving gradient lines */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(var(--glow-primary) / 0.03) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["200% 0%", "-200% 0%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};
