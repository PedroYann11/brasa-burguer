# Brasa — landing page (etapa 1: hero + arquitetura)

Next.js 15 (App Router) · TypeScript · Tailwind · GSAP · Framer Motion

## Rodar

```bash
npm install
npm run dev
```

O vídeo enviado já está em `public/video/hero.mp4`, com um frame extraído como
poster em `public/video/hero-poster.jpg`.

## O que existe nesta etapa

Apenas a hero e o esqueleto. As demais seções são placeholders comentados,
prontos para receber conteúdo sem mexer em layout.

```
src/
├─ app/
│  ├─ layout.tsx        fontes (display / sans / mono) e metadados
│  ├─ page.tsx          composição e ordem das seções
│  └─ globals.css       variáveis de cor + base tipográfica
├─ config/
│  └─ site.ts           TODO o conteúdo editável — futuro plug do painel
├─ components/
│  ├─ hero/             Hero, HeroVideo, HeroContent, ScrollCue
│  ├─ layout/           Navbar, Footer
│  ├─ sections/         Sobre, Cardapio, Destaques, Depoimentos, Contato
│  └─ ui/               Container, Section, Placeholder, Reveal
├─ hooks/
└─ lib/                 gsap (registro do ScrollTrigger), cn
```

## Divisão das animações

Regra fixa do projeto, para não haver duas bibliotecas disputando o mesmo elemento:

| Biblioteca | Responsabilidade |
| --- | --- |
| **GSAP + ScrollTrigger** | Abertura do vídeo e parallax preso ao scroll (`Hero.tsx`) |
| **Framer Motion** | Entrada de elementos, reveal de seções e micro-interações |

## Hero

1. **Abertura** — o vídeo nasce como uma fresta central e se abre até ocupar a tela (`clipPath` + `scale`, ease `expo.out`, 1,7s).
2. **Parallax** — a hero é `sticky top-0 z-0`; o `<main>` é `z-10` com topo arredondado e passa por cima dela. Durante a travessia, o vídeo desce 12%, o texto sobe 26% e um véu escurece a cena. Um único timeline com `scrub` mantém as três camadas em fase.

`prefers-reduced-motion` desliga tudo: o vídeo vira imagem estática e as entradas somem.

## Identidade visual

Tokens em `globals.css` como canais RGB, mapeados no `tailwind.config.ts`:

| Token | Uso |
| --- | --- |
| `ink` `#140A0C` | fundo |
| `coal` `#1E1113` | superfícies elevadas |
| `ember` `#FF5A1F` | acento — brasa |
| `mustard` `#E8B33C` | acento secundário |
| `bone` `#F3EBE3` | texto |
| `ash` `#8A7A76` | texto de apoio |

Trocar esses seis valores troca a marca inteira — é assim que o painel
administrativo vai permitir a edição de cores.

Tipografia: **Bricolage Grotesque** (títulos), **Instrument Sans** (corpo),
**JetBrains Mono** (etiquetas de comanda — o dispositivo estrutural que numera
as seções, `01 / Sobre`).

## Próximos passos

1. Trocar `site.ts` estático por `getSiteConfig()` lendo de API/CMS — o tipo `SiteConfig` já garante que nada quebra.
2. Construir o Cardápio (maior conversão) e depois Destaques.
3. Menu mobile em tela cheia (`Navbar.tsx`, marcado com TODO).
4. Painel administrativo em rota separada `/admin`, escrevendo no mesmo shape de `SiteConfig`.
