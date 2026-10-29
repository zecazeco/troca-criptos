import { useEffect, useState } from 'react';
import { Moeda } from '../types';
import { buscar } from '../services/coingecko';
import { paresDisponiveis } from '../services/binance';
import { temNaBinance } from '../services/precos';
import useDebounce from '../hooks/useDebounce';

interface SeletorMoedasProps {
  moedas: Moeda[];
  onAdicionar: (moeda: Moeda) => void;
  onRemover: (id: string) => void;
}

// btc e eth são a base da comparação, então não entram na lista
const BASES = ['bitcoin', 'ethereum'];

function SeletorMoedas({ moedas, onAdicionar, onRemover }: SeletorMoedasProps) {
  const [texto, setTexto] = useState('');
  const [resultados, setResultados] = useState<Moeda[]>([]);
  const [pares, setPares] = useState<string[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState(false);
  const [focado, setFocado] = useState(false);
  const termo = useDebounce(texto, 400);

  useEffect(() => {
    paresDisponiveis().then(setPares).catch(() => setPares([]));
  }, []);

  useEffect(() => {
    if (termo.trim().length < 2) {
      setResultados([]);
      return;
    }

    let ativo = true;
    setBuscando(true);
    setErro(false);

    buscar(termo)
      .then((lista) => {
        if (ativo) setResultados(lista.filter((moeda) => !BASES.includes(moeda.id)));
      })
      .catch(() => {
        if (ativo) setErro(true);
      })
      .finally(() => {
        if (ativo) setBuscando(false);
      });

    return () => {
      ativo = false;
    };
  }, [termo]);

  const escolher = (moeda: Moeda) => {
    onAdicionar(moeda);
    setTexto('');
    setResultados([]);
  };

  const aberto = focado && texto.trim().length >= 2;

  return (
    <div className="seletor">
      <div
        className="busca"
        onFocus={() => setFocado(true)}
        onBlur={(evento) => {
          // fecha a lista só quando o foco sai da busca inteira
          if (!evento.currentTarget.contains(evento.relatedTarget)) setFocado(false);
        }}
      >
        <svg className="busca__icone" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3.5 3.5" strokeLinecap="round" />
        </svg>
        <input
          className="input busca__input"
          type="search"
          placeholder="Adicionar moeda (ex.: cardano, solana, dot)"
          aria-label="Buscar moeda"
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          onKeyDown={(evento) => {
            if (evento.key === 'Escape') setTexto('');
            if (evento.key === 'Enter' && resultados[0]) escolher(resultados[0]);
          }}
        />

        {aberto && (
          <ul className="resultados" role="listbox">
            {buscando && <li className="resultados__aviso">Buscando…</li>}
            {!buscando && erro && (
              <li className="resultados__aviso">A busca está indisponível agora. Tente de novo em um minuto.</li>
            )}
            {!buscando && !erro && resultados.length === 0 && (
              <li className="resultados__aviso">Nenhuma moeda encontrada.</li>
            )}
            {!buscando && !erro && resultados.map((moeda) => {
              const jaAdicionada = moedas.some((item) => item.id === moeda.id);
              const longa = temNaBinance(moeda, pares);
              return (
                <li key={moeda.id}>
                  <button
                    type="button"
                    className="resultado"
                    role="option"
                    aria-selected={false}
                    disabled={jaAdicionada}
                    onClick={() => escolher(moeda)}
                  >
                    <img className="logo" src={moeda.logo} alt="" width="24" height="24" />
                    <span className="resultado__nome">
                      {moeda.nome} <span className="muted">{moeda.simbolo}</span>
                    </span>
                    {jaAdicionada ? (
                      <span className="small muted">adicionada</span>
                    ) : (
                      <span className={`selo ${longa ? 'selo--longo' : ''}`}>{longa ? 'até 5 anos' : 'até 1 ano'}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {moedas.length > 0 && (
        <ul className="chips">
          {moedas.map((moeda) => (
            <li key={moeda.id} className="chip">
              <img className="logo" src={moeda.logo} alt="" width="18" height="18" />
              {moeda.simbolo}
              <button type="button" className="chip__remover" aria-label={`Remover ${moeda.nome}`} onClick={() => onRemover(moeda.id)}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SeletorMoedas;
