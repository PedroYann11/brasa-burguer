"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site, type Categoria, type MenuItem } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ItemArt } from "@/components/builder/ItemArt";
import { useCarrinho } from "@/context/carrinho";
import { brl } from "@/lib/format";

/**
 * CARDÁPIO — seção principal da página.
 *
 * Navegação por categoria em abas de fio (Hambúrgueres, Entradas, Bebidas,
 * Combos): a marca ativa é um traço de brasa que desliza entre as abas,
 * usando layoutId — um só elemento se move, em vez de vários acenderem.
 *
 * Cada item mostra a ilustração do produto sobre fundo claro, nome, uma
 * linha de descrição, preço e o botão de adicionar. Sem card com borda,
 * sombra ou elevação: o recorte da imagem já separa um item do outro.
 */
function Item({ item, index }: { item: MenuItem; index: number }) {
  const { adicionar } = useCarrinho();
  const reduced = useReducedMotion();

  return (
    <motion.article
      layout
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <ItemArt arte={item.arte} foto={item.foto} alt={item.nome} />

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="flex items-baseline gap-2.5 font-display text-2xl tracking-tightest text-bone">
          {item.nome}
          {item.destaque ? <span className="ticket-label text-ember">Da casa</span> : null}
        </h3>
        <p className="shrink-0 font-mono text-base text-bone/90">{brl(item.preco)}</p>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-ash">{item.descricao}</p>

      <button
        type="button"
        onClick={() =>
          adicionar({ uid: item.id, nome: item.nome, detalhe: item.descricao, preco: item.preco })
        }
        className="mt-4 w-full rounded-full border border-bone/20 py-3 text-sm font-semibold text-bone transition-colors duration-300 ease-soft hover:border-ember hover:bg-ember hover:text-ink"
      >
        Adicionar
      </button>
    </motion.article>
  );
}

export function Cardapio() {
  const { eyebrow, titulo, descricao, categorias, itens } = site.cardapio;
  const [ativa, setAtiva] = useState<Categoria>(categorias[0]);

  const visiveis = itens.filter((i) => i.categoria === ativa);

  return (
    <section id="cardapio" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <Reveal>
          <header className="max-w-2xl">
            <p className="ticket-label">{eyebrow}</p>
            <h2 className="mt-5 font-display text-5xl tracking-tightest text-bone md:text-6xl">
              {titulo}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ash md:text-lg">{descricao}</p>
          </header>
        </Reveal>

        {/* Abas de categoria */}
        <Reveal delay={0.08}>
          <div className="mt-12 -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
            <div className="flex min-w-max gap-8 border-b border-bone/10">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setAtiva(cat)}
                  aria-current={cat === ativa}
                  className={`relative pb-4 text-sm font-semibold transition-colors duration-300 ${
                    cat === ativa ? "text-bone" : "text-ash hover:text-bone"
                  }`}
                >
                  {cat}
                  {cat === ativa ? (
                    <motion.span
                      layoutId="aba-ativa"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-ember"
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Grade de itens */}
        <AnimatePresence mode="wait">
          <motion.div
            key={ativa}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visiveis.map((item, i) => (
              <Item key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
