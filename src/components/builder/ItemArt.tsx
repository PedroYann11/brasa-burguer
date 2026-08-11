import type { Arte } from "@/config/site";
import { PECAS, PaoBaixo, PaoCima } from "./BurgerLayers";

/**
 * ILUSTRAÇÃO DO ITEM DO CARDÁPIO.
 *
 * Enquanto não houver fotos dos produtos reais, cada item é desenhado com
 * as mesmas camadas da bancada — o cardápio inteiro fica no mesmo padrão,
 * com fundo claro e foco total no produto, sem depender de banco de imagens.
 *
 * Assim que o cliente subir uma foto (campo `foto` em site.ts), ela assume
 * o lugar da ilustração sem precisar mexer aqui.
 */
export function ItemArt({ arte, foto, alt }: { arte: Arte; foto?: string; alt: string }) {
  return (
    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-bone">
      {foto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={foto} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <Desenho arte={arte} />
      )}
    </div>
  );
}

function Desenho({ arte }: { arte: Arte }) {
  if (arte.tipo === "copo") return <Copo cor={arte.cor} />;
  if (arte.tipo === "fritas") return <Fritas />;
  if (arte.tipo === "espeto") return <Espeto />;

  // burger e combo compartilham a pilha; o combo ganha copo e batata ao lado.
  const pilha = (
    <div className="relative w-[62%] max-w-[210px]">
      <div className="relative">
        <PaoCima />
        <div className="-mt-2">
          {arte.camadas.map((id, i) => {
            const Peca = PECAS[id];
            return Peca ? (
              <div key={`${id}-${i}`} className="-mt-1">
                <Peca />
              </div>
            ) : null;
          })}
        </div>
        <div className="-mt-1">
          <PaoBaixo />
        </div>
      </div>
    </div>
  );

  if (arte.tipo === "combo") {
    return (
      <div className="flex w-full items-end justify-center gap-1 px-4">
        <div className="w-[22%] max-w-[70px] pb-2">
          <Fritas compacto />
        </div>
        {pilha}
        <div className="w-[16%] max-w-[54px] pb-2">
          <Copo cor="#6B3A1E" compacto />
        </div>
      </div>
    );
  }

  return pilha;
}

/** Copo alto com tampa e canudo — serve para todas as bebidas, variando a cor. */
function Copo({ cor, compacto = false }: { cor: string; compacto?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 170"
      className={compacto ? "w-full" : "h-[70%] w-auto"}
      aria-hidden
    >
      <rect x="52" y="6" width="9" height="40" rx="4.5" fill="#8C8C8C" />
      <rect x="22" y="40" width="76" height="13" rx="6" fill="#E4DACD" />
      <path d="M28 53 L92 53 L84 160 Q60 168 36 160 Z" fill={cor} />
      <path d="M28 53 L92 53 L89 78 Q60 86 31 78 Z" fill="#FFFFFF" opacity="0.22" />
      <path d="M38 60 L44 60 L40 150 L35 148 Z" fill="#FFFFFF" opacity="0.28" />
    </svg>
  );
}

/** Batatas rústicas em leque. */
function Fritas({ compacto = false }: { compacto?: boolean }) {
  const palitos = [
    [30, 62, -14],
    [48, 44, -6],
    [66, 38, 2],
    [84, 48, 10],
    [100, 66, 18],
  ];
  return (
    <svg viewBox="0 0 140 150" className={compacto ? "w-full" : "h-[72%] w-auto"} aria-hidden>
      {palitos.map(([x, y, r], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="15"
          height="62"
          rx="5"
          fill={i % 2 ? "#E0A63E" : "#D2932F"}
          transform={`rotate(${r} ${x + 7} ${y + 30})`}
        />
      ))}
      <path d="M26 96 L114 96 L104 142 Q70 150 36 142 Z" fill="#B9702F" />
      <path d="M26 96 L114 96 L112 108 Q70 116 28 108 Z" fill="#D08B45" />
    </svg>
  );
}

/** Espetos de coalho grelhado. */
function Espeto() {
  return (
    <svg viewBox="0 0 150 150" className="h-[72%] w-auto" aria-hidden>
      {[26, 62, 98].map((x, i) => (
        <g key={i}>
          <rect x={x + 8} y="14" width="5" height="126" rx="2.5" fill="#9C7B52" />
          {[30, 62, 94].map((y, j) => (
            <g key={j}>
              <rect x={x} y={y} width="22" height="26" rx="5" fill="#F0E4CC" />
              <rect x={x + 3} y={y + 7} width="16" height="3.5" rx="1.75" fill="#C9A87A" />
              <rect x={x + 3} y={y + 16} width="16" height="3.5" rx="1.75" fill="#C9A87A" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
