"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Indicador de rolagem: uma brasa desce por um fio fino, sinalizando que há
 * página abaixo. Coerente com a assinatura (brasa) em vez do "mouse com
 * bolinha" genérico. Silencioso em reduced-motion.
 */
export function ScrollCue() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3">
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-ash">
        Rolar
      </span>
      <div className="relative h-12 w-px bg-bone/15">
        <motion.span
          className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-ember [box-shadow:0_0_10px_2px_rgb(255_90_31/0.7)]"
          initial={{ y: 0, opacity: 0 }}
          animate={
            reduced
              ? { y: 24, opacity: 1 }
              : { y: [0, 44], opacity: [0, 1, 1, 0] }
          }
          transition={{ duration: 2, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
