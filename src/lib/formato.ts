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

const mes = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' });

export const formatarMes = (dia: string) => mes.format(new Date(`${dia}T00:00:00Z`)).replace('. de ', '/').replace('.', '');

const eixo = new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 2 });

export const formatarEixo = (valor: number) => eixo.format(valor);
