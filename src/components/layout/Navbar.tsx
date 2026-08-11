"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { site } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { useCarrinho } from "@/context/carrinho";

/**
 * NAVBAR
 * Transparente sobre a hero e, a partir de ~70% da primeira tela, ganha
 * blur e uma linha de base. A troca é por opacidade — nunca por remontagem —
 * para não piscar durante o scroll.
 *
 * Menu mobile ainda não implementado: o botão está marcado com TODO para a
 * próxima etapa, quando houver seções reais para navegar.
 */
export function Navbar() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const { quantidade, abrir } = useCarrinho();

  useMotionValueEvent(scrollY, "change", (y) => {
    const threshold = typeof window !== "undefined" ? window.innerHeight * 0.7 : 600;
    setSolid(y > threshold);
  });

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-soft",
        solid ? "border-b border-bone/10 bg-ink/80 backdrop-blur-xl" : "border-b border-transparent",
      )}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <Container className="flex h-20 items-center justify-between">
        <a href="#hero" className="flex items-baseline gap-2.5">
          <span className="font-display text-xl font-semibold tracking-tightest text-bone">
            {site.brand.name}
          </span>
          <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.25em] text-ash sm:block">
            {site.brand.tagline}
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-bone/90 transition-colors duration-300 hover:text-bone"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Carrinho: contador só aparece quando há algo na comanda. */}
        <button
          type="button"
          onClick={() => abrir(true)}
          aria-label={`Abrir pedido${quantidade > 0 ? ` (${quantidade} ${quantidade === 1 ? "item" : "itens"})` : ""}`}
          className="flex items-center gap-2.5 rounded-full border border-bone/20 px-4 py-2 text-sm font-semibold text-bone transition-colors duration-300 ease-soft hover:border-ember/60 hover:bg-ember/5"
        >
          Pedido
          <span
            className={cn(
              "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-xs transition-colors",
              quantidade > 0 ? "bg-ember text-ink" : "bg-bone/10 text-ash",
            )}
          >
            {quantidade}
          </span>
        </button>
      </Container>
    </motion.header>
  );
}
