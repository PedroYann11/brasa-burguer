"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * GLOW ORB — luz ambiente.
 *
 * Uma mancha radial quente que finge ser a fonte de luz da cena (a brasa
 * fora do quadro). Dá profundidade e "respira" lentamente, como carvão
 * pulsando. Puramente atmosférico e reutilizável em qualquer seção escura.
 *
 * Não intercepta cliques e desliga a respiração em reduced-motion.
 */
export function GlowOrb({
  className,
  color = "rgb(255 90 31 / 0.5)",
  size = 620,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at center, ${color}, transparent 68%)`,
      }}
      animate={reduced ? undefined : { scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
