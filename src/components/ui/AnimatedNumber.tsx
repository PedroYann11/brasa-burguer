"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";

/**
 * Número que sobe até o valor novo em vez de trocar de golpe.
 * Usado no preço da bancada — o movimento comunica "algo foi somado".
 * Reutilizável em qualquer contador do site.
 */
export function AnimatedNumber({
  value,
  prefix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(value);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const format = (n: number) =>
      `${prefix}${n.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`;

    if (reduced) {
      node.textContent = format(value);
      from.current = value;
      return;
    }

    const controls = animate(from.current, value, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    from.current = value;
    return () => controls.stop();
  }, [value, prefix, decimals, reduced]);

  return <span ref={ref}>{`${prefix}${value.toFixed(decimals)}`}</span>;
}
