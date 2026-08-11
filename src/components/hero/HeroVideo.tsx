"use client";

import { useReducedMotion } from "framer-motion";
import { site } from "@/config/site";

/**
 * Vídeo de fundo da hero.
 * Fica isolado em um componente porque, no futuro, o painel administrativo
 * troca `site.hero.video` por um arquivo enviado pelo cliente — e nada mais
 * na hero precisa mudar.
 *
 * Notas de performance:
 * - `poster` aparece antes do primeiro frame, evitando flash escuro;
 * - sem áudio: é fundo, não conteúdo;
 * - quem prefere menos movimento vê apenas o poster.
 */
export function HeroVideo() {
  const reduced = useReducedMotion();
  const { src, poster } = site.hero.video;

  if (reduced) {
    return (
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
        aria-hidden
      />
    );
  }

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  );
}
