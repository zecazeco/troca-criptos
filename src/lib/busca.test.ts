import { describe, expect, test } from 'vitest';
import { Moeda } from '../types';
import { filtrarMoedas } from './busca';

const moeda = (id: string, simbolo: string, nome: string, rank: number | null): Moeda => ({ id, simbolo, nome, logo: '', rank });

const lista = [
  moeda('cardano', 'ADA', 'Cardano', 10),
  moeda('near', 'NEAR', 'NEAR Protocol', 30),
  moeda('polkadot', 'DOT', 'Polkadot', 20),
  moeda('ada-pepe', 'ADAPEPE', 'Ada Pepe', 900),
  moeda('solana', 'SOL', 'Solana', 5),
];

describe('filtrarMoedas', () => {
  test('símbolo exato vem primeiro', () => {
    expect(filtrarMoedas(lista, 'ada').map((item) => item.id)).toEqual(['cardano', 'ada-pepe']);
  });

  test('acha pelo começo de qualquer palavra do nome', () => {
    expect(filtrarMoedas(lista, 'proto').map((item) => item.id)).toEqual(['near']);
  });

  test('ignora maiúsculas e acentos', () => {
    expect(filtrarMoedas(lista, 'SÓLANA').map((item) => item.id)).toEqual(['solana']);
  });

  test('desempata pelo rank de mercado', () => {
    const resultado = filtrarMoedas([moeda('b', 'XB', 'Teste B', 50), moeda('a', 'XA', 'Teste A', 3)], 'teste');
    expect(resultado.map((item) => item.id)).toEqual(['a', 'b']);
  });

  test('texto vazio não retorna nada', () => {
    expect(filtrarMoedas(lista, '  ')).toEqual([]);
  });
});
