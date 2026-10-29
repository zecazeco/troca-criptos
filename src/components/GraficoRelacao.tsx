import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DiaRelacao, metricas } from '../lib/relacoes';
import { formatarData, formatarEixo, formatarMes, formatarRelacao } from '../lib/formato';

interface GraficoRelacaoProps {
  dias: DiaRelacao[];
  campo: 'relBtc' | 'relEth';
  base: 'BTC' | 'ETH';
  cor: string;
}

const CINZA = '#a1a1aa';

function GraficoRelacao({ dias, campo, base, cor }: GraficoRelacaoProps) {
  const dados = metricas(dias, campo);
  if (!dados) return null;

  return (
    <figure className="grafico">
      <figcaption className="grafico__legenda small">
        <span className="relacao__base">
          <span className="ponto" style={{ background: cor }} aria-hidden="true" />
          Quanto vale em {base}
        </span>
        <span className="muted num">
          máxima {formatarRelacao(dados.max)} em {formatarData(dados.diaMax)}
        </span>
      </figcaption>
      <div className="grafico__area">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dias} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#f1f1f3" vertical={false} />
            <XAxis
              dataKey="dia"
              tickFormatter={formatarMes}
              tick={{ fill: CINZA, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              minTickGap={40}
            />
            <YAxis
              tickFormatter={formatarEixo}
              tick={{ fill: CINZA, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={64}
              domain={[dados.min * 0.9, dados.max * 1.05]}
              tickCount={5}
            />
            <Tooltip
              formatter={(valor: number) => [`${formatarRelacao(valor)} ${base}`, 'Relação']}
              labelFormatter={(dia: string) => formatarData(dia)}
              contentStyle={{ borderRadius: 10, border: '1px solid #ececec', fontSize: 13 }}
            />
            <ReferenceLine y={dados.max} stroke={CINZA} strokeDasharray="4 4" label={{ value: 'máx', position: 'insideTopLeft', fill: CINZA, fontSize: 11 }} />
            <ReferenceLine y={dados.media} stroke={CINZA} strokeDasharray="2 4" label={{ value: 'média', position: 'insideTopLeft', fill: CINZA, fontSize: 11 }} />
            <ReferenceLine y={dados.min} stroke={CINZA} strokeDasharray="4 4" label={{ value: 'mín', position: 'insideBottomLeft', fill: CINZA, fontSize: 11 }} />
            <Line type="monotone" dataKey={campo} stroke={cor} strokeWidth={2} dot={false} isAnimationActive={false} />
            <ReferenceDot x={dados.diaMax} y={dados.max} r={5} fill={cor} stroke="#fff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

export default GraficoRelacao;
