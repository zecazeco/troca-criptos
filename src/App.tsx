import { lazy, Suspense, useState } from 'react';
import Card from './components/Card';
import CardMoeda from './components/CardMoeda';
import Header from './components/Header';
import SeletorMoedas from './components/SeletorMoedas';
import SeletorPeriodo from './components/SeletorPeriodo';
import useArmazenado from './hooks/useArmazenado';
import useHistoricos from './hooks/useHistoricos';
import useMoedasSalvas from './hooks/useMoedasSalvas';
import { Periodo, recortar } from './lib/relacoes';

// os gráficos só carregam quando abre o detalhe de uma moeda
const DetalheMoeda = lazy(() => import('./components/DetalheMoeda'));

function App() {
  const { moedas, adicionar, remover } = useMoedasSalvas();
  const [periodo, setPeriodo] = useArmazenado<Periodo>('periodo', '1a');
  const { estados, tentarDeNovo } = useHistoricos(moedas);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const moedaSelecionada = moedas.find((moeda) => moeda.id === selecionada);
  const estadoSelecionado = selecionada ? estados[selecionada] : undefined;

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
            <span className="small muted">Comparando nos últimos</span>
            <SeletorPeriodo periodo={periodo} onMudar={setPeriodo} />
          </div>
          <div className="grade">
            {moedas.map((moeda) => (
              <CardMoeda
                key={moeda.id}
                moeda={moeda}
                estado={estados[moeda.id]}
                periodo={periodo}
                onTentarDeNovo={() => tentarDeNovo(moeda.id)}
                onAbrir={() => setSelecionada(moeda.id)}
              />
            ))}
          </div>
        </>
      )}

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
