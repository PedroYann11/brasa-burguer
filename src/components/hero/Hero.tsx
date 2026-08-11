"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { Embers } from "@/components/ui/Embers";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { HeroVideo } from "./HeroVideo";
import { HeroContent } from "./HeroContent";
import { ScrollCue } from "./ScrollCue";

/**
 * HERO — o coração desta etapa.
 *
 * Dois momentos coreografados.
 *
 * 1. ABERTURA (no load)
 *    O vídeo nasce como uma fresta horizontal no centro da tela e se abre
 *    até ocupar 100% da viewport — a "boca do forno" abrindo.
 *
 * 2. PARALLAX (no scroll)
 *    A hero é `sticky`: fica fixa enquanto o conteúdo abaixo sobe por cima.
 *    A profundidade vem de camadas em velocidades diferentes (regra: fundo
 *    mais lento, frente mais rápido). De trás para frente:
 *
 *      brilho ambiente  → o mais lento, é a fonte de luz da cena
 *      vídeo            → lento, com leve zoom
 *      brasas           → sobem mais rápido conforme rolamos
 *      texto            → o mais rápido, sai de cena e some
 *      véu              → escurece tudo para a entrega à próxima seção
 *
 *    Um único timeline com `scrub` mantém as camadas em fase.
 *
 * Alturas em `svh` para respeitar a barra móvel; nada em px fixo.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const glowLayer = useRef<HTMLDivElement>(null);
  const videoLayer = useRef<HTMLDivElement>(null);
  const embersLayer = useRef<HTMLDivElement>(null);
  const contentLayer = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Abertura
      gsap.fromTo(
        videoLayer.current,
        { clipPath: "inset(46% 24% 46% 24% round 20px)", scale: 1.3 },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          scale: 1.06,
          duration: 1.7,
          ease: "expo.out",
        },
      );

      // 2. Parallax — deltas distintos por camada criam a profundidade.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
          defaults: { ease: "none" },
        })
        .to(glowLayer.current, { yPercent: 6 }, 0)
        .to(videoLayer.current, { yPercent: 12, scale: 1.18 }, 0)
        .to(embersLayer.current, { yPercent: 20, opacity: 0.4 }, 0)
        .to(contentLayer.current, { yPercent: -26, opacity: 0 }, 0)
        .to(scrim.current, { opacity: 0.85 }, 0);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="hero"
      // sticky + z-0: o <main> passa por cima na transição para a próxima seção.
      className="sticky top-0 z-0 flex h-[100svh] flex-col justify-end overflow-hidden bg-ink pb-[16vh]"
    >
      {/* Camada 0 — luz ambiente (a brasa fora do quadro) */}
      <div ref={glowLayer} className="absolute inset-0 will-change-transform" aria-hidden>
        <GlowOrb className="-left-40 bottom-[-10%]" size={720} />
        <GlowOrb className="right-[-15%] top-[-20%]" color="rgb(232 179 60 / 0.28)" size={560} />
      </div>

      {/* Camada 1 — vídeo */}
      <div ref={videoLayer} className="absolute inset-0 will-change-transform">
        <HeroVideo />
      </div>

      {/* Camada 2 — gradiente permanente que garante contraste do texto */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/70"
        aria-hidden
      />

      {/* Camada 3 — vinheta: escurece as bordas e enquadra como cinema */}
      <div
        className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgb(var(--c-ink)/0.85)_100%)]"
        aria-hidden
      />

      {/* Camada 4 — brasas (assinatura) */}
      <div ref={embersLayer} className="pointer-events-none absolute inset-0 will-change-transform">
        <Embers className="h-full w-full" />
      </div>

      {/* Camada 5 — véu que escurece conforme a hero sai de cena */}
      <div ref={scrim} className="pointer-events-none absolute inset-0 bg-ink opacity-0" aria-hidden />

      {/* Camada 6 — conteúdo */}
      <div ref={contentLayer} className="relative z-10 will-change-transform">
        <HeroContent />
      </div>

      {/* Camada 7 — grão por cima de tudo */}
      <GrainOverlay className="z-20" />

      <ScrollCue />
    </section>
  );
}
