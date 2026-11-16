import { describe, it, expect, beforeEach } from 'vitest';
import { criarInjetor } from './auxiliares.js';

// O Intl separa "R$" do número com um espaço não separável (U+00A0).
const ESPACO = ' ';

describe('filtros próprios (portal.filtros)', () => {
  let $filter;

  beforeEach(() => {
    $filter = criarInjetor().get('$filter');
  });

  it('cargaHoraria mostra as horas com separador de milhar', () => {
    const cargaHoraria = $filter('cargaHoraria');
    expect(cargaHoraria(60)).toBe('60 h');
    expect(cargaHoraria(2190)).toBe('2.190 h');
    expect(cargaHoraria(null)).toBe('');
  });

  it('moeda formata em reais no padrão brasileiro', () => {
    expect($filter('moeda')(1798.4)).toBe('R$' + ESPACO + '1.798,40');
  });

  it('nota usa uma casa decimal com vírgula e travessão quando não há nota', () => {
    const nota = $filter('nota');
    expect(nota(8.2)).toBe('8,2');
    expect(nota(null)).toBe('—');
  });
});
