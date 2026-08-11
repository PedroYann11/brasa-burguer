import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect no browser, useEffect no servidor.
 * Necessário para animações GSAP sem warning de SSR.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
