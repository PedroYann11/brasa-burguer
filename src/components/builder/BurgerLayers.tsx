"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * CAMADAS DO HAMBÚRGUER — desenhadas em SVG, sem nenhuma imagem externa.
 *
 * Motivo: peso zero, nitidez em qualquer tela e controle total da animação
 * de cada peça (o queijo precisa escorrer, o bacon precisa ondular). Uma
 * foto não faria nada disso.
 *
 * As cores dos ingredientes conversam com a paleta da marca — o queijo usa
 * o mesmo mostarda dos tokens, o molho fica na família da brasa.
 *
 * Todas as peças usam a mesma largura (320) para empilharem alinhadas.
 */

const W = 320;

/** Paletas dos dois pães disponíveis na bancada. */
const PAO = {
  brioche: { base: "#C97B3C", sombra: "#B9702F", luz: "#D08B45", gergelim: "#F3E3C8" },
  australiano: { base: "#7A4726", sombra: "#653A1E", luz: "#8E5730", gergelim: "#E8D2AE" },
} as const;

export type VariantePao = keyof typeof PAO;

/** Pão de baixo: base da pilha, sempre presente. */
export function PaoBaixo({ variante = "brioche" }: { variante?: VariantePao }) {
  const c = PAO[variante];
  return (
    <svg viewBox={`0 0 ${W} 44`} width="100%" aria-hidden>
      <path d="M14 8 Q14 4 22 4 L298 4 Q306 4 306 8 L306 22 Q306 40 160 40 Q14 40 14 22 Z" fill={c.sombra} />
      <path d="M14 8 Q14 4 22 4 L298 4 Q306 4 306 8 L306 13 Q160 20 14 13 Z" fill={c.luz} />
    </svg>
  );
}

/** Pão de cima: cúpula com gergelim. Sobe conforme a pilha cresce. */
export function PaoCima({ variante = "brioche" }: { variante?: VariantePao }) {
  const c = PAO[variante];
  return (
    <svg viewBox={`0 0 ${W} 74`} width="100%" aria-hidden>
      <path d="M12 70 Q6 32 60 14 Q110 -2 160 -2 Q210 -2 260 14 Q314 32 308 70 Z" fill={c.base} />
      <path d="M12 70 Q6 40 40 24 Q120 44 300 30 Q312 48 308 70 Z" fill={c.sombra} opacity="0.55" />
      {[
        [96, 34, -18],
        [148, 24, 6],
        [206, 32, 14],
        [124, 50, -8],
        [186, 52, 10],
        [252, 46, -12],
        [66, 52, 4],
      ].map(([x, y, r], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="6"
          ry="3.4"
          fill={c.gergelim}
          transform={`rotate(${r} ${x} ${y})`}
        />
      ))}
    </svg>
  );
}

/** Blend: borda irregular e marcas de brasa. */
export function Carne() {
  return (
    <svg viewBox={`0 0 ${W} 36`} width="100%" aria-hidden>
      <path
        d="M8 14 Q8 4 30 4 L292 4 Q312 4 312 14 L312 22 Q312 32 292 32 L28 32 Q8 32 8 22 Z"
        fill="#4A2318"
      />
      <path d="M8 14 Q8 4 30 4 L292 4 Q312 4 312 14 Q160 22 8 14 Z" fill="#5C2E1E" />
      {[
        [54, 12],
        [118, 10],
        [178, 14],
        [244, 11],
        [286, 16],
        [88, 22],
        [212, 24],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="9" ry="2.2" fill="#2E1410" opacity="0.55" />
      ))}
    </svg>
  );
}

/**
 * Queijo: a fatia assenta e, meio segundo depois, três fios escorrem pelas
 * laterais — é o detalhe que vende "derretido".
 */
export function Queijo() {
  const reduced = useReducedMotion();
  const drips = [
    { x: 52, w: 22, h: 20 },
    { x: 148, w: 26, h: 26 },
    { x: 236, w: 20, h: 17 },
  ];

  return (
    <svg viewBox={`0 0 ${W} 44`} width="100%" aria-hidden style={{ overflow: "visible" }}>
      <path d="M10 6 L310 6 L306 22 L14 22 Z" fill="#E8B33C" />
      <path d="M10 6 L310 6 L308 12 L12 12 Z" fill="#F3C960" />
      {drips.map((d, i) => (
        <motion.path
          key={i}
          d={`M${d.x} 20 L${d.x + d.w} 20 L${d.x + d.w - 3} ${20 + d.h} Q${d.x + d.w / 2} ${
            20 + d.h + 7
          } ${d.x + 3} ${20 + d.h} Z`}
          fill="#E8B33C"
          initial={reduced ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          style={{ originY: 0, transformBox: "fill-box" }}
          transition={{ duration: 0.9, delay: 0.45 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </svg>
  );
}

/** Bacon: duas tiras onduladas que balançam de leve, como se ainda estalassem. */
export function Bacon() {
  const reduced = useReducedMotion();

  return (
    <motion.svg
      viewBox={`0 0 ${W} 26`}
      width="100%"
      aria-hidden
      animate={reduced ? undefined : { rotate: [0, -0.8, 0.8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {[2, 13].map((offset, row) => (
        <g key={row}>
          <path
            d={`M14 ${offset + 6} Q60 ${offset} 106 ${offset + 6} Q152 ${offset + 12} 198 ${
              offset + 6
            } Q252 ${offset} 306 ${offset + 7} L306 ${offset + 12} Q252 ${offset + 5} 198 ${
              offset + 11
            } Q152 ${offset + 17} 106 ${offset + 11} Q60 ${offset + 5} 14 ${offset + 11} Z`}
            fill="#A83E27"
          />
          <path
            d={`M14 ${offset + 8} Q60 ${offset + 2} 106 ${offset + 8} Q152 ${offset + 14} 198 ${
              offset + 8
            } Q252 ${offset + 2} 306 ${offset + 9}`}
            stroke="#E9C7A8"
            strokeWidth="2"
            fill="none"
            opacity="0.75"
          />
        </g>
      ))}
    </motion.svg>
  );
}

/** Cebola na chapa: fatias translúcidas sobrepostas. */
export function Cebola() {
  return (
    <svg viewBox={`0 0 ${W} 24`} width="100%" aria-hidden>
      {[30, 96, 162, 228].map((x, i) => (
        <g key={i} opacity="0.92">
          <path
            d={`M${x} 14 Q${x + 30} 2 ${x + 62} 14 Q${x + 30} 22 ${x} 14 Z`}
            fill="#E3CBA3"
          />
          <path
            d={`M${x + 12} 13 Q${x + 30} 7 ${x + 50} 13`}
            stroke="#C9A87A"
            strokeWidth="1.5"
            fill="none"
          />
        </g>
      ))}
    </svg>
  );
}

/** Picles: rodelas com miolo mais claro. */
export function Picles() {
  return (
    <svg viewBox={`0 0 ${W} 22`} width="100%" aria-hidden>
      {[54, 128, 202, 262].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy="11" rx="27" ry="9" fill="#6E8236" />
          <ellipse cx={x} cy="11" rx="19" ry="5.5" fill="#89A047" />
          <ellipse cx={x} cy="10" rx="8" ry="2.4" fill="#A8BC63" opacity="0.8" />
        </g>
      ))}
    </svg>
  );
}

/** Molho da brasa: fio irregular atravessando a pilha. */
export function Molho() {
  return (
    <svg viewBox={`0 0 ${W} 18`} width="100%" aria-hidden>
      <path
        d="M16 9 Q52 1 88 9 Q124 17 160 9 Q196 1 232 9 Q268 17 304 8 L304 14 Q268 22 232 14 Q196 6 160 14 Q124 22 88 14 Q52 6 16 14 Z"
        fill="#C4442A"
      />
    </svg>
  );
}

/** Fumaça da carne: três fios que sobem e somem, em loop. */
export function Fumaca() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 -top-24 h-24" aria-hidden>
      {[
        { left: "32%", delay: 0, dur: 4.5 },
        { left: "50%", delay: 1.4, dur: 5.2 },
        { left: "68%", delay: 2.6, dur: 4.8 },
      ].map((s, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 h-16 w-10 rounded-full bg-bone/20 blur-xl"
          style={{ left: s.left }}
          initial={{ opacity: 0, y: 10, scale: 0.6 }}
          animate={{ opacity: [0, 0.5, 0], y: -70, scale: 1.5, x: [0, 8, -6, 4] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}


/** Costela desfiada: fibras longas em vez de disco liso. */
export function Costela() {
  return (
    <svg viewBox={`0 0 ${W} 34`} width="100%" aria-hidden>
      <path d="M10 12 Q10 4 32 4 L290 4 Q310 4 310 12 L310 22 Q310 30 288 30 L30 30 Q10 30 10 22 Z" fill="#5B2A15" />
      {[9, 15, 21, 26].map((y, i) => (
        <path
          key={i}
          d={`M${22 + i * 6} ${y} Q${110 + i * 10} ${y - 3} ${200 - i * 8} ${y + 2} Q${260 + i * 6} ${y + 4} ${298 - i * 4} ${y}`}
          stroke="#7E4022"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
      ))}
    </svg>
  );
}

/** Frango grelhado: peça mais clara com marcas de grelha. */
export function Frango() {
  return (
    <svg viewBox={`0 0 ${W} 32`} width="100%" aria-hidden>
      <path d="M12 12 Q12 4 34 4 L288 4 Q308 4 308 12 L308 20 Q308 28 286 28 L32 28 Q12 28 12 20 Z" fill="#C58A4A" />
      <path d="M12 12 Q12 4 34 4 L288 4 Q308 4 308 12 Q160 18 12 12 Z" fill="#D8A063" />
      {[70, 132, 194, 254].map((x, i) => (
        <rect key={i} x={x} y="8" width="5" height="16" rx="2.5" fill="#8A5A2C" opacity="0.65" />
      ))}
    </svg>
  );
}

/** Cheddar maturado: mesma silhueta do prato, tom mais fechado. */
export function Cheddar() {
  const reduced = useReducedMotion();
  return (
    <svg viewBox={`0 0 ${W} 44`} width="100%" aria-hidden style={{ overflow: "visible" }}>
      <path d="M10 6 L310 6 L306 22 L14 22 Z" fill="#D97A22" />
      <path d="M10 6 L310 6 L308 12 L12 12 Z" fill="#EE9438" />
      {[
        { x: 68, w: 24, h: 22 },
        { x: 176, w: 22, h: 18 },
      ].map((d, i) => (
        <motion.path
          key={i}
          d={`M${d.x} 20 L${d.x + d.w} 20 L${d.x + d.w - 3} ${20 + d.h} Q${d.x + d.w / 2} ${20 + d.h + 6} ${d.x + 3} ${20 + d.h} Z`}
          fill="#D97A22"
          initial={reduced ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          style={{ originY: 0, transformBox: "fill-box" }}
          transition={{ duration: 0.9, delay: 0.45 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </svg>
  );
}

/** Queijo coalho: não derrete — ganha marcas de grelha em vez de escorrer. */
export function Coalho() {
  return (
    <svg viewBox={`0 0 ${W} 26`} width="100%" aria-hidden>
      <rect x="26" y="5" width="268" height="17" rx="4" fill="#F0E4CC" />
      <rect x="26" y="5" width="268" height="6" rx="3" fill="#F8F1E2" />
      {[60, 118, 176, 234].map((x, i) => (
        <rect key={i} x={x} y="8" width="22" height="4" rx="2" fill="#C9A87A" opacity="0.85" />
      ))}
    </svg>
  );
}

/** Mapa id -> peça. Usado pela bancada para montar a pilha. */
export const PECAS: Record<string, () => React.ReactElement> = {
  carne: Carne,
  costela: Costela,
  frango: Frango,
  cheddar: Cheddar,
  coalho: Coalho,
  queijo: Queijo,
  bacon: Bacon,
  cebola: Cebola,
  picles: Picles,
  molho: Molho,
};
