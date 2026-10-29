import { Moeda } from '../types';
import { DiaRelacao } from '../lib/relacoes';
import Dialogo from './Dialogo';
import GraficoRelacao from './GraficoRelacao';
import GraficoSobreposto from './GraficoSobreposto';
import Logo from './Logo';

interface DetalheMoedaProps {
  moeda: Moeda;
  dias: DiaRelacao[];
  onFechar: () => void;
}

function DetalheMoeda({ moeda, dias, onFechar }: DetalheMoedaProps) {
  return (
    <Dialogo
      titulo={<>{moeda.nome} <span className="muted">{moeda.simbolo}</span></>}
      icone={<Logo moeda={moeda} tamanho={32} />}
      onFechar={onFechar}
    >
      <GraficoSobreposto dias={dias} simbolo={moeda.simbolo} />
      <GraficoRelacao dias={dias} campo="relBtc" base="BTC" cor="#f7931a" />
      <GraficoRelacao dias={dias} campo="relEth" base="ETH" cor="#627eea" />
    </Dialogo>
  );
}

export default DetalheMoeda;
