import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const HeroVideoBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let connections: Connection[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulse: number;
      pulseSpeed: number;
    }

    interface Connection {
      from: Particle;
      to: Particle;
      alpha: number;
      dataFlow: number;
      flowSpeed: number;
    }

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 25000), 60);
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? "#22d3ee" : "#a855f7",
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02,
        });
      }
    };

    const updateConnections = () => {
      connections = [];
      const maxDist = 150;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            connections.push({
              from: particles[i],
              to: particles[j],
              alpha: 1 - dist / maxDist,
              dataFlow: Math.random(),
              flowSpeed: 0.005 + Math.random() * 0.01,
            });
          }
        }
      }
    };

    const drawDataPacket = (conn: Connection) => {
      const x = conn.from.x + (conn.to.x - conn.from.x) * conn.dataFlow;
      const y = conn.from.y + (conn.to.y - conn.from.y) * conn.dataFlow;
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 211, 238, ${conn.alpha * 0.8})`;
      ctx.fill();
    };

    const animate = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Keep in bounds
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));
      });

      updateConnections();

      // Draw connections
      connections.forEach((conn) => {
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        
        const gradient = ctx.createLinearGradient(
          conn.from.x, conn.from.y,
          conn.to.x, conn.to.y
        );
        gradient.addColorStop(0, `rgba(34, 211, 238, ${conn.alpha * 0.15})`);
        gradient.addColorStop(0.5, `rgba(168, 85, 247, ${conn.alpha * 0.1})`);
        gradient.addColorStop(1, `rgba(34, 211, 238, ${conn.alpha * 0.15})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Update and draw data flow
        conn.dataFlow += conn.flowSpeed;
        if (conn.dataFlow > 1) conn.dataFlow = 0;
        
        if (Math.random() > 0.7) {
          drawDataPacket(conn);
        }
      });

      // Draw particles with glow
      particles.forEach((p) => {
        const pulseScale = 1 + Math.sin(p.pulse) * 0.3;
        const radius = p.radius * pulseScale;

        // Outer glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 4);
        gradient.addColorStop(0, p.color.replace(")", ", 0.3)").replace("rgb", "rgba"));
        gradient.addColorStop(1, "transparent");
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Draw central hub glow
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const hubGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
      hubGradient.addColorStop(0, "rgba(34, 211, 238, 0.05)");
      hubGradient.addColorStop(0.5, "rgba(168, 85, 247, 0.03)");
      hubGradient.addColorStop(1, "transparent");
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
      ctx.fillStyle = hubGradient;
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    };

    // Visibility observer for performance
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(canvas);
    
    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [isVisible]);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  );
};
