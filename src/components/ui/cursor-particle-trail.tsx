"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  hueType: "gold" | "chrome" | "holo";
  rotation: number;
  vRot: number;
  isStar: boolean;
};

/**
 * High-end Liquid Gold & Holographic Chrome Stardust Particle Trail
 * Follows cursor movement with physics inertia, orbital drift, and 4-point star glints.
 */
export function CursorParticleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const mouse = { x: width / 2, y: height / 2, px: width / 2, py: height / 2, active: false };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const spawnParticle = (x: number, y: number, speed: number, burst = false) => {
      if (particles.length > 130) particles.shift();
      const angle = Math.random() * Math.PI * 2;
      const velocity = burst ? Math.random() * 3.2 + 0.8 : Math.random() * 1.1 + speed * 0.04;
      const roll = Math.random();
      const hueType: Particle["hueType"] = roll < 0.58 ? "gold" : roll < 0.85 ? "chrome" : "holo";

      particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 0.25,
        size: burst ? Math.random() * 3.8 + 1.8 : Math.random() * 2.6 + 0.8,
        alpha: Math.min(1, 0.55 + Math.random() * 0.45),
        decay: 0.012 + Math.random() * 0.016,
        hueType,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.08,
        isStar: burst || Math.random() < 0.28,
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      const dx = mouse.x - mouse.px;
      const dy = mouse.y - mouse.py;
      const speed = Math.hypot(dx, dy);
      const count = Math.min(5, Math.max(1, Math.floor(speed / 7)));
      for (let i = 0; i < count; i++) {
        const t = i / count;
        spawnParticle(mouse.px + dx * t, mouse.py + dy * t, speed, false);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      for (let i = 0; i < 14; i++) {
        spawnParticle(e.clientX, e.clientY, 12, true);
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    const drawStar = (cx: number, cy: number, r: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      const inner = r * 0.26;
      for (let i = 0; i < 4; i++) {
        const a1 = (i * Math.PI) / 2;
        const a2 = a1 + Math.PI / 4;
        ctx.lineTo(Math.cos(a1) * r * 2.1, Math.sin(a1) * r * 2.1);
        ctx.lineTo(Math.cos(a2) * inner, Math.sin(a2) * inner);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle cursor golden aura when active
      if (mouse.active) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 44);
        grad.addColorStop(0, "rgba(235, 200, 115, 0.14)");
        grad.addColorStop(0.5, "rgba(212, 175, 55, 0.04)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 44, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        let fill = `rgba(242, 212, 135, ${p.alpha})`;
        let glow = `rgba(212, 175, 55, ${p.alpha * 0.55})`;
        if (p.hueType === "chrome") {
          fill = `rgba(235, 245, 255, ${p.alpha})`;
          glow = `rgba(190, 225, 255, ${p.alpha * 0.5})`;
        } else if (p.hueType === "holo") {
          fill = `rgba(224, 195, 255, ${p.alpha})`;
          glow = `rgba(165, 235, 255, ${p.alpha * 0.55})`;
        }

        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = glow;
        ctx.fillStyle = fill;

        if (p.isStar) {
          drawStar(p.x, p.y, p.size, p.rotation);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
    />
  );
}

