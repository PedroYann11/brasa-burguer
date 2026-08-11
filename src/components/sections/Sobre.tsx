import { site } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * SOBRE — versão curta, de propósito.
 *
 * A página é sobre o cardápio; esta seção existe só para dar lastro ao
 * produto. Um parágrafo e três números — quem quiser a história completa
 * pergunta no balcão.
 */
export function Sobre() {
  const { eyebrow, titulo, texto, fatos } = site.sobre;

  return (
    <section id="sobre" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="ticket-label">{eyebrow}</p>
              <h2 className="mt-5 font-display text-4xl leading-[0.95] tracking-tightest text-bone md:text-5xl">
                {titulo}
              </h2>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.1}>
              <p className="border-l border-ember/40 pl-6 text-lg leading-relaxed text-bone/90">
                {texto}
              </p>

              <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
                {fatos.map((f) => (
                  <div key={f.rotulo}>
                    <p className="font-display text-3xl tracking-tightest text-ember">{f.valor}</p>
                    <p className="ticket-label mt-1.5">{f.rotulo}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
