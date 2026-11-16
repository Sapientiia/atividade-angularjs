import { describe, it, expect, beforeEach } from 'vitest';
import { criarInjetor } from './auxiliares.js';

describe('CatalogoController', () => {
  let catalogo;
  let ToastService;

  beforeEach(() => {
    const $injector = criarInjetor();
    ToastService = $injector.get('ToastService');
    catalogo = $injector.get('$controller')('CatalogoController', {
      $scope: $injector.get('$rootScope').$new()
    });
  });

  function buscar(termo) {
    catalogo.termo = termo;
    catalogo.aoBuscar();
  }

  function opcao(rotulo) {
    return catalogo.opcoesSemestre.find((item) => item.rotulo === rotulo);
  }

  function codigos() {
    return catalogo.filtradas.map((disciplina) => disciplina.codigo);
  }

  it('começa com as 16 disciplinas em ordem de código, em 4 páginas', () => {
    expect(catalogo.filtradas).toHaveLength(16);
    expect(codigos()[0]).toBe('engs503');
    expect(codigos()[15]).toBe('opt105');
    expect(catalogo.totalPaginas).toBe(4);
    expect(catalogo.pagina).toBe(1);
    expect(catalogo.semestre.rotulo).toBe('Todos os semestres');
  });

  it('a busca compara só código e nome, sem diferenciar maiúsculas', () => {
    buscar('banco');
    expect(codigos()).toEqual(['engs503']);

    buscar('ENGS8');
    expect(catalogo.filtradas).toHaveLength(5);

    buscar('noturno');
    expect(catalogo.filtradas).toHaveLength(0);
    expect(catalogo.totalPaginas).toBe(0);
  });

  it('o filtro "Optativas" deixa 5 disciplinas em 1 página', () => {
    catalogo.filtrarPorSemestre(opcao('Optativas'));
    expect(catalogo.filtradas).toHaveLength(5);
    expect(catalogo.totalPaginas).toBe(1);
  });

  it('"7º semestre" com a busca "software" combina os dois e dá 2 disciplinas', () => {
    catalogo.filtrarPorSemestre(opcao('7º semestre'));
    buscar('software');
    expect(codigos()).toEqual(['engs701', 'engs704']);
  });

  it('buscar e trocar o semestre voltam à página 1', () => {
    catalogo.irPara(3);
    expect(catalogo.inicioDaPagina()).toBe(10);
    buscar('engs');
    expect(catalogo.pagina).toBe(1);

    catalogo.irPara(2);
    catalogo.filtrarPorSemestre(opcao('8º semestre'));
    expect(catalogo.pagina).toBe(1);
  });

  it('solicitar ENGS701 atualiza o resumo e mostra o T-03 na fila de toasts', () => {
    const disciplina = catalogo.filtradas.find((item) => item.codigo === 'engs701');
    catalogo.solicitar(disciplina);

    expect(disciplina.vagas).toBe(34);
    expect(catalogo.rotuloDoBotao(disciplina)).toBe('Solicitada');
    expect(catalogo.resumo).toEqual({ quantidade: 1, creditos: 3, valorMensal: 337.2 });
    expect(ToastService.fila).toHaveLength(1);
    expect(ToastService.fila[0].tipo).toBe('sucesso');
    expect(ToastService.fila[0].mensagem).toBe('Matrícula solicitada: ENGS701 – Qualidade de Software.');
  });

  it('rótulos do botão: "Sem vagas" para ENGS703 e "Solicitar matrícula" para as demais', () => {
    const semVagas = catalogo.filtradas.find((item) => item.codigo === 'engs703');
    expect(catalogo.rotuloDoBotao(semVagas)).toBe('Sem vagas');
    catalogo.solicitar(semVagas);
    expect(ToastService.fila).toHaveLength(0);
    expect(catalogo.rotuloDoBotao(catalogo.filtradas[0])).toBe('Solicitar matrícula');
  });
});
