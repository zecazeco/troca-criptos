const SEIS_HORAS = 6 * 60 * 60 * 1000;

interface Guardado<T> {
  salvoEm: number;
  valor: T;
}

// guarda o resultado no sessionStorage pra não repetir chamadas nas APIs
export async function comCache<T>(chave: string, buscar: () => Promise<T>, validade = SEIS_HORAS): Promise<T> {
  const chaveCompleta = `troca-criptos:cache:${chave}`;

  try {
    const bruto = sessionStorage.getItem(chaveCompleta);
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
    sessionStorage.setItem(chaveCompleta, JSON.stringify(guardado));
  } catch {
    // storage cheio ou bloqueado: segue sem cache
  }

  return valor;
}

export async function buscarJson<T>(url: string): Promise<T> {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Erro ${resposta.status} ao buscar ${url}`);
  return resposta.json() as Promise<T>;
}

export function paraDia(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}
