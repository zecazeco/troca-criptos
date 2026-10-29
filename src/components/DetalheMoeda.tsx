import { useEffect, useRef } from 'react';
import { Moeda } from '../types';
import { DiaRelacao } from '../lib/relacoes';
import GraficoRelacao from './GraficoRelacao';
import Logo from './Logo';

interface DetalheMoedaProps {
  moeda: Moeda;
  dias: DiaRelacao[];
  onFechar: () => void;
}

function DetalheMoeda({ moeda, dias, onFechar }: DetalheMoedaProps) {
  const dialogo = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogo.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogo}
      className="detalhe"
      aria-labelledby="detalhe-titulo"
      onClose={onFechar}
      onClick={(evento) => {
        // fecha ao clicar fora do conteúdo
        if (evento.target === dialogo.current) dialogo.current.close();
      }}
    >
      <div className="detalhe__conteudo">
        <div className="detalhe__topo">
          <Logo moeda={moeda} tamanho={32} />
          <h2 id="detalhe-titulo" className="detalhe__titulo">
            {moeda.nome} <span className="muted">{moeda.simbolo}</span>
          </h2>
          <button type="button" className="detalhe__fechar" aria-label="Fechar" onClick={() => dialogo.current?.close()}>
            ×
          </button>
        </div>

        <GraficoRelacao dias={dias} campo="relBtc" base="BTC" cor="#f7931a" />
        <GraficoRelacao dias={dias} campo="relEth" base="ETH" cor="#627eea" />
      </div>
    </dialog>
  );
}

export default DetalheMoeda;
