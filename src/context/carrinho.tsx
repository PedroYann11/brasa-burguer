"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";

/**
 * CARRINHO — estado local, sem backend.
 *
 * Guarda os itens escolhidos, soma o total e simula o envio do pedido.
 * Fica em contexto porque três lugares diferentes precisam dele: o cardápio
 * (adicionar), a bancada (adicionar o hambúrguer montado) e a navbar
 * (contador + abrir a gaveta).
 *
 * Quando existir backend, só `finalizar()` muda: o resto da árvore continua
 * igual, pois todos consomem a mesma interface.
 */

export type ItemCarrinho = {
  /** Chave única da linha (item do cardápio ou montagem da bancada). */
  uid: string;
  nome: string;
  detalhe?: string;
  preco: number;
  qtd: number;
};

type Estado = { itens: ItemCarrinho[]; aberto: boolean; status: "ocioso" | "enviando" | "pronto" };

type Acao =
  | { tipo: "adicionar"; item: Omit<ItemCarrinho, "qtd"> }
  | { tipo: "remover"; uid: string }
  | { tipo: "mudarQtd"; uid: string; delta: number }
  | { tipo: "abrir"; aberto: boolean }
  | { tipo: "status"; status: Estado["status"] }
  | { tipo: "limpar" };

function reducer(e: Estado, a: Acao): Estado {
  switch (a.tipo) {
    case "adicionar": {
      const existe = e.itens.find((i) => i.uid === a.item.uid);
      const itens = existe
        ? e.itens.map((i) => (i.uid === a.item.uid ? { ...i, qtd: i.qtd + 1 } : i))
        : [...e.itens, { ...a.item, qtd: 1 }];
      return { ...e, itens, aberto: true, status: "ocioso" };
    }
    case "remover":
      return { ...e, itens: e.itens.filter((i) => i.uid !== a.uid) };
    case "mudarQtd":
      return {
        ...e,
        itens: e.itens
          .map((i) => (i.uid === a.uid ? { ...i, qtd: i.qtd + a.delta } : i))
          .filter((i) => i.qtd > 0),
      };
    case "abrir":
      return { ...e, aberto: a.aberto };
    case "status":
      return { ...e, status: a.status };
    case "limpar":
      return { ...e, itens: [], status: "ocioso" };
  }
}

type Ctx = {
  itens: ItemCarrinho[];
  aberto: boolean;
  status: Estado["status"];
  total: number;
  quantidade: number;
  adicionar: (item: Omit<ItemCarrinho, "qtd">) => void;
  remover: (uid: string) => void;
  mudarQtd: (uid: string, delta: number) => void;
  abrir: (v: boolean) => void;
  finalizar: () => void;
};

const CarrinhoContext = createContext<Ctx | null>(null);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(reducer, {
    itens: [],
    aberto: false,
    status: "ocioso",
  });

  const valor = useMemo<Ctx>(() => {
    const total = estado.itens.reduce((s, i) => s + i.preco * i.qtd, 0);
    const quantidade = estado.itens.reduce((s, i) => s + i.qtd, 0);

    return {
      itens: estado.itens,
      aberto: estado.aberto,
      status: estado.status,
      total,
      quantidade,
      adicionar: (item) => dispatch({ tipo: "adicionar", item }),
      remover: (uid) => dispatch({ tipo: "remover", uid }),
      mudarQtd: (uid, delta) => dispatch({ tipo: "mudarQtd", uid, delta }),
      abrir: (v) => dispatch({ tipo: "abrir", aberto: v }),
      /** Demonstração: nenhum pedido sai daqui de fato. */
      finalizar: () => {
        dispatch({ tipo: "status", status: "enviando" });
        setTimeout(() => dispatch({ tipo: "status", status: "pronto" }), 1600);
      },
    };
  }, [estado]);

  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>;
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) throw new Error("useCarrinho precisa estar dentro de <CarrinhoProvider>");
  return ctx;
}
