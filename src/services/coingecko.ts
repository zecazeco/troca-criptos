import { Moeda, Serie } from '../types';
import { buscarJson, comCache, paraDia } from './cache';

const API = 'https://api.coingecko.com/api/v3';

// o plano grátis da coingecko só libera o último ano
export const DIAS_COINGECKO = 365;

type ResultadoBusca = {
  coins: { id: string; name: string; symbol: string; thumb: string; market_cap_rank: number | null }[];
};

type Grafico = { prices: [number, number][] };

export async function buscar(texto: string): Promise<Moeda[]> {
  const termo = texto.trim().toLowerCase();
  if (!termo) return [];

  return comCache(`coingecko:busca:${termo}`, async () => {
    const { coins } = await buscarJson<ResultadoBusca>(`${API}/search?query=${encodeURIComponent(termo)}`);
    return coins.slice(0, 12).map((coin) => ({
      id: coin.id,
      simbolo: coin.symbol.toUpperCase(),
      nome: coin.name,
      logo: coin.thumb,
      rank: coin.market_cap_rank,
    }));
  });
}

export async function historico(id: string): Promise<Serie> {
  return comCache(`coingecko:${id}`, async () => {
    const url = `${API}/coins/${id}/market_chart?vs_currency=usd&days=${DIAS_COINGECKO}&interval=daily`;
    const { prices } = await buscarJson<Grafico>(url);

    // a coingecko manda o último ponto com a hora atual, então fica um valor por dia
    const porDia = new Map<string, number>();
    prices.forEach(([timestamp, preco]) => porDia.set(paraDia(timestamp), preco));
    return [...porDia].map(([dia, preco]) => ({ dia, preco }));
  });
}
