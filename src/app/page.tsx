import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { HeatSeam } from "@/components/ui/HeatSeam";
import { Sobre } from "@/components/sections/Sobre";
import { Cardapio } from "@/components/sections/Cardapio";
import { BurgerBuilder } from "@/components/sections/BurgerBuilder";
import { Avaliacoes } from "@/components/sections/Avaliacoes";
import { Contato } from "@/components/sections/Contato";

/**
 * Composição da landing page.
 *
 * A transição hero -> página é estrutural, não um efeito empilhado:
 * a hero é `sticky z-0` e este <main> é `z-10` com o topo arredondado.
 * O conteúdo desliza por cima do vídeo como uma folha; o `shadow` superior
 * e a `HeatSeam` (fio de brasa) aquecem a emenda em vez de cortá-la.
 *
 * Ritmo das seções: nenhuma usa borda de separação. A respiração vem do
 * espaçamento vertical generoso e da alternância de colunas — cada seção
 * começa em um ponto diferente da grade, o que evita o empilhamento
 * monótono de blocos centralizados.
 *
 * Ordem deliberada: o cardápio vem primeiro porque é o que converte.
 * Sobre e Avaliações ficam depois, curtas, como lastro da decisão — não
 * como leitura obrigatória antes de ver o produto.
 *
 * Ordem das seções vive aqui. Para acrescentar uma nova, basta criar o
 * componente em `components/sections`, importar e posicionar.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      <main className="relative z-10 -mt-[6svh] overflow-hidden rounded-t-shell bg-ink shadow-[0_-40px_80px_-20px_rgb(var(--c-ink)/0.9)]">
        <HeatSeam />
        <Cardapio />
        <BurgerBuilder />
        <Sobre />
        <Avaliacoes />
        <Contato />
      </main>

      <Footer />
    </>
  );
}
