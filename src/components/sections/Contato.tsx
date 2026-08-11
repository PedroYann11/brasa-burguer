"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * CONTATO — fechamento da página.
 *
 * O último empurrão é tipográfico: o convite ocupa a tela em corpo grande e
 * as informações práticas ficam em uma coluna estreita ao lado, em mono,
 * como uma ficha. Sem mapa embutido e sem formulário: quem decidiu comer
 * quer o botão, não um campo de assunto.
 *
 * O selo "aberto agora" é calculado do horário em config — dado vivo, não
 * enfeite. Roda só no cliente para não divergir entre servidor e navegador.
 */
export function Contato() {
  const { eyebrow, titulo, whatsapp, address, hours, instagram, abertura } = site.contato;
  const [aberto, setAberto] = useState<boolean | null>(null);

  useEffect(() => {
    const checar = () => {
      const agora = new Date();
      const h = agora.getHours() + agora.getMinutes() / 60;
      setAberto(h >= abertura.inicio && h <= abertura.fim);
    };
    checar();
    const t = setInterval(checar, 60000);
    return () => clearInterval(t);
  }, [abertura.inicio, abertura.fim]);

  const linkWhats = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

  return (
    <section id="contato" className="scroll-mt-24 py-28 md:py-40">
      <Container>
        <div className="grid gap-16 md:grid-cols-12 md:gap-10">
          {/* Convite */}
          <div className="md:col-span-7">
            <Reveal>
              <p className="ticket-label">{eyebrow}</p>
              <h2 className="mt-6 font-display text-6xl leading-[0.9] tracking-tightest text-bone md:text-8xl">
                {titulo}
              </h2>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <MagneticButton href={linkWhats} variant="primary">
                  Pedir no WhatsApp
                </MagneticButton>
                <MagneticButton href="#monte" variant="ghost">
                  Montar o meu
                </MagneticButton>
              </div>
            </Reveal>
          </div>

          {/* Ficha prática */}
          <div className="md:col-span-4 md:col-start-9">
            <Reveal delay={0.1}>
              <dl className="space-y-8">
                <div>
                  <dt className="ticket-label">Agora</dt>
                  <dd className="mt-3 flex items-center gap-2.5 text-base text-bone">
                    {aberto === null ? (
                      <span className="text-ash">—</span>
                    ) : (
                      <>
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            aberto
                              ? "bg-ember [box-shadow:0_0_10px_2px_rgb(255_90_31/0.6)]"
                              : "bg-ash"
                          }`}
                        />
                        {aberto ? "Aberto — brasa acesa" : "Fechado no momento"}
                      </>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="ticket-label">Horário</dt>
                  <dd className="mt-3 text-base text-bone/90">{hours}</dd>
                </div>

                <div>
                  <dt className="ticket-label">Endereço</dt>
                  <dd className="mt-3 text-base leading-relaxed text-bone/90">{address}</dd>
                </div>

                <div>
                  <dt className="ticket-label">Instagram</dt>
                  <dd className="mt-3">
                    <a
                      href={`https://instagram.com/${instagram.replace("@", "")}`}
                      className="text-base text-bone/90 transition-colors hover:text-ember"
                    >
                      {instagram}
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
