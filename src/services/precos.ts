import { Historicos, Moeda, Serie } from '../types';
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

// o fechamento da binance de um dia é o preço da meia-noite do dia seguinte,
// que é o horário dos pontos da coingecko
export function paraMeiaNoite(serie: Serie): Serie {
  return serie.map((ponto) => {
    const data = new Date(`${ponto.dia}T00:00:00Z`);
    data.setUTCDate(data.getUTCDate() + 1);
    return { dia: data.toISOString().slice(0, 10), preco: ponto.preco };
  });
}

export async function carregarHistoricos(moeda: Moeda): Promise<Historicos> {
  const pares = await binance.paresDisponiveis();
  const btcEth = Promise.all([
    binance.historico('BTC', DIAS_BINANCE),
    binance.historico('ETH', DIAS_BINANCE),
  ]);

  if (temNaBinance(moeda, pares)) {
    const [serieMoeda, [btc, eth]] = await Promise.all([binance.historico(moeda.simbolo, DIAS_BINANCE), btcEth]);
    return { fonte: 'binance', moeda: serieMoeda, btc, eth };
  }

  // só a moeda vem da coingecko (1 requisição); btc e eth continuam da binance
  const [serieMoeda, [btc, eth]] = await Promise.all([coingecko.historico(moeda.id), btcEth]);
  return { fonte: 'coingecko', moeda: serieMoeda, btc: paraMeiaNoite(btc), eth: paraMeiaNoite(eth) };
}
