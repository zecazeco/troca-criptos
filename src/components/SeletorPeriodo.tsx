import { Periodo, PERIODOS } from '../lib/relacoes';

const NOMES: Record<Periodo, string> = {
  '3m': '3 meses',
  '6m': '6 meses',
  '1a': '1 ano',
  '2a': '2 anos',
  '5a': '5 anos',
};

interface SeletorPeriodoProps {
  periodo: Periodo;
  onMudar: (periodo: Periodo) => void;
}

function SeletorPeriodo({ periodo, onMudar }: SeletorPeriodoProps) {
  return (
    <div className="segmentos" role="group" aria-label="Período">
      {(Object.keys(PERIODOS) as Periodo[]).map((opcao) => (
        <button
          key={opcao}
          type="button"
          className={`segmento ${opcao === periodo ? 'segmento--ativo' : ''}`}
          aria-pressed={opcao === periodo}
          title={NOMES[opcao]}
          onClick={() => onMudar(opcao)}
        >
          {opcao}
        </button>
      ))}
    </div>
  );
}

export default SeletorPeriodo;
