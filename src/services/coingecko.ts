import { Moeda, Serie } from '../types';
import { buscarJson, comCache, paraDia } from './cache';

const API = 'https://api.coingecko.com/api/v3';
const UM_DIA = 24 * 60 * 60 * 1000;

// o plano grátis da coingecko só libera o último ano e 5 requisições por minuto
export const DIAS_COINGECKO = 365;

type ResultadoBusca = {
  coins: { id: string; name: string; symbol: string; thumb: string; market_cap_rank: number | null }[];
};

type MoedaMercado = { id: string; name: string; symbol: string; image: string; market_cap_rank: number | null };

type Grafico = { prices: [number, number][] };

// as 500 maiores moedas, baixadas uma vez por dia, pra busca funcionar sem chamar a api a cada letra
export async function populares(): Promise<Moeda[]> {
  return comCache('coingecko:populares', async () => {
    const lista: Moeda[] = [];

    for (const pagina of [1, 2]) {
      const url = `${API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${pagina}`;
      const moedas = await buscarJson<MoedaMercado[]>(url, 2);
      moedas.forEach((item) => lista.push({
        id: item.id,
        simbolo: item.symbol.toUpperCase(),
        nome: item.name,
        logo: item.image.replace('/large/', '/thumb/'),
        rank: item.market_cap_rank,
      }));
    }

    return lista;
  }, { validade: UM_DIA, local: true });
}

// busca em todas as moedas da coingecko (só quando a pessoa pede, por causa do limite)
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
    const { prices } = await buscarJson<Grafico>(url, 3);

    // fica só com os pontos da meia-noite (utc); o último ponto que a api manda é o preço de agora
    return prices
      .filter(([timestamp]) => timestamp % UM_DIA === 0)
      .map(([timestamp, preco]) => ({ dia: paraDia(timestamp), preco }));
  });
}
