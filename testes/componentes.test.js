import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { criarInjetor } from './auxiliares.js';

// Dispara um evento nativo, como o navegador faria (fora do digest do AngularJS).
function tecla(elemento, key) {
  elemento.dispatchEvent(new KeyboardEvent('keydown', { key: key, bubbles: true }));
}

describe('menuSuspenso', () => {
  let $compile;
  let $rootScope;
  let $timeout;
  let $document;
  let escopo;
  let elemento;

  beforeEach(() => {
    const $injector = criarInjetor();
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');
    $document = $injector.get('$document');

    escopo = $rootScope.$new();
    escopo.acaoPerfil = vi.fn();
    escopo.aoSelecionar = vi.fn();
    escopo.opcoes = [
      { rotulo: 'Meu perfil', acao: escopo.acaoPerfil },
      { rotulo: 'Ajuda' },
      { rotulo: 'Sair' }
    ];
  });

  afterEach(() => {
    $rootScope.$destroy();
    elemento.remove();
  });

  // Compila a diretiva sozinha num escopo novo e a coloca no documento
  // (o foco só funciona em elementos que estão na página).
  function montar(html) {
    elemento = $compile(html)(escopo);
    document.body.appendChild(elemento[0]);
    escopo.$digest();
  }

  function montarPadrao() {
    montar('<menu-suspenso rotulo="Ana Beatriz" opcoes="opcoes" on-selecionar="aoSelecionar(opcao)"></menu-suspenso>');
  }

  function botao() {
    return elemento[0].querySelector('.menu-suspenso__botao');
  }

  function itens() {
    return elemento[0].querySelectorAll('.menu-suspenso__item');
  }

  function lista() {
    return elemento[0].querySelector('.menu-suspenso__lista');
  }

  it('renderiza o botão e a lista com os atributos ARIA do padrão menu button', () => {
    montarPadrao();
    expect(botao().textContent).toContain('Ana Beatriz');
    expect(botao().getAttribute('aria-haspopup')).toBe('true');
    expect(botao().getAttribute('aria-expanded')).toBe('false');
    expect(botao().getAttribute('aria-controls')).toBe(lista().id);
    expect(lista().getAttribute('role')).toBe('menu');
    expect(lista().getAttribute('aria-labelledby')).toBe(botao().id);
    expect(lista().classList.contains('ng-hide')).toBe(true);
    expect(itens()).toHaveLength(3);
    expect(itens()[0].getAttribute('role')).toBe('menuitem');
    expect(itens()[0].getAttribute('tabindex')).toBe('-1');
  });

  it('um clique no botão abre o menu e foca o 1º item depois do digest', () => {
    montarPadrao();
    botao().click();
    expect(botao().getAttribute('aria-expanded')).toBe('true');
    expect(lista().classList.contains('ng-hide')).toBe(false);

    $timeout.flush();
    expect(document.activeElement).toBe(itens()[0]);
  });

  it('selecionar fecha, devolve o foco ao botão e chama acao e on-selecionar', () => {
    montarPadrao();
    let focoNaHoraDaAcao = null;
    escopo.acaoPerfil.mockImplementation(() => {
      focoNaHoraDaAcao = document.activeElement;
    });

    botao().click();
    $timeout.flush();
    itens()[0].click();

    expect(escopo.acaoPerfil).toHaveBeenCalledWith(escopo.opcoes[0]);
    expect(escopo.aoSelecionar).toHaveBeenCalledWith(escopo.opcoes[0]);
    expect(focoNaHoraDaAcao).toBe(botao());
    expect(botao().getAttribute('aria-expanded')).toBe('false');
  });

  it('um clique fora do menu fecha sem mover o foco', () => {
    montarPadrao();
    botao().click();
    $timeout.flush();

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(botao().getAttribute('aria-expanded')).toBe('false');
    expect(lista().classList.contains('ng-hide')).toBe(true);
  });

  it('Esc fecha e devolve o foco ao botão', () => {
    montarPadrao();
    botao().click();
    $timeout.flush();

    tecla(itens()[0], 'Escape');

    expect(botao().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(botao());
  });

  it('setas, Home e End movem o foco entre os itens, com volta circular', () => {
    montarPadrao();
    tecla(botao(), 'ArrowUp');
    $timeout.flush();
    expect(document.activeElement).toBe(itens()[2]);

    tecla(itens()[2], 'ArrowDown');
    expect(document.activeElement).toBe(itens()[0]);

    tecla(itens()[0], 'ArrowUp');
    expect(document.activeElement).toBe(itens()[2]);

    tecla(itens()[2], 'Home');
    expect(document.activeElement).toBe(itens()[0]);

    tecla(itens()[0], 'End');
    expect(document.activeElement).toBe(itens()[2]);
  });

  it('marca a opção selecionada com aria-current e o ícone de check', () => {
    escopo.atual = escopo.opcoes[1];
    montar('<menu-suspenso rotulo="Filtro" opcoes="opcoes" selecionada="atual"></menu-suspenso>');

    expect(itens()[1].getAttribute('aria-current')).toBe('true');
    expect(itens()[1].querySelector('.menu-suspenso__check')).not.toBeNull();
    expect(itens()[0].hasAttribute('aria-current')).toBe(false);
    expect(itens()[0].querySelector('.menu-suspenso__check')).toBeNull();
  });

  it('gera IDs diferentes para dois menus na mesma página', () => {
    montarPadrao();
    const outro = $compile('<menu-suspenso rotulo="Outro" opcoes="opcoes"></menu-suspenso>')(escopo);
    escopo.$digest();
    expect(outro[0].querySelector('.menu-suspenso__botao').id).not.toBe(botao().id);
  });

  it('no $destroy remove o listener de clique do document', () => {
    const on = vi.spyOn($document, 'on');
    const off = vi.spyOn($document, 'off');
    montarPadrao();
    const ouvinte = on.mock.calls.find((chamada) => chamada[0] === 'click')[1];

    escopo.$destroy();

    expect(off).toHaveBeenCalledWith('click', ouvinte);
  });
});

describe('toastContainer', () => {
  let $compile;
  let $rootScope;
  let $timeout;
  let ToastService;
  let elemento;

  beforeEach(() => {
    const $injector = criarInjetor();
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');
    ToastService = $injector.get('ToastService');

    elemento = $compile('<toast-container></toast-container>')($rootScope.$new());
    $rootScope.$digest();
  });

  afterEach(() => {
    $rootScope.$destroy();
  });

  function regiao() {
    return elemento[0].querySelector('.toasts');
  }

  it('a região aria-live existe vazia desde o início', () => {
    expect(regiao().getAttribute('role')).toBe('status');
    expect(regiao().getAttribute('aria-live')).toBe('polite');
    expect(regiao().querySelectorAll('.toast')).toHaveLength(0);
  });

  it('mostrar("erro", "x") gera um toast de erro com o texto e o ícone', () => {
    ToastService.mostrar('erro', 'x');
    $rootScope.$digest();

    const toast = regiao().querySelector('.toast');
    expect(toast.classList.contains('toast--erro')).toBe(true);
    expect(toast.querySelector('.toast__mensagem').textContent).toBe('x');
    expect(toast.querySelector('.toast__icone g')).not.toBeNull();
    expect(toast.querySelectorAll('.toast__icone g')).toHaveLength(1);
  });

  it('"Fechar notificação" aplica a saída e remove o toast após 150 ms', () => {
    ToastService.mostrar('sucesso', 'Dados salvos.');
    $rootScope.$digest();

    const fechar = regiao().querySelector('.toast__fechar');
    expect(fechar.getAttribute('aria-label')).toBe('Fechar notificação');
    fechar.click();
    expect(regiao().querySelector('.toast').classList.contains('toast--saindo')).toBe(true);

    $timeout.flush(150);
    expect(regiao().querySelectorAll('.toast')).toHaveLength(0);
  });

  it('empilha várias mensagens com a mais nova embaixo', () => {
    ToastService.mostrar('sucesso', 'primeira');
    ToastService.mostrar('info', 'segunda');
    $rootScope.$digest();

    const mensagens = [...regiao().querySelectorAll('.toast__mensagem')].map((p) => p.textContent);
    expect(mensagens).toEqual(['primeira', 'segunda']);
  });
});
