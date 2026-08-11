/**
 * Registro central do GSAP.
 * Todo componente importa daqui — evita registrar o ScrollTrigger em
 * vários lugares e garante que o plugin só é tocado no client.
 */
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  // registerPlugin é idempotente: registrar duas vezes não causa efeito colateral.
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
