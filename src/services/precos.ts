import { Historicos, Moeda } from '../types';
import * as binance from './binance';
import * as coingecko from './coingecko';

// 5 anos e uns dias de folga
export const DIAS_BINANCE = 1830;

// a busca da coingecko pode trazer moedas pequenas com o mesmo símbolo de uma grande,
// então só usa a binance pra moedas com rank de mercado conhecido
const RANK_MAXIMO = 1000;

export function temNaBinance(moeda: Moeda, pares: string[]) {
  return moeda.rank !== null && moeda.rank <= RANK_MAXIMO && pares.includes(moeda.simbolo);
}

export async function carregarHistoricos(moeda: Moeda): Promise<Historicos> {
  const pares = await binance.paresDisponiveis();

  if (temNaBinance(moeda, pares)) {
    const [serieMoeda, btc, eth] = await Promise.all([
      binance.historico(moeda.simbolo, DIAS_BINANCE),
      binance.historico('BTC', DIAS_BINANCE),
      binance.historico('ETH', DIAS_BINANCE),
    ]);
    return { fonte: 'binance', moeda: serieMoeda, btc, eth };
  }

  // btc e eth também da coingecko pra os horários das séries baterem
  const [serieMoeda, btc, eth] = await Promise.all([
    coingecko.historico(moeda.id),
    coingecko.historico('bitcoin'),
    coingecko.historico('ethereum'),
  ]);
  return { fonte: 'coingecko', moeda: serieMoeda, btc, eth };
}
