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

  return { moedas, adicionar, remover };
}

export default useMoedasSalvas;
