import { Moeda } from '../types';
import { EstadoHistorico } from '../hooks/useHistoricos';
import { metricas, Metricas, Periodo, recortar } from '../lib/relacoes';
import { formatarData, formatarPorcentagem, formatarRelacao, formatarUsd } from '../lib/formato';
import Card from './Card';
import Button from './Button';
import Logo from './Logo';

interface CardMoedaProps {
  moeda: Moeda;
  estado: EstadoHistorico | undefined;
  periodo: Periodo;
  onTentarDeNovo: () => void;
}

interface LinhaRelacaoProps {
  base: 'BTC' | 'ETH';
  dados: Metricas;
}

function LinhaRelacao({ base, dados }: LinhaRelacaoProps) {
  const amplitude = dados.max - dados.min;
  const posicao = amplitude > 0 ? ((dados.atual - dados.min) / amplitude) * 100 : 100;
  const abaixoDoMaximo = ((dados.max - dados.atual) / dados.max) * 100;

  return (
    <div className={`relacao relacao--${base.toLowerCase()}`}>
      <div className="relacao__topo">
        <span className="relacao__base">
          <span className="ponto" aria-hidden="true" />
          em {base}
        </span>
        <span className="relacao__valor num">{formatarRelacao(dados.atual)} {base}</span>
      </div>

      <div
        className="faixa"
        role="img"
        aria-label={`Relação atual está em ${formatarPorcentagem(posicao)} entre a mínima e a máxima do período`}
      >
        <div className="faixa__preenchida" style={{ width: `${posicao}%` }} />
        <div className="faixa__marcador" style={{ left: `${posicao}%` }} />
      </div>

      <div className="relacao__rodape small muted num">
        <span>Acima de {formatarPorcentagem(dados.percentil)} dos dias</span>
        <span>{abaixoDoMaximo < 0.5 ? 'na máxima do período' : `${formatarPorcentagem(abaixoDoMaximo)} abaixo da máxima`}</span>
      </div>
    </div>
  );
}

function CardMoeda({ moeda, estado, periodo, onTentarDeNovo }: CardMoedaProps) {
  const cabecalho = (preco?: number) => (
    <div className="moeda__cabecalho">
      <Logo moeda={moeda} tamanho={32} />
      <div className="moeda__nome">
        <h2 className="card__title">{moeda.nome}</h2>
        <span className="small muted">{moeda.simbolo}</span>
      </div>
      {preco !== undefined && <span className="moeda__preco num">{formatarUsd(preco)}</span>}
    </div>
  );

  if (!estado || estado.status === 'carregando') {
    return (
      <Card className="moeda" aria-busy="true">
        {cabecalho()}
        <div className="esqueleto" />
        <div className="esqueleto" />
      </Card>
    );
  }

  if (estado.status === 'erro') {
    return (
      <Card className="moeda">
        {cabecalho()}
        <p className="aviso aviso--erro">Não foi possível carregar o histórico desta moeda.</p>
        <Button variant="ghost" onClick={onTentarDeNovo}>Tentar de novo</Button>
      </Card>
    );
  }

  const { dias, completo } = recortar(estado.serie, periodo);
  const btc = metricas(dias, 'relBtc');
  const eth = metricas(dias, 'relEth');

  if (!btc || !eth) {
    return (
      <Card className="moeda">
        {cabecalho()}
        <p className="aviso">Sem histórico de preços para esta moeda.</p>
      </Card>
    );
  }

  return (
    <Card className="moeda">
      {cabecalho(dias[dias.length - 1].moeda)}
      <LinhaRelacao base="BTC" dados={btc} />
      <LinhaRelacao base="ETH" dados={eth} />
      {!completo && (
        <p className="aviso small">
          {estado.fonte === 'coingecko'
            ? 'Moeda fora da Binance: o histórico vai só até 1 ano.'
            : `Histórico disponível só desde ${formatarData(dias[0].dia)}.`}
        </p>
      )}
    </Card>
  );
}

export default CardMoeda;
