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
 * SELETOR DE FAMÍLIA (abas): Pão, Carne, Queijo e Extras ficam numa linha
 * de abas curtas — 2 colunas no celular (pão+carne em cima, queijo+extras
 * embaixo) e as 4 numa linha só a partir de `sm`. Tocar numa aba abre um
 * painel único com as opções daquela família; só um painel fica aberto por
 * vez, então a página nunca cresce mais do que "abas + um painel" — o
 * hambúrguer continua por perto mesmo quando o cliente chega em "Extras".
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
  /** Família com o painel aberto no momento (só uma por vez). Começa no pão. */
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

  const grupoAberto = grupos.find((g) => g.id === aberto) ?? null;

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

        {/*
          `flex flex-col` (não `grid` puro) abaixo de `lg`: um grid sem
          colunas explícitas cria uma única coluna implícita cuja largura é
          "auto" — se algum texto lá dentro não puder quebrar linha (ex.: o
          resumo de vários extras selecionados, tudo numa string só), essa
          coluna cresce pra caber o conteúdo e empurra a página inteira pra
          o lado. `flex` não tem esse problema: os itens sempre respeitam a
          largura do contêiner.
        */}
        <div className="mt-14 flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-10">
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

          {/* ——— ESCOLHAS (abas por família + painel único) ——— */}
          <div className="lg:col-span-5 lg:order-1">
            {/* 2 colunas no celular (pão+carne em cima, queijo+extras
                embaixo); 4 numa linha só a partir de `sm` — testado: com
                nome + contador, 4 numa linha espreme demais abaixo disso. */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {grupos.map((g) => {
                const usados = contaGrupo(g.id);
                const feito = g.id === "pao" ? true : usados > 0;
                const estaAberto = aberto === g.id;

                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setAberto(estaAberto ? null : g.id)}
                    aria-expanded={estaAberto}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-3.5 text-center transition-all duration-300 ease-soft ${
                      estaAberto
                        ? "border-ember bg-ember/10 text-bone"
                        : "border-bone/15 text-bone/80 hover:border-ember/50 hover:text-bone"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          feito ? "bg-ember" : "bg-ash-dim"
                        }`}
                      />
                      {g.titulo}
                    </span>
                    <span className="font-mono text-[0.6875rem] text-ash">
                      {g.id === "pao" ? pao.nome : `${usados}/${g.max}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* painel da família ativa — só um por vez, então a página não
                fica mais alta conforme o cliente navega entre famílias.
                `key={grupoAberto.id}` força a remontagem ao trocar de
                família, então o próprio React já troca o conteúdo — sem
                depender do `exit` do AnimatePresence, que em teste ficava
                preso na família anterior (mode="wait" nunca completava a
                saída) e deixava o painel errado na tela. */}
            {grupoAberto ? (
              <motion.div
                key={grupoAberto.id}
                initial={reduced ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 rounded-2xl border border-bone/10 bg-bone/[0.03] p-4"
              >
                  <div className="flex items-baseline justify-between gap-3 pb-1">
                    <p className="ticket-label">{grupoAberto.titulo}</p>
                    {grupoAberto.id !== "pao" ? (
                      <p className="font-mono text-xs text-ash">
                        {contaGrupo(grupoAberto.id)}/{grupoAberto.max}
                        {grupoAberto.obrigatorio ? " · obrigatório" : ""}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {grupoAberto.opcoes.map((op) => {
                      const usadosIds = new Set(
                        camadas.filter((c) => c.grupo === grupoAberto.id).map((c) => c.ing.id),
                      );
                      const ativo = grupoAberto.id === "pao" ? pao.id === op.id : usadosIds.has(op.id);
                      const cheio =
                        grupoAberto.id !== "pao" && contaGrupo(grupoAberto.id) >= (grupoAberto.max ?? 99);
                      const bloqueado = grupoAberto.id !== "pao" && cheio && !ativo;
                      const removivel = ativo && grupoAberto.id !== "pao";

                      return (
                        <button
                          key={op.id}
                          type="button"
                          disabled={bloqueado}
                          aria-pressed={ativo}
                          title={removivel ? `Toque para remover ${op.nome}` : undefined}
                          onClick={() => {
                            if (grupoAberto.id === "pao") {
                              setPao(op);
                              abrirProximo(grupoAberto.id);
                            } else {
                              alternarIngrediente(op, grupoAberto.id, grupoAberto.max ?? 99);
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

            {/* ——— COMANDA ——— */}
            <div className="mt-8 border-t border-bone/10 pt-7">
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
