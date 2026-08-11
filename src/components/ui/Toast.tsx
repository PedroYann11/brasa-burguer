"use client";

import { AnimatePresence, motion } from "framer-motion";

/**
 * Notificação flutuante de confirmação.
 * Fica no rodapé da tela, some sozinha e não bloqueia nada.
 * `role="status"` faz leitores de tela anunciarem sem roubar o foco.
 *
 * Reutilizável: qualquer ação futura (pedido, cupom, reserva) pode chamá-la.
 */
export function Toast({ open, message }: { open: boolean; message: string }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-6 z-50 mx-auto w-fit max-w-[90vw] rounded-full border border-ember/30 bg-coal/90 px-6 py-3.5 backdrop-blur-xl"
        >
          <span className="flex items-center gap-3 text-sm text-bone">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember [box-shadow:0_0_10px_2px_rgb(255_90_31/0.6)]" />
            {message}
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
