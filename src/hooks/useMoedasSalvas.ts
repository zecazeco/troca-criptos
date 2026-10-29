import { Moeda } from '../types';
import useArmazenado from './useArmazenado';

function useMoedasSalvas() {
  const [moedas, setMoedas] = useArmazenado<Moeda[]>('moedas', []);

  const adicionar = (moeda: Moeda) => {
    setMoedas((atuais) => (atuais.some((item) => item.id === moeda.id) ? atuais : [...atuais, moeda]));
  };

  const remover = (id: string) => {
    setMoedas((atuais) => atuais.filter((item) => item.id !== id));
  };

  // salva a ordem escolhida arrastando os cards
  const reordenar = (ids: string[]) => {
    setMoedas((atuais) => ids.flatMap((id) => atuais.filter((item) => item.id === id)));
  };

  return { moedas, adicionar, remover, reordenar };
}

export default useMoedasSalvas;
