import { describe, expect, test } from 'vitest';
import { alinhar, metricas, recortar, DiaRelacao } from './relacoes';

function serieDias(inicio: string, quantidade: number, valor: (indice: number) => number): DiaRelacao[] {
  const data = new Date(`${inicio}T00:00:00Z`);
  return Array.from({ length: quantidade }, (_, indice) => {
    const dia = new Date(data.getTime() + indice * 86400000).toISOString().slice(0, 10);
    const relacao = valor(indice);
    return { dia, moeda: relacao, btc: 1, eth: 1, relBtc: relacao, relEth: relacao };
  });
}

describe('alinhar', () => {
  test('junta as séries pelo dia e calcula a relação com btc e eth', () => {
    const resultado = alinhar({
      moeda: [{ dia: '2024-01-01', preco: 2 }, { dia: '2024-01-02', preco: 4 }],
      btc: [{ dia: '2024-01-01', preco: 40000 }, { dia: '2024-01-02', preco: 50000 }],
      eth: [{ dia: '2024-01-01', preco: 2000 }, { dia: '2024-01-02', preco: 2500 }],
    });

    expect(resultado).toHaveLength(2);
    expect(resultado[0].relBtc).toBeCloseTo(2 / 40000);
    expect(resultado[1].relEth).toBeCloseTo(4 / 2500);
  });

  test('descarta dias que faltam no btc ou no eth', () => {
    const resultado = alinhar({
      moeda: [{ dia: '2024-01-01', preco: 2 }, { dia: '2024-01-02', preco: 3 }],
      btc: [{ dia: '2024-01-01', preco: 40000 }],
      eth: [{ dia: '2024-01-01', preco: 2000 }, { dia: '2024-01-02', preco: 2500 }],
    });

    expect(resultado.map((item) => item.dia)).toEqual(['2024-01-01']);
  });
});

describe('recortar', () => {
  test('pega só os dias do período contando do último dia', () => {
    const serie = serieDias('2023-01-01', 400, (indice) => indice);
    const { dias, completo } = recortar(serie, '3m');

    expect(dias[dias.length - 1].dia).toBe(serie[serie.length - 1].dia);
    expect(dias).toHaveLength(91);
    expect(completo).toBe(true);
  });

  test('avisa quando a moeda tem menos histórico que o período', () => {
    const serie = serieDias('2024-01-01', 100, (indice) => indice);
    const { dias, completo } = recortar(serie, '1a');

    expect(dias).toHaveLength(100);
    expect(completo).toBe(false);
  });
});

describe('metricas', () => {
  test('calcula atual, mínimo, máximo, média e percentil', () => {
    const valores = [5, 1, 10, 3, 4];
    const serie = serieDias('2024-01-01', valores.length, (indice) => valores[indice]);
    const resultado = metricas(serie, 'relBtc');

    expect(resultado).toMatchObject({ atual: 4, min: 1, max: 10, media: 4.6, percentil: 60 });
    expect(resultado?.diaMax).toBe('2024-01-03');
    expect(resultado?.diaMin).toBe('2024-01-02');
  });

  test('percentil 100 quando a relação atual é a maior do período', () => {
    const serie = serieDias('2024-01-01', 10, (indice) => indice);
    expect(metricas(serie, 'relEth')?.percentil).toBe(100);
  });

  test('retorna null pra série vazia', () => {
    expect(metricas([], 'relBtc')).toBeNull();
  });
});
