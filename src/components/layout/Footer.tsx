import { site } from "@/config/site";
import { Container } from "@/components/ui/Container";

/**
 * RODAPÉ — o fim do corredor, não uma nova seção.
 *
 * Fica sobre o `coal` (um tom acima do fundo) para o olho perceber que a
 * página acabou. A marca em corpo grande fecha a leitura com o mesmo peso
 * tipográfico da hero, e um fio de brasa marca o topo, ecoando a costura
 * usada na emenda com a hero.
 */
export function Footer() {
  const { brand, nav, contato } = site;
  const ano = new Date().getFullYear();

  return (
    <footer className="relative border-t border-bone/10 bg-coal py-20">
      {/* fio de brasa, mesmo dispositivo da HeatSeam */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-1/2 max-w-shell bg-gradient-to-r from-transparent via-ember/60 to-transparent"
      />

      <Container>
        <div className="flex flex-col gap-14 md:flex-row md:justify-between">
          <div>
            <p className="font-display text-6xl tracking-tightest text-bone md:text-7xl">
              {brand.name}
            </p>
            <p className="ticket-label mt-4">{brand.tagline}</p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-20">
            <nav className="flex flex-col gap-3">
              <p className="ticket-label mb-1">Navegar</p>
              {nav.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm text-bone/90 transition-colors hover:text-ember"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-3">
              <p className="ticket-label mb-1">Onde</p>
              <p className="text-sm leading-relaxed text-bone/90">{contato.address}</p>
              <p className="text-sm text-bone/90">{contato.hours}</p>
              <a
                href={`https://instagram.com/${contato.instagram.replace("@", "")}`}
                className="text-sm text-bone/90 transition-colors hover:text-ember"
              >
                {contato.instagram}
              </a>
            </div>
          </div>
        </div>

        <p className="mt-20 border-t border-bone/10 pt-8 font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-ash">
          © {ano} {brand.name} · Fortaleza, CE
        </p>
      </Container>
    </footer>
  );
}
