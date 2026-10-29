import { describe, expect, test } from 'vitest';
import { paraMeiaNoite, temNaBinance } from './precos';

describe('paraMeiaNoite', () => {
  test('o fechamento de um dia vira o preço da meia-noite do dia seguinte', () => {
    expect(paraMeiaNoite([{ dia: '2024-12-31', preco: 10 }, { dia: '2025-02-28', preco: 20 }])).toEqual([
      { dia: '2025-01-01', preco: 10 },
      { dia: '2025-03-01', preco: 20 },
    ]);
  });
});

describe('temNaBinance', () => {
  const moeda = { id: 'cardano', simbolo: 'ADA', nome: 'Cardano', logo: '', rank: 10 };

  test('usa a binance quando tem par e rank conhecido', () => {
    expect(temNaBinance(moeda, ['ADA', 'SOL'])).toBe(true);
  });

  test('não usa a binance pra moeda sem rank, mesmo com símbolo igual', () => {
    expect(temNaBinance({ ...moeda, id: 'ada-falsa', rank: null }, ['ADA'])).toBe(false);
  });
});
