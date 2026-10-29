const usd = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD', maximumSignificantDigits: 6 });
const relacao = new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 4 });
const porcentagem = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

export const formatarUsd = (valor: number) => usd.format(valor);

export const formatarRelacao = (valor: number) => relacao.format(valor);

export const formatarPorcentagem = (valor: number) => `${porcentagem.format(valor)}%`;

export function formatarData(dia: string) {
  const [ano, mes, diaDoMes] = dia.split('-');
  return `${diaDoMes}/${mes}/${ano}`;
}
