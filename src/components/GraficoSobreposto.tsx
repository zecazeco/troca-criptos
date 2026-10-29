import { useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DiaRelacao, normalizar } from '../lib/relacoes';
import { formatarData, formatarMes } from '../lib/formato';

interface GraficoSobrepostoProps {
  dias: DiaRelacao[];
  simbolo: string;
}

type Linha = 'moeda' | 'btc' | 'eth';

const CINZA = '#a1a1aa';
const inteiro = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

function GraficoSobreposto({ dias, simbolo }: GraficoSobrepostoProps) {
  const [ocultas, setOcultas] = useState<Linha[]>([]);
  const dados = normalizar(dias);

  const linhas: { chave: Linha; nome: string; cor: string }[] = [
    { chave: 'moeda', nome: simbolo, cor: '#0f766e' },
    { chave: 'btc', nome: 'BTC', cor: '#f7931a' },
    { chave: 'eth', nome: 'ETH', cor: '#627eea' },
  ];

  const alternar = (chave: Linha) => {
    setOcultas((atuais) => (atuais.includes(chave) ? atuais.filter((item) => item !== chave) : [...atuais, chave]));
  };

  return (
    <figure className="grafico">
      <figcaption className="grafico__legenda small">
        <span className="relacao__base">Valorização no período (base 100)</span>
        <span className="muted">clique na legenda pra esconder uma linha</span>
      </figcaption>
      <div className="grafico__area">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={dados} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
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
              tickFormatter={(valor: number) => inteiro.format(valor)}
              tick={{ fill: CINZA, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={64}
            />
            <Tooltip
              formatter={(valor: number, nome: string) => [inteiro.format(valor), nome]}
              labelFormatter={(dia: string) => formatarData(dia)}
              contentStyle={{ borderRadius: 10, border: '1px solid #ececec', fontSize: 13 }}
            />
            <ReferenceLine y={100} stroke={CINZA} strokeDasharray="4 4" />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 13, cursor: 'pointer' }}
              onClick={(item) => alternar(item.dataKey as Linha)}
              formatter={(nome: string) => {
                const linha = linhas.find((item) => item.nome === nome);
                const oculta = linha !== undefined && ocultas.includes(linha.chave);
                return <span style={{ color: oculta ? CINZA : '#18181b' }}>{nome}</span>;
              }}
            />
            {linhas.map((linha) => (
              <Line
                key={linha.chave}
                type="monotone"
                dataKey={linha.chave}
                name={linha.nome}
                stroke={linha.cor}
                strokeWidth={linha.chave === 'moeda' ? 2.25 : 1.75}
                dot={false}
                hide={ocultas.includes(linha.chave)}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

export default GraficoSobreposto;
