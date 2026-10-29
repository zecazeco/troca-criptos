import Dialogo from './Dialogo';

interface AjudaProps {
  onFechar: () => void;
}

function Ajuda({ onFechar }: AjudaProps) {
  return (
    <Dialogo titulo="Como usar o Troca Criptos" className="detalhe--ajuda" onFechar={onFechar}>
      <div className="ajuda">
        <section>
          <h3>Pra que serve</h3>
          <p>
            A ideia é trocar uma moeda por bitcoin ou ethereum quando ela está <strong>mais
            valorizada em relação a eles</strong>. Pra isso, o app compara quanto a moeda vale em BTC e
            em ETH hoje com o que ela valeu em cada dia do período escolhido.
          </p>
        </section>

        <section>
          <h3>Como ler o card</h3>
          <ul>
            <li><strong>Em BTC / em ETH:</strong> quanto 1 unidade da moeda vale hoje em bitcoin ou ethereum.</li>
            <li><strong>Barra:</strong> a ponta esquerda é a mínima do período e a direita é a máxima. A bolinha mostra onde a moeda está hoje.</li>
            <li><strong>Acima de X% dos dias:</strong> em X% dos dias do período a moeda valia menos (em BTC ou ETH) do que vale hoje. Quanto mais perto de 100%, melhor pra trocar.</li>
            <li><strong>Abaixo da máxima:</strong> quanto falta pra moeda voltar ao maior valor do período.</li>
          </ul>
        </section>

        <section>
          <h3>Sinal de troca</h3>
          <p>
            O selo <span className="sinal sinal--btc">Bom momento pra trocar por BTC</span> aparece
            quando o percentil passa do limite escolhido (80% por padrão). Os cards com o maior
            percentil aparecem primeiro. Se preferir outra ordem, arraste os cards pela alça
            (os pontinhos no canto do card) ou use espaço e as setas do teclado. A ordem fica salva em
            "Minha ordem".
          </p>
        </section>

        <section className="ajuda__destaque">
          <h3>Qual gráfico usar pra decidir a troca</h3>
          <p>
            Use os gráficos <strong>"Quanto vale em BTC"</strong> e <strong>"Quanto vale em ETH"</strong>.
            Eles mostram o preço da moeda dividido pelo preço do BTC ou do ETH em cada dia, então o
            valor de um dia não muda quando você troca o período. Ao aumentar o período a linha só
            ganha mais história à esquerda, e o que muda são a mínima, a média, a máxima e o percentil.
          </p>
          <p>
            Quando a linha está perto da tracejada de <strong>máx</strong>, a moeda está comprando mais
            BTC ou ETH do que comprou em quase todo o período.
          </p>
        </section>

        <section>
          <h3>O gráfico em base 100</h3>
          <p>
            Ele põe as 3 moedas valendo 100 no <strong>primeiro dia do período</strong> e mostra quanto
            cada uma rendeu desde então:
          </p>
          <p className="ajuda__formula">valor no dia = preço no dia ÷ preço no primeiro dia × 100</p>
          <ul>
            <li><strong>200</strong> = dobrou desde o início do período (+100%)</li>
            <li><strong>110</strong> = subiu 10%</li>
            <li><strong>75</strong> = caiu 25%</li>
          </ul>
          <p>
            Isso permite comparar moedas com preços bem diferentes na mesma escala. Responde à
            pergunta: <em>"se eu tivesse comprado no começo do período, quanto cada uma teria rendido?"</em>
          </p>
        </section>

        <section>
          <h3>Por que o gráfico em base 100 muda com o período</h3>
          <p>
            Ao trocar o período, muda o dia que vale 100. Os mesmos dias recentes passam a ser
            comparados com outro preço inicial. Um exemplo:
          </p>
          <table className="ajuda__tabela">
            <thead>
              <tr>
                <th />
                <th>Período de 1 ano</th>
                <th>Período de 2 anos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Moeda hoje</th>
                <td>200: dobrou em 1 ano</td>
                <td>110: só +10% em 2 anos</td>
              </tr>
              <tr>
                <th>BTC hoje</th>
                <td>75: caiu 25% em 1 ano</td>
                <td>110: +10% em 2 anos</td>
              </tr>
            </tbody>
          </table>
          <p>
            As duas leituras estão certas: a moeda caiu forte no primeiro ano e se recuperou no
            segundo, e o BTC fez o contrário. O formato de cada linha é o mesmo, cada uma só é esticada
            ou achatada por um fator diferente. Por isso a distância entre elas muda de um período pro
            outro.
          </p>
        </section>

        <section>
          <h3>De onde vêm os dados</h3>
          <p>
            Preços diários da Binance (até 5 anos) e da CoinGecko (até 1 ano, pra moedas que não estão
            na Binance). Suas moedas ficam salvas só neste navegador.
          </p>
        </section>

        <p className="ajuda__aviso">
          É só uma comparação com o passado. <strong>Não é recomendação de investimento.</strong>
        </p>
      </div>
    </Dialogo>
  );
}

export default Ajuda;
