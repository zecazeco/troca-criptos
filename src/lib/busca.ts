import { Moeda } from '../types';

const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

// quanto menor, mais relevante: símbolo exato, depois começo do nome/símbolo, depois qualquer parte
function relevancia(moeda: Moeda, termo: string) {
  const simbolo = normalizar(moeda.simbolo);
  const nome = normalizar(moeda.nome);

  if (simbolo === termo) return 0;
  if (nome === termo || moeda.id === termo) return 1;
  if (simbolo.startsWith(termo) || nome.startsWith(termo)) return 2;
  if (nome.split(/\s+/).some((palavra) => palavra.startsWith(termo))) return 3;
  if (nome.includes(termo) || moeda.id.includes(termo)) return 4;
  return -1;
}

// filtra a lista de moedas populares sem chamar a api, ordenando por relevância e rank
export function filtrarMoedas(lista: Moeda[], texto: string, limite = 12): Moeda[] {
  const termo = normalizar(texto.trim());
  if (!termo) return [];

  return lista
    .map((moeda) => ({ moeda, nota: relevancia(moeda, termo) }))
    .filter((item) => item.nota >= 0)
    .sort((a, b) => a.nota - b.nota || (a.moeda.rank ?? Infinity) - (b.moeda.rank ?? Infinity))
    .slice(0, limite)
    .map((item) => item.moeda);
}
