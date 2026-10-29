import Card from './components/Card';
import Header from './components/Header';
import SeletorMoedas from './components/SeletorMoedas';
import useMoedasSalvas from './hooks/useMoedasSalvas';

function App() {
  const { moedas, adicionar, remover } = useMoedasSalvas();

  return (
    <div className="container">
      <Header />
      <h1 className="page-title">Qual o melhor momento pra trocar?</h1>
      <p className="page-subtitle">
        Compare suas criptomoedas com o bitcoin e o ethereum ao longo do tempo e veja quando
        elas estão mais valorizadas em relação a cada um.
      </p>

      <SeletorMoedas moedas={moedas} onAdicionar={adicionar} onRemover={remover} />

      {moedas.length === 0 && (
        <Card className="vazio">
          <h2 className="card__title">Comece adicionando uma moeda</h2>
          <p className="muted">
            Busque acima as moedas que você quer acompanhar. A lista fica salva só neste
            navegador, ninguém mais vê quais moedas você escolheu.
          </p>
        </Card>
      )}
    </div>
  );
}

export default App;
