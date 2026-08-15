"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site, type Ingrediente } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { PECAS, PaoBaixo, PaoCima, Fumaca, type VariantePao } from "@/components/builder/BurgerLayers";
import { Sparks } from "@/components/builder/Sparks";
import { useCarrinho } from "@/context/carrinho";

/**
 * MONTE SEU HAMBÚRGUER — bancada interativa.
 *
 * Não é formulário: nenhum checkbox, select ou lista de marcar. A bancada
 * começa vazia e os ingredientes ficam organizados em blocos por família
 * (pão, carne, queijo, extras). Tocar em um faz a peça voar até a pilha,
 * assentar e soltar faíscas — e o hambúrguer ganha altura de verdade.
 * Tocar de novo num ingrediente já usado remove só aquela peça (sem
 * precisar limpar a bancada inteira).
 *
 * ESTRUTURA EM BLOCOS (accordion): cada família é uma linha fechada, com
 * o resumo da escolha já visível ("Carne — Blend 180g"). Tocar na linha
 * abre só as opções daquela família — as outras ficam fechadas. Isso
 * substitui a lista longa e "espremida" que existia antes: no celular,
 * mostrar as quatro famílias abertas ao mesmo tempo empurrava o
 * hambúrguer pra fora de tela e obrigava a subir e descer a página toda
 * hora. Com blocos, cabe tudo numa tela só e o cliente sempre sabe em
 * qual família está.
 *
 * Regras dos grupos vêm de `site.builder.grupos`:
 *   pão    -> escolha única, troca a peça de baixo e de cima
 *   carne  -> até 2 camadas, podem ser diferentes
 *   queijo -> até 2 camadas
 *   extras -> até 4 camadas
 *
 * Comportamento das peças: queijo escorre, bacon ondula, carne solta fumaça.
 * O desenho do hambúrguer fica parado — só as peças que se empilham é que
 * animam. Quando os grupos obrigatórios estão atendidos, o botão de
 * adicionar ao carrinho aparece.
 */

/** Altura visual da base do pão de baixo (px) — onde a pilha começa. */
const BASE = 24;

type Camada = { chave: string; ing: Ingrediente; grupo: string };

export function BurgerBuilder() {
  const { eyebrow, titulo, descricao, precoBase, grupos } = site.builder;
  const reduced = useReducedMotion();
  const { adicionar, abrir } = useCarrinho();

  const grupoPao = grupos.find((g) => g.id === "pao")!;
  const [pao, setPao] = useState<Ingrediente>(grupoPao.opcoes[0]);
  const [camadas, setCamadas] = useState<Camada[]>([]);
  const [ultimo, setUltimo] = useState<{ chave: string; bottom: number } | null>(null);
  /** Família aberta no momento (accordion: só uma por vez). Começa no pão. */
  const [aberto, setAberto] = useState<string | null>(grupos[0]?.id ?? null);

  /** Grupos obrigatórios (carne e queijo) precisam de ao menos uma camada. */
  const completo = grupos
    .filter((g) => g.obrigatorio && g.id !== "pao")
    .every((g) => camadas.some((c) => c.grupo === g.id));

  const preco = useMemo(
    () => precoBase + pao.preco + camadas.reduce((s, c) => s + c.ing.preco, 0),
    [precoBase, pao, camadas],
  );

  const offsets = useMemo(() => {
    let acc = BASE;
    const map: Record<string, number> = {};
    for (const c of camadas) {
      map[c.chave] = acc;
      acc += c.ing.altura;
    }
    return { map, topo: acc };
  }, [camadas]);

  const contaGrupo = (id: string) => camadas.filter((c) => c.grupo === id).length;

  /** Abre a próxima família da lista (usado depois de escolher o pão, pra guiar o fluxo). */
  const abrirProximo = (grupoId: string) => {
    const idx = grupos.findIndex((g) => g.id === grupoId);
    setAberto(grupos[idx + 1]?.id ?? null);
  };

  /**
   * Toca em um ingrediente: se ele já está na pilha, remove essa camada
   * (o "desfazer" pedido pelo cliente); se não está, adiciona — respeitando
   * o teto do grupo. Cada ingrediente vira um toggle, não um contador.
   */
  const alternarIngrediente = (ing: Ingrediente, grupoId: string, max: number) => {
    const existente = camadas.find((c) => c.grupo === grupoId && c.ing.id === ing.id);

    if (existente) {
      setCamadas((atual) => atual.filter((c) => c.chave !== existente.chave));
      setUltimo(null);
      return;
    }

    if (contaGrupo(grupoId) >= max) return;
    const chave = `${ing.id}-${Date.now()}`;
    let acc = BASE;
    for (const c of camadas) acc += c.ing.altura;
    setCamadas((atual) => [...atual, { chave, ing, grupo: grupoId }]);
    setUltimo({ chave, bottom: acc });
  };

  const enviarAoCarrinho = () => {
    const resumo = [pao.nome, ...camadas.map((c) => c.ing.nome)].join(", ");
    adicionar({
      uid: `montado-${Date.now()}`,
      nome: "Seu hambúrguer",
      detalhe: resumo,
      preco,
    });
    setCamadas([]);
    setUltimo(null);
    setAberto(grupos[0]?.id ?? null);
    abrir(true);
  };

  return (
    <section id="monte" className="scroll-mt-24 py-24 md:py-32">
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

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-10">
          {/* ——— BANCADA ——— */}
          <div className="lg:col-span-6 lg:order-2">
            <div className="relative flex min-h-[300px] items-end justify-center lg:min-h-[420px] lg:sticky lg:top-28">
              <div className="relative h-[360px] w-[290px] overflow-x-clip sm:w-[330px]">
                {/* sombra de contato */}
                <div
                  className="absolute bottom-1 left-1/2 h-5 w-[86%] -translate-x-1/2 rounded-[50%] bg-ink/80 blur-lg"
                  aria-hidden
                />

                <div className="absolute inset-x-0 bottom-0">
                  <PaoBaixo variante={pao.peca as VariantePao} />
                </div>

                <AnimatePresence>
                  {camadas.map((c, i) => {
                    const Peca = PECAS[c.ing.peca];
                    if (!Peca) return null;
                    const daEsquerda = i % 2 === 0;
                    return (
                      <motion.div
                        key={c.chave}
                        className="absolute inset-x-0"
                        style={{ zIndex: 10 + i }}
                        initial={
                          reduced
                            ? { opacity: 0, bottom: offsets.map[c.chave] }
                            : {
                                opacity: 0,
                                x: daEsquerda ? -300 : 300,
                                y: -130,
                                rotate: daEsquerda ? -35 : 35,
                                bottom: offsets.map[c.chave],
                              }
                        }
                        animate={{ opacity: 1, x: 0, y: 0, rotate: 0, bottom: offsets.map[c.chave] }}
                        exit={{ opacity: 0, y: 24 }}
                        transition={
                          reduced
                            ? { duration: 0.2 }
                            : { type: "spring", stiffness: 130, damping: 14, mass: 0.9 }
                        }
                      >
                        <div className="relative">
                          <Peca />
                          {c.ing.peca === "carne" || c.ing.peca === "costela" ? <Fumaca /> : null}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                <motion.div
                  className="absolute inset-x-0"
                  style={{ zIndex: 50 }}
                  animate={{ bottom: offsets.topo }}
                  transition={
                    reduced
                      ? { duration: 0.2 }
                      : { type: "spring", stiffness: 120, damping: 16, mass: 1 }
                  }
                >
                  <PaoCima variante={pao.peca as VariantePao} />
                </motion.div>

                {ultimo ? <Sparks key={ultimo.chave} bottom={ultimo.bottom} /> : null}
              </div>
            </div>
          </div>

          {/* ——— ESCOLHAS (blocos por família) ——— */}
          <div className="lg:col-span-5 lg:order-1">
            <div className="divide-y divide-bone/10 border-y border-bone/10">
              {grupos.map((g) => {
                const usados = contaGrupo(g.id);
                const cheio = g.id !== "pao" && usados >= (g.max ?? 99);
                const usadosIds = new Set(
                  camadas.filter((c) => c.grupo === g.id).map((c) => c.ing.id),
                );
                const estaAberto = aberto === g.id;
                const resumo =
                  g.id === "pao"
                    ? pao.nome
                    : camadas
                        .filter((c) => c.grupo === g.id)
                        .map((c) => c.ing.nome)
                        .join(", ") || "Toque para escolher";

                return (
                  <div key={g.id}>
                    <button
                      type="button"
                      onClick={() => setAberto(estaAberto ? null : g.id)}
                      aria-expanded={estaAberto}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="min-w-0">
                        <span className="ticket-label block">{g.titulo}</span>
                        <span className="mt-1 block truncate text-sm text-bone/90">{resumo}</span>
                      </span>

                      <span className="flex shrink-0 items-center gap-3">
                        {g.id !== "pao" ? (
                          <span className="font-mono text-xs text-ash">
                            {usados}/{g.max}
                            {g.obrigatorio ? " · obrigatório" : ""}
                          </span>
                        ) : null}
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          aria-hidden
                          className={`h-4 w-4 text-ash transition-transform duration-300 ease-soft ${
                            estaAberto ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {estaAberto ? (
                        <motion.div
                          initial={reduced ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-2.5 pb-6">
                            {g.opcoes.map((op) => {
                              const ativo = g.id === "pao" ? pao.id === op.id : usadosIds.has(op.id);
                              const bloqueado = g.id !== "pao" && cheio && !ativo;
                              const removivel = ativo && g.id !== "pao";

                              return (
                                <button
                                  key={op.id}
                                  type="button"
                                  disabled={bloqueado}
                                  aria-pressed={ativo}
                                  title={removivel ? `Toque para remover ${op.nome}` : undefined}
                                  onClick={() => {
                                    if (g.id === "pao") {
                                      setPao(op);
                                      abrirProximo(g.id);
                                    } else {
                                      alternarIngrediente(op, g.id, g.max ?? 99);
                                    }
                                  }}
                                  className={`flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm transition-all duration-300 ease-soft ${
                                    ativo
                                      ? "border-ember bg-ember/10 text-bone"
                                      : bloqueado
                                        ? "border-bone/5 text-ash-dim"
                                        : "border-bone/20 text-bone hover:border-ember/60 hover:bg-ember/5"
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                      ativo ? "bg-ember" : bloqueado ? "bg-ash-dim" : "bg-ember/60"
                                    }`}
                                  />
                                  {op.nome}
                                  {removivel ? (
                                    <span className="font-mono text-xs text-ember/80">remover</span>
                                  ) : op.preco > 0 ? (
                                    <span className="font-mono text-xs text-ash">+{op.preco}</span>
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* ——— COMANDA ——— */}
            <div className="mt-8 border-b border-bone/10 pb-7">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="ticket-label">
                    {camadas.length === 0
                      ? "Bancada vazia"
                      : `${camadas.length} camada${camadas.length > 1 ? "s" : ""}`}
                  </p>
                  <p className="mt-2 font-display text-4xl tracking-tightest text-bone">
                    <AnimatedNumber value={preco} prefix="R$ " decimals={2} />
                  </p>
                </div>

                {camadas.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCamadas([]);
                      setUltimo(null);
                    }}
                    className="pb-1 text-sm text-ash transition-colors hover:text-bone"
                  >
                    Limpar
                  </button>
                ) : null}
              </div>

              <AnimatePresence>
                {completo ? (
                  <motion.button
                    type="button"
                    onClick={enviarAoCarrinho}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-6 w-full rounded-full bg-ember px-7 py-4 text-sm font-semibold text-ink transition-colors hover:bg-mustard"
                  >
                    Adicionar ao pedido
                  </motion.button>
                ) : (
                  <p className="mt-6 text-sm text-ash">
                    Escolha ao menos uma carne e um queijo para fechar o hambúrguer.
                  </p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
