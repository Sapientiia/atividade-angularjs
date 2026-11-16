// Formatadores: o Vue 3 não tem filtros como o AngularJS ({{ valor | filtro }}).
// No lugar deles, funções comuns que os componentes declaram em "methods" e
// chamam no template: {{ moeda(disciplina.valorMensal) }}.

const numero = new Intl.NumberFormat('pt-BR');
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const decimal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// 2190 -> "2.190 h" (equivale ao filtro próprio cargaHoraria).
export function cargaHoraria(horas) {
  if (horas === null || horas === undefined) {
    return '';
  }
  return numero.format(horas) + ' h';
}

// 1798.4 -> "R$ 1.798,40" (equivale ao filtro próprio moeda).
export function moeda(valor) {
  if (valor === null || valor === undefined) {
    return '';
  }
  return real.format(valor);
}

// 8.2 -> "8,2"; null (disciplina em curso) -> "—" (equivale ao filtro nota).
export function nota(valor) {
  if (valor === null || valor === undefined) {
    return '—';
  }
  return decimal.format(valor);
}

// '2026-11-20' -> '20/11/2026' (equivale a date:'dd/MM/yyyy').
// Divide o texto em vez de usar new Date('2026-11-20'): essa data seria lida
// como meia-noite em UTC e, no fuso do Brasil, mostraria o dia anterior.
export function formatarData(texto) {
  if (!texto) {
    return '';
  }
  const [ano, mes, dia] = texto.split('-');
  return dia + '/' + mes + '/' + ano;
}

// 'engs701' -> 'ENGS701' (equivale ao filtro uppercase).
export function caixaAlta(texto) {
  return String(texto).toUpperCase();
}

// 'Até 2 dias úteis' -> 'até 2 dias úteis' (equivale ao filtro lowercase).
export function caixaBaixa(texto) {
  return String(texto).toLowerCase();
}
