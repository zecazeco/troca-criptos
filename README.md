# Troca Criptos
Compara criptomoedas com o bitcoin e o ethereum ao longo do tempo e mostra quando cada uma está mais valorizada em relação a eles, o melhor momento pra trocar por BTC ou ETH.

Demonstração: [Troca Criptos](https://zecazeco.github.io/troca-criptos/)

## Como funciona
- Busque e adicione as moedas que quer acompanhar
- Escolha o período: 3 meses, 6 meses, 1 ano, 2 anos ou 5 anos
- Cada moeda mostra quanto vale hoje em BTC e em ETH e onde esse valor está entre a mínima e a máxima do período
- O percentil diz em quantos % dos dias do período a moeda valia menos do que hoje (em BTC ou ETH)
- Quando o percentil passa do limite escolhido (80% por padrão), aparece o sinal de bom momento pra trocar
- Em "Ver gráficos" tem a relação com BTC e ETH ao longo do período e um gráfico com as 3 moedas sobrepostas em base 100

O sinal é só uma comparação com o histórico, não é recomendação de investimento.

## Privacidade
As moedas escolhidas ficam salvas só no navegador de quem usa (localStorage). Não tem servidor, login nem banco de dados, ninguém vê a lista de ninguém.

## Dados
- [Binance](https://developers.binance.com/docs/binance-spot-api-docs/rest-api): histórico diário de até 5 anos das moedas negociadas lá
- [CoinGecko](https://docs.coingecko.com/): busca de moedas e histórico de até 1 ano das moedas que não estão na Binance

As duas APIs são públicas e não precisam de chave. O histórico fica em cache no navegador por 6 horas.

## Rodando local
```bash
npm install
npm run dev
```
Depois abra http://localhost:5173/troca-criptos/

```bash
npm test          # testes dos cálculos
npm run build     # build de produção
npm run deploy    # publica no github pages
```

## Tecnologias
- React + TypeScript
- Vite
- Recharts
- Vitest

## To Do
- Informar a quantidade de cada moeda e simular quanto de BTC/ETH daria trocar hoje e no pico
- Exportar e importar a lista de moedas
- Alerta quando uma moeda passar do limite

## Author
José Luís Haas
