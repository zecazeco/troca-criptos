// preço de fechamento em dólar de um dia (dia no formato AAAA-MM-DD)
export interface Ponto {
  dia: string;
  preco: number;
}

export type Serie = Ponto[];

// moeda escolhida pela pessoa (dados vindos da busca da coingecko)
export interface Moeda {
  id: string;
  simbolo: string;
  nome: string;
  logo: string;
  rank: number | null;
}

export type Fonte = 'binance' | 'coingecko';

export interface Historicos {
  fonte: Fonte;
  moeda: Serie;
  btc: Serie;
  eth: Serie;
}
