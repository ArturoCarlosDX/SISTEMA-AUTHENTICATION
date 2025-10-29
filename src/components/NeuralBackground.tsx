import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particleCount = 250;

    // Initialize particles with reasonable random velocities so they always move
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      connections: [],
    }));

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let rafId = 0;
    const animate = () => {
      // clear the canvas so particles overlay on top of the page background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        // Small random jitter to prevent velocities decaying to zero
        particle.vx += (Math.random() - 0.5) * 0.04;
        particle.vy += (Math.random() - 0.5) * 0.04;

        // Mouse attraction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.0001;

        if (distance < 200) {
          const force = (200 - distance) / 200;
          particle.vx += (dx / distance) * force * 8;
          particle.vy += (dy / distance) * force * 8;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Damping
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Boundary check (reflect)
        if (particle.x < 0) {
          particle.x = 0;
          particle.vx *= -1;
        } else if (particle.x > canvas.width) {
          particle.x = canvas.width;
          particle.vx *= -1;
        }

        if (particle.y < 0) {
          particle.y = 0;
          particle.vy *= -1;
        } else if (particle.y > canvas.height) {
          particle.y = canvas.height;
          particle.vy *= -1;
        }

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const otherParticle = particles[j];
          const dx2 = otherParticle.x - particle.x;
          const dy2 = otherParticle.y - particle.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < 150) {
            const alpha = (1 - dist2 / 250) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `hsla(195, 100%, 60%, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "hsl(195, 100%, 70%)";
        ctx.fill();

        // Glow effect
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          10
        );
        gradient.addColorStop(0, "hsla(195, 100%, 70%, 0.3)");
        gradient.addColorStop(1, "hsla(195, 100%, 70%, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="neural-canvas"
      className="fixed inset-0 -z-20 pointer-events-none"
    />
  );
}
