"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * AVALIAÇÕES — faixa compacta, uma citação por vez.
 *
 * Deliberadamente pequena: prova social sustenta a decisão, não disputa
 * atenção com o cardápio. Troca sozinha a cada sete segundos; os fios
 * abaixo permitem navegar à mão. O avanço automático para em reduced-motion.
 */
export function Avaliacoes() {
  const { eyebrow, nota, total, lista } = site.avaliacoes;
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((n) => (n + 1) % lista.length), 7000);
    return () => clearInterval(t);
  }, [lista.length, reduced]);

  const atual = lista[i];

  return (
    <section id="avaliacoes" className="scroll-mt-24 py-20 md:py-24">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <p className="ticket-label">{eyebrow}</p>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-2xl tracking-tightest text-ember">
                {nota.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
              </span>
              <span className="ticket-label">de 5 · {total} avaliações</span>
            </p>
          </div>

          <div className="mt-8 min-h-[130px] max-w-3xl md:min-h-[110px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={atual.id}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-display text-xl leading-[1.35] tracking-tightest text-bone md:text-2xl">
                  {atual.texto}
                </p>
                <footer className="ticket-label mt-4">
                  {atual.autor} · {atual.origem}
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex gap-2">
            {lista.map((a, n) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Ver avaliação de ${a.autor}`}
                aria-current={n === i}
                className="group py-3"
              >
                <span
                  className={`block h-px w-9 transition-colors duration-500 ${
                    n === i ? "bg-ember" : "bg-bone/25 group-hover:bg-bone/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
