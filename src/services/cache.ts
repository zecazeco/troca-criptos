const SEIS_HORAS = 6 * 60 * 60 * 1000;

interface OpcoesCache {
  validade?: number;
  // localStorage dura entre visitas; sessionStorage some ao fechar a aba
  local?: boolean;
}

interface Guardado<T> {
  salvoEm: number;
  valor: T;
}

// buscas em andamento, pra várias moedas não pedirem o histórico do btc ao mesmo tempo
const emAndamento = new Map<string, Promise<unknown>>();

// guarda o resultado no navegador pra não repetir chamadas nas APIs
export function comCache<T>(chave: string, buscar: () => Promise<T>, opcoes: OpcoesCache = {}): Promise<T> {
  const pendente = emAndamento.get(chave) as Promise<T> | undefined;
  if (pendente) return pendente;

  const promessa = lerOuBuscar(chave, buscar, opcoes).finally(() => emAndamento.delete(chave));
  emAndamento.set(chave, promessa);
  return promessa;
}

async function lerOuBuscar<T>(chave: string, buscar: () => Promise<T>, opcoes: OpcoesCache): Promise<T> {
  const { validade = SEIS_HORAS, local = false } = opcoes;
  const chaveCompleta = `troca-criptos:cache:${chave}`;
  const storage = () => (local ? localStorage : sessionStorage);

  try {
    const bruto = storage().getItem(chaveCompleta);
    if (bruto) {
      const guardado: Guardado<T> = JSON.parse(bruto);
      if (Date.now() - guardado.salvoEm < validade) return guardado.valor;
    }
  } catch {
    // sem acesso ao storage (modo anônimo, por exemplo): só busca de novo
  }

  const valor = await buscar();

  try {
    const guardado: Guardado<T> = { salvoEm: Date.now(), valor };
    storage().setItem(chaveCompleta, JSON.stringify(guardado));
  } catch {
    // storage cheio ou bloqueado: segue sem cache
  }

  return valor;
}

export class ErroApi extends Error {
  constructor(public status: number, url: string) {
    super(`Erro ${status} ao buscar ${url}`);
  }
}

// 429 = limite de requisições da api (a coingecko grátis libera só 5 por minuto)
export const passouDoLimite = (erro: unknown) => erro instanceof ErroApi && erro.status === 429;

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

// quando passa do limite, espera e tenta de novo algumas vezes antes de desistir
export async function buscarJson<T>(url: string, tentativas = 0): Promise<T> {
  const resposta = await fetch(url);

  if (resposta.status === 429 && tentativas > 0) {
    await esperar(15000);
    return buscarJson<T>(url, tentativas - 1);
  }

  if (!resposta.ok) throw new ErroApi(resposta.status, url);
  return resposta.json() as Promise<T>;
}

export function paraDia(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}
