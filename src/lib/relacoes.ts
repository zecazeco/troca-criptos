import { Historicos } from '../types';

export const PERIODOS = {
  '3m': 90,
  '6m': 182,
  '1a': 365,
  '2a': 730,
  '5a': 1825,
} as const;

export type Periodo = keyof typeof PERIODOS;

// um dia com o preço das 3 moedas e quanto a moeda vale em btc e em eth
export interface DiaRelacao {
  dia: string;
  moeda: number;
  btc: number;
  eth: number;
  relBtc: number;
  relEth: number;
}

export interface Metricas {
  atual: number;
  min: number;
  max: number;
  media: number;
  // % de dias do período em que a relação estava igual ou abaixo da atual
  percentil: number;
  diaMax: string;
  diaMin: string;
}

// junta as séries pelo dia e descarta dias que faltam em alguma delas
export function alinhar({ moeda, btc, eth }: Pick<Historicos, 'moeda' | 'btc' | 'eth'>): DiaRelacao[] {
  const precoBtc = new Map(btc.map((ponto) => [ponto.dia, ponto.preco]));
  const precoEth = new Map(eth.map((ponto) => [ponto.dia, ponto.preco]));

  return moeda.flatMap((ponto) => {
    const valorBtc = precoBtc.get(ponto.dia);
    const valorEth = precoEth.get(ponto.dia);
    if (!valorBtc || !valorEth || !ponto.preco) return [];

    return [{
      dia: ponto.dia,
      moeda: ponto.preco,
      btc: valorBtc,
      eth: valorEth,
      relBtc: ponto.preco / valorBtc,
      relEth: ponto.preco / valorEth,
    }];
  });
}

function somarDias(dia: string, dias: number) {
  const data = new Date(`${dia}T00:00:00Z`);
  data.setUTCDate(data.getUTCDate() + dias);
  return data.toISOString().slice(0, 10);
}

// usa o último dia da série como referência pra contar o período
export function recortar(serie: DiaRelacao[], periodo: Periodo) {
  if (serie.length === 0) return { dias: serie, completo: false };

  const ultimo = serie[serie.length - 1].dia;
  const inicio = somarDias(ultimo, -PERIODOS[periodo]);
  const dias = serie.filter((item) => item.dia >= inicio);

  // tolera alguns dias faltando no começo
  const completo = serie[0].dia <= somarDias(inicio, 7);

  return { dias, completo };
}

export function metricas(serie: DiaRelacao[], campo: 'relBtc' | 'relEth'): Metricas | null {
  if (serie.length === 0) return null;

  const valores = serie.map((item) => item[campo]);
  const atual = valores[valores.length - 1];
  let indiceMax = 0;
  let indiceMin = 0;

  valores.forEach((valor, indice) => {
    if (valor > valores[indiceMax]) indiceMax = indice;
    if (valor < valores[indiceMin]) indiceMin = indice;
  });

  const abaixoOuIgual = valores.filter((valor) => valor <= atual).length;

  return {
    atual,
    min: valores[indiceMin],
    max: valores[indiceMax],
    media: valores.reduce((soma, valor) => soma + valor, 0) / valores.length,
    percentil: (abaixoOuIgual / valores.length) * 100,
    diaMax: serie[indiceMax].dia,
    diaMin: serie[indiceMin].dia,
  };
}

export interface DiaBase100 {
  dia: string;
  moeda: number;
  btc: number;
  eth: number;
}

// põe as 3 moedas em base 100 no primeiro dia do período pra comparar a valorização
export function normalizar(serie: DiaRelacao[]): DiaBase100[] {
  if (serie.length === 0) return [];
  const [primeiro] = serie;

  return serie.map((item) => ({
    dia: item.dia,
    moeda: (item.moeda / primeiro.moeda) * 100,
    btc: (item.btc / primeiro.btc) * 100,
    eth: (item.eth / primeiro.eth) * 100,
  }));
}

export interface Resumo {
  dias: DiaRelacao[];
  completo: boolean;
  btc: Metricas;
  eth: Metricas;
}

export function resumir(serie: DiaRelacao[], periodo: Periodo): Resumo | null {
  const { dias, completo } = recortar(serie, periodo);
  const btc = metricas(dias, 'relBtc');
  const eth = metricas(dias, 'relEth');
  return btc && eth ? { dias, completo, btc, eth } : null;
}

// moedas com o percentil mais alto (mais perto do melhor momento de troca) vêm primeiro
export function pontuacao(resumo: Resumo | null) {
  return resumo ? Math.max(resumo.btc.percentil, resumo.eth.percentil) : -1;
}
