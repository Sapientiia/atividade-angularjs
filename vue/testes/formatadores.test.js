import { describe, it, expect } from 'vitest';
import { cargaHoraria, moeda, nota, formatarData, caixaAlta, caixaBaixa } from '../src/formatadores.js';

// O Intl separa "R$" do número com um espaço não separável (U+00A0).
const ESPACO = ' ';

// Os mesmos casos dos filtros da versão AngularJS.
describe('formatadores', () => {
  it('cargaHoraria mostra as horas com separador de milhar', () => {
    expect(cargaHoraria(60)).toBe('60 h');
    expect(cargaHoraria(2190)).toBe('2.190 h');
    expect(cargaHoraria(null)).toBe('');
  });

  it('moeda formata em reais no padrão brasileiro', () => {
    expect(moeda(1798.4)).toBe('R$' + ESPACO + '1.798,40');
  });

  it('nota usa uma casa decimal com vírgula e travessão quando não há nota', () => {
    expect(nota(8.2)).toBe('8,2');
    expect(nota(null)).toBe('—');
  });

  it('formatarData divide o texto, sem passar por new Date', () => {
    expect(formatarData('2026-11-20')).toBe('20/11/2026');
    expect(formatarData('2027-02-08')).toBe('08/02/2027');
  });

  it('caixaAlta e caixaBaixa equivalem aos filtros uppercase e lowercase', () => {
    expect(caixaAlta('engs701')).toBe('ENGS701');
    expect(caixaBaixa('Até 2 dias úteis')).toBe('até 2 dias úteis');
  });
});
