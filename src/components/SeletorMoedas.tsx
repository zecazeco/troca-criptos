import { useEffect, useMemo, useState } from 'react';
import { Moeda } from '../types';
import { buscar, populares } from '../services/coingecko';
import { paresDisponiveis } from '../services/binance';
import { passouDoLimite } from '../services/cache';
import { temNaBinance } from '../services/precos';
import { filtrarMoedas } from '../lib/busca';
import Logo from './Logo';

interface SeletorMoedasProps {
  moedas: Moeda[];
  onAdicionar: (moeda: Moeda) => void;
  onRemover: (id: string) => void;
}

// btc e eth são a base da comparação, então não entram na lista
const BASES = ['bitcoin', 'ethereum'];

type ErroBusca = 'limite' | 'falha' | null;

const MENSAGENS: Record<Exclude<ErroBusca, null>, string> = {
  limite: 'A CoinGecko libera poucas buscas por minuto. Espere uns segundos e tente de novo.',
  falha: 'Não foi possível buscar agora. Tente de novo em instantes.',
};

function SeletorMoedas({ moedas, onAdicionar, onRemover }: SeletorMoedasProps) {
  const [texto, setTexto] = useState('');
  const [lista, setLista] = useState<Moeda[]>([]);
  const [pares, setPares] = useState<string[]>([]);
  const [focado, setFocado] = useState(false);
  const [remotos, setRemotos] = useState<Moeda[] | null>(null);
  const [buscandoRemoto, setBuscandoRemoto] = useState(false);
  const [erro, setErro] = useState<ErroBusca>(null);

  useEffect(() => {
    paresDisponiveis().then(setPares).catch(() => setPares([]));
    populares().then(setLista).catch(() => setLista([]));
  }, []);

  // os resultados da busca completa valem só pro texto que foi buscado
  useEffect(() => {
    setRemotos(null);
    setErro(null);
  }, [texto]);

  const locais = useMemo(
    () => filtrarMoedas(lista, texto).filter((moeda) => !BASES.includes(moeda.id)),
    [lista, texto],
  );

  const extras = (remotos ?? []).filter(
    (moeda) => !BASES.includes(moeda.id) && !locais.some((local) => local.id === moeda.id),
  );

  const buscarEmTodas = async () => {
    setBuscandoRemoto(true);
    setErro(null);
    try {
      setRemotos(await buscar(texto));
    } catch (falha) {
      setErro(passouDoLimite(falha) ? 'limite' : 'falha');
    } finally {
      setBuscandoRemoto(false);
    }
  };

  const escolher = (moeda: Moeda) => {
    onAdicionar(moeda);
    setTexto('');
  };

  const item = (moeda: Moeda) => {
    const jaAdicionada = moedas.some((escolhida) => escolhida.id === moeda.id);
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
          <Logo moeda={moeda} tamanho={24} />
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
            if (evento.key !== 'Enter') return;
            if (locais[0]) escolher(locais[0]);
            else if (remotos === null && !buscandoRemoto) buscarEmTodas();
          }}
        />

        {aberto && (
          <ul className="resultados" role="listbox">
            {locais.map(item)}

            {remotos !== null && extras.length > 0 && (
              <li className="resultados__titulo">Mais resultados na CoinGecko</li>
            )}
            {extras.map(item)}

            {remotos !== null && locais.length === 0 && extras.length === 0 && (
              <li className="resultados__aviso">Nenhuma moeda encontrada.</li>
            )}
            {erro && <li className="resultados__aviso resultados__aviso--erro">{MENSAGENS[erro]}</li>}

            {remotos === null && (
              <li>
                <button
                  type="button"
                  className="resultados__mais"
                  aria-busy={buscandoRemoto}
                  // mantém o foco no campo pra lista não fechar
                  onMouseDown={(evento) => evento.preventDefault()}
                  onClick={() => !buscandoRemoto && buscarEmTodas()}
                >
                  {buscandoRemoto
                    ? 'Buscando na CoinGecko…'
                    : `${locais.length === 0 ? 'Não está entre as 500 maiores. ' : ''}Buscar "${texto.trim()}" em todas as moedas`}
                </button>
              </li>
            )}
          </ul>
        )}
      </div>

      {moedas.length > 0 && (
        <ul className="chips">
          {moedas.map((moeda) => (
            <li key={moeda.id} className="chip">
              <Logo moeda={moeda} tamanho={18} />
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
