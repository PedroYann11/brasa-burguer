"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCarrinho } from "@/context/carrinho";
import { brl } from "@/lib/format";

/**
 * GAVETA DO CARRINHO.
 *
 * Entra pela direita sobre um véu escuro. Três estados na mesma superfície:
 * vazia (convite), com itens (revisão) e confirmada (pedido a caminho).
 *
 * A confirmação substitui o conteúdo em vez de abrir outro modal — o
 * usuário continua no mesmo lugar e vê o resultado da própria ação.
 */
export function CartDrawer() {
  const { itens, aberto, abrir, total, mudarQtd, remover, finalizar, status } = useCarrinho();
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {aberto ? (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* véu */}
          <button
            type="button"
            aria-label="Fechar carrinho"
            onClick={() => abrir(false)}
            className="absolute inset-0 h-full w-full bg-ink/80 backdrop-blur-sm"
          />

          <motion.aside
            role="dialog"
            aria-label="Seu pedido"
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-bone/10 bg-coal"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* cabeçalho */}
            <header className="flex items-center justify-between border-b border-bone/10 px-6 py-5">
              <p className="ticket-label">
                {status === "pronto" ? "Pedido confirmado" : "Seu pedido"}
              </p>
              <button
                type="button"
                onClick={() => abrir(false)}
                className="text-sm text-ash transition-colors hover:text-bone"
              >
                Fechar
              </button>
            </header>

            {/* CONFIRMADO */}
            {status === "pronto" ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <motion.span
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-ember/15"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14 }}
                >
                  <span className="h-3 w-3 rounded-full bg-ember [box-shadow:0_0_16px_4px_rgb(255_90_31/0.6)]" />
                </motion.span>
                <p className="font-display text-3xl tracking-tightest text-bone">
                  Pedido a caminho
                </p>
                <p className="max-w-xs text-sm leading-relaxed text-ash">
                  Já está na chapa. A entrega leva cerca de 35 minutos e você recebe o
                  acompanhamento pelo WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => abrir(false)}
                  className="mt-2 rounded-full border border-bone/20 px-6 py-3 text-sm font-semibold text-bone transition-colors hover:border-bone/50"
                >
                  Voltar ao cardápio
                </button>
              </div>
            ) : itens.length === 0 ? (
              /* VAZIO */
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <p className="font-display text-2xl tracking-tightest text-bone">
                  Nada na comanda ainda
                </p>
                <p className="max-w-xs text-sm leading-relaxed text-ash">
                  Escolha do cardápio ou monte o seu na bancada.
                </p>
              </div>
            ) : (
              /* COM ITENS */
              <>
                <ul className="flex-1 divide-y divide-bone/10 overflow-y-auto px-6">
                  {itens.map((i) => (
                    <motion.li
                      key={i.uid}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="py-5"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="font-display text-lg tracking-tightest text-bone">{i.nome}</p>
                        <p className="shrink-0 font-mono text-sm text-bone/90">
                          {brl(i.preco * i.qtd)}
                        </p>
                      </div>
                      {i.detalhe ? (
                        <p className="mt-1.5 text-xs leading-relaxed text-ash">{i.detalhe}</p>
                      ) : null}

                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center gap-3 rounded-full border border-bone/15 px-3 py-1.5">
                          <button
                            type="button"
                            onClick={() => mudarQtd(i.uid, -1)}
                            aria-label={`Menos um ${i.nome}`}
                            className="text-ash transition-colors hover:text-bone"
                          >
                            −
                          </button>
                          <span className="min-w-4 text-center font-mono text-xs text-bone">
                            {i.qtd}
                          </span>
                          <button
                            type="button"
                            onClick={() => mudarQtd(i.uid, 1)}
                            aria-label={`Mais um ${i.nome}`}
                            className="text-ash transition-colors hover:text-bone"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remover(i.uid)}
                          className="text-xs text-ash transition-colors hover:text-ember"
                        >
                          Remover
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                <footer className="border-t border-bone/10 px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="ticket-label">Total</span>
                    <span className="font-display text-3xl tracking-tightest text-bone">
                      {brl(total)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={finalizar}
                    disabled={status === "enviando"}
                    className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-ember px-7 py-4 text-sm font-semibold text-ink transition-colors hover:bg-mustard disabled:opacity-80"
                  >
                    {status === "enviando" ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                        Enviando para a cozinha…
                      </>
                    ) : (
                      "Finalizar pedido"
                    )}
                  </button>
                  <p className="mt-3 text-center text-xs text-ash">
                    Entrega em Fortaleza · pagamento na entrega
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
