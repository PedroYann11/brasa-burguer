import type { Config } from "tailwindcss";

/**
 * Tokens de design.
 * As cores apontam para CSS variables (globals.css) para que, no futuro,
 * o painel administrativo consiga trocar a identidade visual em runtime
 * apenas sobrescrevendo as variáveis no elemento <html>.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--c-ink) / <alpha-value>)", // fundo base
        coal: "rgb(var(--c-coal) / <alpha-value>)", // superfícies elevadas
        ember: "rgb(var(--c-ember) / <alpha-value>)", // acento principal (brasa)
        mustard: "rgb(var(--c-mustard) / <alpha-value>)", // acento secundário
        bone: "rgb(var(--c-bone) / <alpha-value>)", // texto principal
        ash: "rgb(var(--c-ash) / <alpha-value>)", // texto de apoio (8.7:1 sobre ink)
        "ash-dim": "rgb(var(--c-ash-dim) / <alpha-value>)", // decorativo, nunca texto
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      maxWidth: {
        shell: "84rem",
      },
      borderRadius: {
        shell: "2.25rem",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
