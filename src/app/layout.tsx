import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { site } from "@/config/site";
import { CarrinhoProvider } from "@/context/carrinho";
import { CartDrawer } from "@/components/ui/CartDrawer";
import "./globals.css";

/** Display: peso e largura variáveis, usado apenas em títulos. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/** Corpo de texto. */
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/** Utilitário: eyebrows, preços, rótulos de comanda. */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.brand.name} · ${site.brand.tagline}`,
  description: site.hero.subtitle,
};

export const viewport: Viewport = {
  themeColor: "#140A0C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        {/* O carrinho envolve a árvore toda: cardápio, bancada e navbar
            precisam do mesmo estado. A gaveta fica aqui para poder cobrir
            qualquer seção da página. */}
        <CarrinhoProvider>
          {children}
          <CartDrawer />
        </CarrinhoProvider>
      </body>
    </html>
  );
}
