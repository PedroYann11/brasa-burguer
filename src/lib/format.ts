/** Formata valores em real brasileiro. Único lugar que define isso. */
export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
