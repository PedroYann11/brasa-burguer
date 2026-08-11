"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * SPARKS — faíscas no momento do encaixe.
 *
 * Dispara uma vez quando a peça assenta na pilha e se apaga sozinha.
 * Usa a mesma linguagem das brasas da hero (mesmo laranja, mesmo halo),
 * para o gesto parecer parte do mesmo mundo — não um efeito avulso.
 */
export function Sparks({ bottom }: { bottom: number }) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  const dots = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 9) * i - Math.PI / 18; // leque para cima
    const dist = 40 + Math.random() * 46;
    return {
      x: Math.cos(angle) * dist * (i % 2 === 0 ? 1 : -1),
      y: -Math.abs(Math.sin(angle)) * dist * 0.7 - 8,
    };
  });

  return (
    <div
      className="pointer-events-none absolute left-1/2 z-30 h-0 w-0"
      style={{ bottom }}
      aria-hidden
    >
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-ember [box-shadow:0_0_8px_2px_rgb(255_90_31/0.65)]"
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: d.x, y: d.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.75 + Math.random() * 0.35, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
