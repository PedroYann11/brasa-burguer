"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * Texto e chamadas da hero.
 *
 * Hierarquia (do mais forte ao mais quieto):
 *   1. título em dois tons — a última linha em brasa puxa o olho;
 *   2. subtítulo curto, cor de apoio;
 *   3. dois CTAs, primário preenchido vs. secundário fantasma.
 *
 * Divisão de animação no projeto:
 *   - Framer Motion -> entrada de elementos e micro-interações (aqui);
 *   - GSAP/ScrollTrigger -> parallax e transições de scroll (Hero.tsx).
 */
export function HeroContent() {
  const reduced = useReducedMotion();
  const { eyebrow, titleLines, subtitle, primaryCta, secondaryCta } = site.hero;

  // A entrada começa depois da abertura do vídeo (ver Hero.tsx).
  const base = reduced ? 0 : 1.05;

  return (
    <Container>
      <div className="max-w-3xl">
        {/* Sobrancelha com ponto de brasa vivo à esquerda */}
        <motion.div
          className="flex items-center gap-3"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: base }}
        >
          <span className="relative flex h-1.5 w-1.5">
            {!reduced ? (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75" />
            ) : null}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
          </span>
          <p className="ticket-label text-bone/90">{eyebrow}</p>
        </motion.div>

        <h1 className="mt-6 font-display text-[16vw] font-semibold leading-[0.82] tracking-tightest text-bone sm:text-[9.5vw] lg:text-[8rem]">
          {titleLines.map((line, i) => {
            const accent = i === titleLines.length - 1; // última linha em brasa
            return (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={
                    accent
                      ? "block text-ember [text-shadow:0_0_40px_rgb(255_90_31/0.35)]"
                      : "block"
                  }
                  initial={reduced ? false : { y: "112%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, delay: base + 0.09 * i, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            );
          })}
        </h1>

        <motion.p
          className="mt-7 max-w-md text-base leading-relaxed text-bone/90 md:text-lg"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: base + 0.3 }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-3"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: base + 0.42 }}
        >
          <MagneticButton href={primaryCta.href} variant="primary">
            {primaryCta.label}
          </MagneticButton>
          <MagneticButton href={secondaryCta.href} variant="ghost">
            {secondaryCta.label}
          </MagneticButton>
        </motion.div>
      </div>
    </Container>
  );
}
