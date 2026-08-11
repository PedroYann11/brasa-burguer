"use client";

import { useEffect, useRef } from "react";

/**
 * EMBERS — assinatura visual do projeto.
 *
 * Brasas vivas subindo pela convecção do calor: partículas quentes e
 * esparsas que nascem embaixo, sobem oscilando de leve e apagam ao subir
 * (o calor se dissipa). Não é um "campo de partículas" genérico — é a
 * tradução direta do nome da casa (Brasa) e por isso é o único efeito
 * ostensivo da hero.
 *
 * Reutilizável: pode ser colocado atrás de qualquer seção escura no futuro
 * (ex.: bancada, contato) passando outra densidade.
 *
 * Decisões de performance:
 * - o brilho é um sprite radial desenhado UMA vez num canvas offscreen e
 *   reaproveitado com drawImage — evita shadowBlur por partícula (caro);
 * - densidade proporcional à área, com teto rígido;
 * - devicePixelRatio limitado a 2;
 * - IntersectionObserver pausa o loop quando a hero sai da tela;
 * - prefers-reduced-motion: não renderiza nada.
 */
export function Embers({
  density = 0.00008,
  max = 64,
  className,
}: {
  /** Partículas por pixel de área. */
  density?: number;
  /** Teto absoluto de partículas. */
  max?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let running = true;
    let raf = 0;

    // Sprite de brilho reaproveitável (16px), com núcleo quente.
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 16;
    const sctx = sprite.getContext("2d")!;
    const grad = sctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, "rgba(255, 214, 170, 1)");
    grad.addColorStop(0.35, "rgba(255, 138, 60, 0.9)");
    grad.addColorStop(1, "rgba(255, 90, 31, 0)");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 16, 16);

    type P = {
      x: number;
      y: number;
      vy: number;
      size: number;
      sway: number;
      phase: number;
      life: number;
      maxLife: number;
    };
    let particles: P[] = [];

    const spawn = (initial = false): P => {
      const maxLife = 4 + Math.random() * 5;
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : height + 10,
        vy: 14 + Math.random() * 26, // px/s subindo
        size: 1 + Math.random() * 2.2,
        sway: 6 + Math.random() * 16,
        phase: Math.random() * Math.PI * 2,
        life: initial ? Math.random() * maxLife : 0,
        maxLife,
      };
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(max, Math.floor(width * height * density));
      particles = Array.from({ length: count }, () => spawn(true));
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let last = performance.now();
    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter"; // brasas somam luz

      for (const p of particles) {
        p.life += dt;
        p.y -= p.vy * dt;
        p.phase += dt * 1.5;
        const x = p.x + Math.sin(p.phase) * p.sway;

        // alpha: acende rápido, apaga devagar (curva de brasa)
        const t = p.life / p.maxLife;
        const alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;

        if (t >= 1 || p.y < -10) {
          Object.assign(p, spawn(false));
          continue;
        }

        const d = p.size * 6;
        ctx.globalAlpha = Math.max(0, alpha) * 0.9;
        ctx.drawImage(sprite, x - d / 2, p.y - d / 2, d, d);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Pausa quando a hero sai da viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [density, max]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
