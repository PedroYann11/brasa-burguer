import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

type SectionProps = {
  /** Âncora usada pela navbar. */
  id: string;
  /** Etiqueta de comanda — numeração real da ordem de leitura. */
  eyebrow: string;
  title: string;
  /** Linha curta de contexto sob o título. */
  description?: string;
  /** Altura mínima da seção. Padrão: 70svh. */
  minHeight?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Casca comum de todas as seções.
 * Centraliza espaçamento vertical, cabeçalho e reveal — assim uma nova
 * seção só precisa se preocupar com o próprio conteúdo.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  minHeight = "min-h-[70svh]",
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 border-t border-bone/5 py-24 md:py-32", minHeight, className)}
    >
      <Container>
        <Reveal>
          <header className="max-w-2xl">
            <p className="ticket-label">{eyebrow}</p>
            <h2 className="mt-5 font-display text-4xl tracking-tightest text-bone md:text-6xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-5 text-base leading-relaxed text-ash md:text-lg">{description}</p>
            ) : null}
          </header>
        </Reveal>

        {children ? <div className="mt-14">{children}</div> : null}
      </Container>
    </section>
  );
}

