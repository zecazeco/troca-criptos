import { Serie } from '../types';
import { buscarJson, comCache, paraDia } from './cache';

const API = 'https://api.binance.com/api/v3';
const UM_DIA = 24 * 60 * 60 * 1000;
const LIMITE = 1000;

type Ticker = { symbol: string; price: string };
// [abertura, open, high, low, close, ...]
type Kline = [number, string, string, string, string, ...unknown[]];

// moedas que têm par com USDT na binance
export async function paresDisponiveis(): Promise<string[]> {
  return comCache('binance:pares', async () => {
    const tickers = await buscarJson<Ticker[]>(`${API}/ticker/price`);
    return tickers
      .filter((ticker) => ticker.symbol.endsWith('USDT'))
      .map((ticker) => ticker.symbol.slice(0, -4));
  });
}

// histórico diário em dólar, paginando de 1000 em 1000 dias
export async function historico(simbolo: string, dias: number): Promise<Serie> {
  return comCache(`binance:${simbolo}:${dias}`, async () => {
    const serie: Serie = [];
    let inicio = Date.now() - dias * UM_DIA;

    for (;;) {
      const url = `${API}/klines?symbol=${simbolo}USDT&interval=1d&limit=${LIMITE}&startTime=${inicio}`;
      const klines = await buscarJson<Kline[]>(url);
      klines.forEach((kline) => serie.push({ dia: paraDia(kline[0]), preco: Number(kline[4]) }));
      if (klines.length < LIMITE) break;
      inicio = klines[klines.length - 1][0] + UM_DIA;
    }

    return serie;
  });
}
