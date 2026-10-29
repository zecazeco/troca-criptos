import { useEffect, useState } from 'react';

// estado que fica salvo no localStorage do navegador (nada vai pra servidor nem pra url)
function useArmazenado<T>(chave: string, inicial: T) {
  const chaveCompleta = `troca-criptos:${chave}`;

  const [valor, setValor] = useState<T>(() => {
    try {
      const bruto = localStorage.getItem(chaveCompleta);
      return bruto ? (JSON.parse(bruto) as T) : inicial;
    } catch {
      return inicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(chaveCompleta, JSON.stringify(valor));
    } catch {
      // modo anônimo ou storage bloqueado: funciona só enquanto a página estiver aberta
    }
  }, [chaveCompleta, valor]);

  return [valor, setValor] as const;
}

export default useArmazenado;
