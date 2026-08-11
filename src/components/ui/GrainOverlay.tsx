import { cn } from "@/lib/cn";

/**
 * GRAIN OVERLAY — grão de filme.
 *
 * Uma camada de ruído sutil por cima de tudo. Existe para matar o "gradiente
 * digital perfeito" — o maior sinal de tela gerada por IA — e dar textura de
 * fotografia analógica, coerente com brasa/fumaça. Reutilizável e barato
 * (SVG inline, sem requisição de imagem).
 */
export function GrainOverlay({
  className,
  opacity = 0.06,
}: {
  className?: string;
  opacity?: number;
}) {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  );

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 mix-blend-soft-light", className)}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        backgroundSize: "140px 140px",
      }}
    />
  );
}
