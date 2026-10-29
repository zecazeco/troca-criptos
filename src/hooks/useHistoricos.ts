import { useEffect, useState } from 'react';
import { Fonte, Moeda } from '../types';
import { carregarHistoricos } from '../services/precos';
import { alinhar, DiaRelacao } from '../lib/relacoes';

export type EstadoHistorico =
  | { status: 'carregando' }
  | { status: 'erro' }
  | { status: 'ok'; fonte: Fonte; serie: DiaRelacao[] };

// carrega o histórico de cada moeda escolhida (só as que ainda não foram carregadas)
function useHistoricos(moedas: Moeda[]) {
  const [estados, setEstados] = useState<Record<string, EstadoHistorico>>({});

  useEffect(() => {
    moedas.forEach((moeda) => {
      if (estados[moeda.id]) return;

      setEstados((atuais) => ({ ...atuais, [moeda.id]: { status: 'carregando' } }));

      carregarHistoricos(moeda)
        .then((historicos) => {
          const estado: EstadoHistorico = { status: 'ok', fonte: historicos.fonte, serie: alinhar(historicos) };
          setEstados((atuais) => ({ ...atuais, [moeda.id]: estado }));
        })
        .catch(() => {
          setEstados((atuais) => ({ ...atuais, [moeda.id]: { status: 'erro' } }));
        });
    });
  }, [moedas, estados]);

  const tentarDeNovo = (id: string) => {
    setEstados((atuais) => {
      const { [id]: _, ...resto } = atuais;
      return resto;
    });
  };

  return { estados, tentarDeNovo };
}

export default useHistoricos;
