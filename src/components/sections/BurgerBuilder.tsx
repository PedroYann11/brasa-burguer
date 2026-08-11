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
 * começa vazia e os ingredientes ficam ao redor, agrupados por função
 * (pão, carne, queijo, extras). Tocar em um faz a peça voar até a pilha,
 * girar, assentar e soltar faíscas — e o hambúrguer ganha altura de verdade.
 *
 * Regras dos grupos vêm de `site.builder.grupos`:
 *   pão    -> escolha única, troca a peça de baixo e de cima
 *   carne  -> até 2 camadas, podem ser diferentes
 *   queijo -> até 2 camadas
 *   extras -> até 4 camadas
 *
 * Comportamento das peças: queijo escorre, bacon ondula, carne solta fumaça.
 * Quando os grupos obrigatórios estão atendidos, o hambúrguer gira devagar
 * e o botão de adicionar ao carrinho aparece.
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

  const adicionarCamada = (ing: Ingrediente, grupoId: string, max: number) => {
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

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ——— BANCADA ——— */}
          <div className="lg:col-span-6 lg:order-2">
            <div
              className="relative flex min-h-[420px] items-end justify-center lg:sticky lg:top-28"
              style={{ perspective: 1200 }}
            >
              <motion.div
                className="relative h-[360px] w-[290px] sm:w-[330px]"
                animate={completo && !reduced ? { rotateY: 360 } : { rotateY: 0 }}
                transition={
                  completo && !reduced
                    ? { duration: 18, repeat: Infinity, ease: "linear" }
                    : { duration: 0.6 }
                }
                style={{ transformStyle: "preserve-3d" }}
              >
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
              </motion.div>
            </div>
          </div>

          {/* ——— ESCOLHAS ——— */}
          <div className="lg:col-span-5 lg:order-1">
            <div className="space-y-9">
              {grupos.map((g) => {
                const usados = contaGrupo(g.id);
                const cheio = g.id !== "pao" && usados >= (g.max ?? 99);

                return (
                  <div key={g.id}>
                    <div className="flex items-baseline justify-between border-b border-bone/10 pb-3">
                      <p className="ticket-label">{g.titulo}</p>
                      <p className="font-mono text-xs text-ash">
                        {g.id === "pao"
                          ? pao.nome
                          : `${usados}/${g.max} ${g.obrigatorio ? "· obrigatório" : ""}`}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {g.opcoes.map((op) => {
                        const ativo = g.id === "pao" && pao.id === op.id;
                        const bloqueado = g.id !== "pao" && cheio;

                        return (
                          <button
                            key={op.id}
                            type="button"
                            disabled={bloqueado}
                            onClick={() =>
                              g.id === "pao"
                                ? setPao(op)
                                : adicionarCamada(op, g.id, g.max ?? 99)
                            }
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
                            {op.preco > 0 ? (
                              <span className="font-mono text-xs text-ash">+{op.preco}</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ——— COMANDA ——— */}
            <div className="mt-10 border-t border-bone/10 pt-7">
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
