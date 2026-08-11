"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * MAGNETIC BUTTON — CTA com personalidade, reutilizável em todo o site.
 *
 * Micro-interações (discretas, propositais):
 *  - pull magnético: o botão inclina-se levemente em direção ao cursor.
 *    Só em ponteiros finos (mouse) — em toque não faz sentido e é desligado;
 *  - varredura de brasa: um brilho quente cruza o botão no hover;
 *  - press: escala 0.97 para dar resposta tátil ao clique.
 *
 * Tudo respeita prefers-reduced-motion (o pull é anulado).
 *
 * `variant`:
 *  - "primary": preenchido, cor de brasa — ação principal;
 *  - "ghost": contorno discreto — ação secundária.
 */
export function MagneticButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = ref.current.getBoundingClientRect();
    // deslocamento suave (~18% da distância ao centro)
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.18);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    setHover(false);
  };

  const isPrimary = variant === "primary";

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold transition-colors duration-300 ease-soft",
        isPrimary
          ? "bg-ember text-ink"
          : "border border-bone/25 text-bone hover:border-bone/60",
        className,
      )}
    >
      {/* Varredura de brasa (só no variant primário) */}
      {isPrimary ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-mustard/70 to-transparent transition-transform duration-700 ease-soft group-hover:translate-x-full"
        />
      ) : (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 bg-bone/5 transition-opacity duration-300",
            hover ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}
