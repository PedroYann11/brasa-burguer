/**
 * FONTE ÚNICA DE CONTEÚDO
 *
 * Nenhum componente contém texto, preço ou link fixo no JSX.
 * Tudo que o cliente precisará editar no painel administrativo mora aqui.
 *
 * ATENÇÃO: o bloco `hero` é da Fase 1 e está aprovado — não alterar.
 */

export type NavLink = { label: string; href: string };

/**
 * Ilustração do item. Enquanto não houver fotos reais dos produtos, cada
 * item é desenhado em vetor com as mesmas camadas da bancada — padrão
 * idêntico entre todos e sem depender de banco de imagens.
 *
 * `foto` tem prioridade: assim que o cliente subir a foto do produto real,
 * ela substitui a ilustração automaticamente.
 */
export type Arte =
  | { tipo: "burger"; camadas: string[] }
  | { tipo: "fritas" }
  | { tipo: "espeto" }
  | { tipo: "copo"; cor: string }
  | { tipo: "combo"; camadas: string[] };

export type Categoria = "Hambúrgueres" | "Entradas" | "Bebidas" | "Combos";

export type MenuItem = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: Categoria;
  arte: Arte;
  /** Caminho da foto real (ex.: "/fotos/brasa.jpg"). Vazio = usa a arte. */
  foto?: string;
  destaque?: boolean;
};

/** Grupo de escolha na bancada. */
export type GrupoIngrediente = {
  id: string;
  titulo: string;
  /** "unico" troca a peça; "multiplo" acumula camadas. */
  modo: "unico" | "multiplo";
  /** Obrigatório para o hambúrguer ficar pronto. */
  obrigatorio: boolean;
  /** Teto de itens em grupos múltiplos. */
  max?: number;
  opcoes: Ingrediente[];
};

export type Ingrediente = {
  id: string;
  nome: string;
  preco: number;
  /** Altura da camada na pilha (px) — define o volume ganho. */
  altura: number;
  /** Peça SVG usada para desenhar (ver BurgerLayers). */
  peca: string;
};

export type Avaliacao = { id: string; texto: string; autor: string; origem: string };

export type SiteConfig = {
  brand: { name: string; tagline: string };
  nav: NavLink[];
  hero: {
    eyebrow: string;
    titleLines: string[];
    subtitle: string;
    primaryCta: NavLink;
    secondaryCta: NavLink;
    video: { src: string; poster: string };
  };
  cardapio: {
    eyebrow: string;
    titulo: string;
    descricao: string;
    categorias: Categoria[];
    itens: MenuItem[];
  };
  builder: {
    eyebrow: string;
    titulo: string;
    descricao: string;
    precoBase: number;
    grupos: GrupoIngrediente[];
  };
  sobre: { eyebrow: string; titulo: string; texto: string; fatos: { valor: string; rotulo: string }[] };
  avaliacoes: { eyebrow: string; nota: number; total: number; lista: Avaliacao[] };
  contato: {
    eyebrow: string;
    titulo: string;
    whatsapp: string;
    address: string;
    hours: string;
    instagram: string;
    abertura: { inicio: number; fim: number };
  };
};

export const site: SiteConfig = {
  brand: { name: "Brasa", tagline: "Hamburgueria artesanal" },

  nav: [
    { label: "Cardápio", href: "#cardapio" },
    { label: "Monte o seu", href: "#monte" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" },
  ],

  // ——— FASE 1: APROVADO, NÃO ALTERAR ———
  hero: {
    eyebrow: "Hamburgueria artesanal · Fortaleza",
    titleLines: ["Fogo alto,", "ponto certo."],
    subtitle:
      "Carne moída no dia, pão de fermentação natural e brasa de verdade. Todo dia, das 18h às 23h30.",
    primaryCta: { label: "Ver cardápio", href: "#cardapio" },
    secondaryCta: { label: "Pedir no WhatsApp", href: "#contato" },
    video: { src: "/video/hero.mp4", poster: "/video/hero-poster.jpg" },
  },
  // ————————————————————————————————

  cardapio: {
    eyebrow: "01 / Cardápio",
    titulo: "O que sai da brasa",
    descricao: "Carne moída no dia. Sem versão light, sem foto retocada.",
    categorias: ["Hambúrgueres", "Entradas", "Bebidas", "Combos"],
    itens: [
      {
        id: "brasa",
        nome: "Brasa",
        descricao: "Blend 180g, queijo prato, cebola na chapa, pão brioche.",
        preco: 34,
        categoria: "Hambúrgueres",
        destaque: true,
        arte: { tipo: "burger", camadas: ["carne", "queijo", "cebola"] },
      },
      {
        id: "defumado",
        nome: "Defumado",
        descricao: "Blend 180g, cheddar maturado, bacon caramelizado no melaço.",
        preco: 42,
        categoria: "Hambúrgueres",
        arte: { tipo: "burger", camadas: ["carne", "cheddar", "bacon"] },
      },
      {
        id: "cariri",
        nome: "Cariri",
        descricao: "Blend 180g, queijo coalho grelhado, rapadura e pimenta-de-cheiro.",
        preco: 39,
        categoria: "Hambúrgueres",
        arte: { tipo: "burger", camadas: ["carne", "coalho", "molho"] },
      },
      {
        id: "duplo",
        nome: "Duplo Fogo",
        descricao: "Dois blends de 90g, queijo prato duplo, picles da casa.",
        preco: 46,
        categoria: "Hambúrgueres",
        arte: { tipo: "burger", camadas: ["carne", "queijo", "carne", "queijo", "picles"] },
      },
      {
        id: "costela",
        nome: "Costela",
        descricao: "Costela desfiada 160g, cheddar, cebola caramelizada.",
        preco: 44,
        categoria: "Hambúrgueres",
        arte: { tipo: "burger", camadas: ["costela", "cheddar", "cebola"] },
      },

      {
        id: "batata",
        nome: "Batata na brasa",
        descricao: "Rústica, assada no carvão, alecrim e sal grosso.",
        preco: 22,
        categoria: "Entradas",
        arte: { tipo: "fritas" },
      },
      {
        id: "coalho",
        nome: "Coalho na vara",
        descricao: "Três espetos, melaço de rapadura por cima.",
        preco: 19,
        categoria: "Entradas",
        arte: { tipo: "espeto" },
      },
      {
        id: "aneis",
        nome: "Anéis de cebola",
        descricao: "Empanados na hora, molho da brasa à parte.",
        preco: 24,
        categoria: "Entradas",
        arte: { tipo: "fritas" },
      },

      {
        id: "refri",
        nome: "Refrigerante",
        descricao: "Lata 350ml, gelado.",
        preco: 7,
        categoria: "Bebidas",
        arte: { tipo: "copo", cor: "#6B3A1E" },
      },
      {
        id: "cerveja",
        nome: "Long neck",
        descricao: "Pilsen 355ml, direto do freezer.",
        preco: 12,
        categoria: "Bebidas",
        arte: { tipo: "copo", cor: "#C99A2E" },
      },
      {
        id: "suco",
        nome: "Suco de caju",
        descricao: "Polpa da serra, sem açúcar, 400ml.",
        preco: 11,
        categoria: "Bebidas",
        arte: { tipo: "copo", cor: "#E0752A" },
      },
      {
        id: "shake",
        nome: "Milkshake de rapadura",
        descricao: "500ml, feito com sorvete de tapioca.",
        preco: 18,
        categoria: "Bebidas",
        arte: { tipo: "copo", cor: "#D9C3A0" },
      },

      {
        id: "combo-brasa",
        nome: "Combo Brasa",
        descricao: "Brasa + batata na brasa + refrigerante.",
        preco: 56,
        categoria: "Combos",
        destaque: true,
        arte: { tipo: "combo", camadas: ["carne", "queijo", "cebola"] },
      },
      {
        id: "combo-duplo",
        nome: "Combo Duplo",
        descricao: "Duplo Fogo + anéis de cebola + long neck.",
        preco: 74,
        categoria: "Combos",
        arte: { tipo: "combo", camadas: ["carne", "queijo", "carne", "queijo"] },
      },
      {
        id: "combo-dois",
        nome: "Combo a Dois",
        descricao: "Dois hambúrgueres à escolha + batata grande + dois sucos.",
        preco: 98,
        categoria: "Combos",
        arte: { tipo: "combo", camadas: ["costela", "cheddar", "bacon"] },
      },
    ],
  },

  builder: {
    eyebrow: "02 / Monte o seu",
    titulo: "A bancada é sua",
    descricao: "Escolha o pão, a carne e o queijo. O resto é gosto seu.",
    precoBase: 18,
    grupos: [
      {
        id: "pao",
        titulo: "Pão",
        modo: "unico",
        obrigatorio: true,
        opcoes: [
          { id: "brioche", nome: "Brioche", preco: 0, altura: 0, peca: "brioche" },
          { id: "australiano", nome: "Australiano", preco: 3, altura: 0, peca: "australiano" },
        ],
      },
      {
        id: "carne",
        titulo: "Carne",
        modo: "multiplo",
        obrigatorio: true,
        max: 2,
        opcoes: [
          { id: "carne", nome: "Blend 180g", preco: 12, altura: 30, peca: "carne" },
          { id: "costela", nome: "Costela 160g", preco: 14, altura: 28, peca: "costela" },
          { id: "frango", nome: "Frango grelhado", preco: 11, altura: 26, peca: "frango" },
        ],
      },
      {
        id: "queijo",
        titulo: "Queijo",
        modo: "multiplo",
        obrigatorio: true,
        max: 2,
        opcoes: [
          { id: "queijo", nome: "Prato", preco: 6, altura: 12, peca: "queijo" },
          { id: "cheddar", nome: "Cheddar maturado", preco: 7, altura: 12, peca: "cheddar" },
          { id: "coalho", nome: "Coalho grelhado", preco: 8, altura: 14, peca: "coalho" },
        ],
      },
      {
        id: "extra",
        titulo: "Extras",
        modo: "multiplo",
        obrigatorio: false,
        max: 4,
        opcoes: [
          { id: "bacon", nome: "Bacon caramelizado", preco: 8, altura: 14, peca: "bacon" },
          { id: "cebola", nome: "Cebola na chapa", preco: 5, altura: 13, peca: "cebola" },
          { id: "picles", nome: "Picles da casa", preco: 4, altura: 11, peca: "picles" },
          { id: "molho", nome: "Molho da brasa", preco: 3, altura: 9, peca: "molho" },
        ],
      },
    ],
  },

  sobre: {
    eyebrow: "03 / Sobre",
    titulo: "Fogo, tempo e nada mais",
    texto:
      "A carne chega inteira e é moída aqui, todo dia às quatro da tarde. O pão leva dezoito horas de fermentação. A brasa é de carvão de eucalipto — acende às cinco e só apaga com o último pedido.",
    fatos: [
      { valor: "180g", rotulo: "de blend" },
      { valor: "18h", rotulo: "de fermentação" },
      { valor: "1x", rotulo: "moagem por dia" },
    ],
  },

  avaliacoes: {
    eyebrow: "04 / Avaliações",
    nota: 4.9,
    total: 312,
    lista: [
      {
        id: "a1",
        texto:
          "Pedi o Cariri sem esperar muito do queijo coalho no pão. Errei feio. É o melhor hambúrguer que comi em Fortaleza.",
        autor: "Rafael M.",
        origem: "Google",
      },
      {
        id: "a2",
        texto:
          "A carne chega no ponto que você pediu, o que já é raro. E o pão aguenta até o fim sem desmanchar.",
        autor: "Juliana P.",
        origem: "iFood",
      },
      {
        id: "a3",
        texto:
          "Fui numa terça achando que estaria vazio. Fila na porta. Agora entendo o motivo.",
        autor: "Diego A.",
        origem: "Google",
      },
    ],
  },

  contato: {
    eyebrow: "05 / Contato",
    titulo: "Vem pra brasa",
    whatsapp: "+55 85 90000-0000",
    address: "Rua Exemplo, 123 — Fortaleza, CE",
    hours: "Ter a Dom · 18h às 23h30",
    instagram: "@brasa",
    abertura: { inicio: 18, fim: 23.5 },
  },
};
