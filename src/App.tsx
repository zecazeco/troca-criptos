import { lazy, Suspense, useState } from 'react';
import Card from './components/Card';
import CardMoeda from './components/CardMoeda';
import Header from './components/Header';
import SeletorMoedas from './components/SeletorMoedas';
import SeletorPeriodo from './components/SeletorPeriodo';
import useArmazenado from './hooks/useArmazenado';
import useHistoricos from './hooks/useHistoricos';
import useMoedasSalvas from './hooks/useMoedasSalvas';
import { Periodo, pontuacao, recortar, resumir } from './lib/relacoes';

// os gráficos só carregam quando abre o detalhe de uma moeda
const DetalheMoeda = lazy(() => import('./components/DetalheMoeda'));

function App() {
  const { moedas, adicionar, remover } = useMoedasSalvas();
  const [periodo, setPeriodo] = useArmazenado<Periodo>('periodo', '1a');
  const { estados, tentarDeNovo } = useHistoricos(moedas);
  const [limite, setLimite] = useArmazenado('limite', 80);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const moedaSelecionada = moedas.find((moeda) => moeda.id === selecionada);
  const estadoSelecionado = selecionada ? estados[selecionada] : undefined;

  const nota = (id: string) => {
    const estado = estados[id];
    return estado?.status === 'ok' ? pontuacao(resumir(estado.serie, periodo)) : -1;
  };
  const ordenadas = [...moedas].sort((a, b) => nota(b.id) - nota(a.id));

  return (
    <div className="container">
      <Header />
      <h1 className="page-title">Qual o melhor momento pra trocar?</h1>
      <p className="page-subtitle">
        Compare suas criptomoedas com o bitcoin e o ethereum ao longo do tempo e veja quando
        elas estão mais valorizadas em relação a cada um.
      </p>

      <SeletorMoedas moedas={moedas} onAdicionar={adicionar} onRemover={remover} />

      {moedas.length === 0 ? (
        <Card className="vazio">
          <h2 className="card__title">Comece adicionando uma moeda</h2>
          <p className="muted">
            Busque acima as moedas que você quer acompanhar. A lista fica salva só neste
            navegador, ninguém mais vê quais moedas você escolheu.
          </p>
        </Card>
      ) : (
        <>
          <div className="barra">
            <SeletorPeriodo periodo={periodo} onMudar={setPeriodo} />
            <label className="limite small muted">
              Sinal de troca acima de
              <select className="limite__select" value={limite} onChange={(evento) => setLimite(Number(evento.target.value))}>
                {[70, 75, 80, 85, 90, 95].map((valor) => (
                  <option key={valor} value={valor}>{valor}%</option>
                ))}
              </select>
              dos dias
            </label>
          </div>
          <div className="grade">
            {ordenadas.map((moeda) => (
              <CardMoeda
                key={moeda.id}
                moeda={moeda}
                estado={estados[moeda.id]}
                periodo={periodo}
                limite={limite}
                onTentarDeNovo={() => tentarDeNovo(moeda.id)}
                onAbrir={() => setSelecionada(moeda.id)}
              />
            ))}
          </div>
        </>
      )}

      <footer className="rodape small muted">
        <p>
          O sinal aparece quando a moeda vale mais em BTC ou ETH do que na maior parte dos dias do
          período. É só uma comparação com o passado, <strong>não é recomendação de investimento</strong>.
        </p>
        <p>Preços da Binance (até 5 anos) e da CoinGecko (até 1 ano).</p>
      </footer>

      {moedaSelecionada && estadoSelecionado?.status === 'ok' && (
        <Suspense fallback={null}>
          <DetalheMoeda
            moeda={moedaSelecionada}
            dias={recortar(estadoSelecionado.serie, periodo).dias}
            onFechar={() => setSelecionada(null)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
