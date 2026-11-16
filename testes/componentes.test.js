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

describe('acordeao', () => {
  let $rootScope;
  let elemento;

  beforeEach(() => {
    const $injector = criarInjetor();
    $rootScope = $injector.get('$rootScope');
    const escopo = $rootScope.$new();
    escopo.itens = [
      { titulo: 'Primeira', conteudo: 'Texto 1' },
      { titulo: 'Segunda', conteudo: 'Texto 2' },
      { titulo: 'Terceira', conteudo: 'Texto 3' }
    ];
    elemento = $injector.get('$compile')('<acordeao itens="itens"></acordeao>')(escopo);
    escopo.$digest();
  });

  afterEach(() => {
    $rootScope.$destroy();
  });

  function botoes() {
    return elemento[0].querySelectorAll('.acordeao__botao');
  }

  function paineis() {
    return elemento[0].querySelectorAll('.acordeao__painel');
  }

  it('começa com todos fechados e liga cada botão ao seu painel', () => {
    expect(botoes()).toHaveLength(3);
    botoes().forEach((botao, i) => {
      expect(botao.getAttribute('aria-expanded')).toBe('false');
      expect(botao.getAttribute('aria-controls')).toBe(paineis()[i].id);
      expect(paineis()[i].getAttribute('role')).toBe('region');
      expect(paineis()[i].getAttribute('aria-labelledby')).toBe(botao.id);
    });
    expect(botoes()[0].closest('h3').classList.contains('acordeao__titulo')).toBe(true);
    expect(paineis()[1].textContent.trim()).toBe('Texto 2');
  });

  it('abrir o 2º item fecha o 1º (só um aberto por vez)', () => {
    botoes()[0].click();
    expect(botoes()[0].getAttribute('aria-expanded')).toBe('true');
    expect(paineis()[0].classList.contains('acordeao__painel--aberto')).toBe(true);

    botoes()[1].click();
    expect(botoes()[0].getAttribute('aria-expanded')).toBe('false');
    expect(botoes()[1].getAttribute('aria-expanded')).toBe('true');
    expect(paineis()[0].classList.contains('acordeao__painel--aberto')).toBe(false);
    expect(elemento[0].querySelectorAll('.acordeao__painel--aberto')).toHaveLength(1);
  });

  it('clicar no item aberto o fecha', () => {
    botoes()[2].click();
    botoes()[2].click();
    expect(botoes()[2].getAttribute('aria-expanded')).toBe('false');
    expect(elemento[0].querySelectorAll('.acordeao__painel--aberto')).toHaveLength(0);
  });

  it('o painel não usa ng-show nem ng-if', () => {
    paineis().forEach((painel) => {
      expect(painel.classList.contains('ng-hide')).toBe(false);
    });
    expect(elemento[0].querySelectorAll('[ng-show], [ng-if]')).toHaveLength(0);
  });
});

describe('paginacao', () => {
  let $rootScope;
  let escopo;
  let elemento;

  beforeEach(() => {
    const $injector = criarInjetor();
    $rootScope = $injector.get('$rootScope');
    escopo = $rootScope.$new();
    escopo.total = 4;
    escopo.atual = 1;
    // Como o controlador do catálogo: o pai é quem muda a página.
    escopo.irPara = vi.fn((pagina) => {
      escopo.atual = pagina;
    });
    elemento = $injector.get('$compile')(
      '<paginacao total-paginas="total" pagina-atual="atual" on-mudar-pagina="irPara(pagina)" rotulo="Paginação de teste"></paginacao>'
    )(escopo);
    document.body.appendChild(elemento[0]);
    escopo.$digest();
  });

  afterEach(() => {
    $rootScope.$destroy();
    elemento.remove();
  });

  function botao(rotulo) {
    return elemento[0].querySelector('[aria-label="' + rotulo + '"]');
  }

  function comAriaCurrent() {
    return [...elemento[0].querySelectorAll('[aria-current]')];
  }

  it('renderiza o nav com o rótulo e um botão por página', () => {
    expect(elemento[0].querySelector('nav.paginacao').getAttribute('aria-label')).toBe('Paginação de teste');
    expect(elemento[0].querySelectorAll('.paginacao__botao')).toHaveLength(6);
    expect(botao('Página 4').textContent).toBe('4');
  });

  it('na página 1, "Anterior" fica disabled e aria-current="page" fica só no botão 1', () => {
    expect(botao('Página anterior').disabled).toBe(true);
    expect(botao('Próxima página').disabled).toBe(false);
    expect(comAriaCurrent()).toEqual([botao('Página 1')]);
    expect(botao('Página 1').getAttribute('aria-current')).toBe('page');
    expect(botao('Página 1').classList.contains('paginacao__botao--atual')).toBe(true);
  });

  it('clicar no 3 chama o callback com 3', () => {
    botao('Página 3').click();
    expect(escopo.irPara).toHaveBeenCalledWith(3);
    expect(comAriaCurrent()).toEqual([botao('Página 3')]);
  });

  it('na última página, "Próxima" fica disabled e o foco vai para a página atual', () => {
    escopo.atual = 3;
    escopo.$digest();
    botao('Próxima página').focus();
    botao('Próxima página').click();

    expect(escopo.irPara).toHaveBeenCalledWith(4);
    expect(botao('Próxima página').disabled).toBe(true);
    expect(botao('Página anterior').disabled).toBe(false);
    expect(document.activeElement).toBe(botao('Página 4'));
  });

  it('ignora a página atual e nunca muda a página por conta própria', () => {
    botao('Página 1').click();
    expect(escopo.irPara).not.toHaveBeenCalled();

    escopo.irPara.mockImplementation(() => {}); // pai que não aceita a mudança
    botao('Página 2').click();
    expect(escopo.irPara).toHaveBeenCalledWith(2);
    expect(comAriaCurrent()).toEqual([botao('Página 1')]);
  });

  it('recalcula as páginas quando o total muda; com 1 página, os dois extremos ficam disabled', () => {
    escopo.total = 1;
    escopo.$digest();
    expect(elemento[0].querySelectorAll('.paginacao__botao')).toHaveLength(3);
    expect(botao('Página anterior').disabled).toBe(true);
    expect(botao('Próxima página').disabled).toBe(true);
  });
});

describe('barraProgresso', () => {
  let $rootScope;
  let escopo;
  let $compile;

  beforeEach(() => {
    const $injector = criarInjetor();
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
    escopo = $rootScope.$new();
  });

  afterEach(() => {
    $rootScope.$destroy();
  });

  function montar(html) {
    const elemento = $compile(html)(escopo);
    escopo.$digest();
    return {
      trilho: elemento[0].querySelector('.progresso__trilho'),
      barra: elemento[0].querySelector('.progresso__barra'),
      percentual: () => elemento[0].querySelector('.progresso__percentual')
    };
  }

  it('61 dá width: 61% e aria-valuenow="61" no trilho', () => {
    escopo.valor = 61;
    const { trilho, barra, percentual } = montar('<barra-progresso valor="valor" rotulo="Progresso do curso" mostrar-percentual="true"></barra-progresso>');

    expect(barra.style.width).toBe('61%');
    expect(trilho.getAttribute('role')).toBe('progressbar');
    expect(trilho.getAttribute('aria-valuenow')).toBe('61');
    expect(trilho.getAttribute('aria-valuemin')).toBe('0');
    expect(trilho.getAttribute('aria-valuemax')).toBe('100');
    expect(trilho.getAttribute('aria-label')).toBe('Progresso do curso');
    expect(percentual().textContent).toBe('61%');
    expect(percentual().getAttribute('aria-hidden')).toBe('true');
  });

  it('limita a 0–100, arredonda e acompanha o valor quando ele muda', () => {
    escopo.valor = 150;
    const { trilho, barra } = montar('<barra-progresso valor="valor" rotulo="Envio"></barra-progresso>');
    expect(trilho.getAttribute('aria-valuenow')).toBe('100');

    escopo.valor = -5;
    escopo.$digest();
    expect(barra.style.width).toBe('0%');

    escopo.valor = '33.6';
    escopo.$digest();
    expect(trilho.getAttribute('aria-valuenow')).toBe('34');
  });

  it('o percentual só aparece com mostrar-percentual', () => {
    escopo.valor = 40;
    const { percentual } = montar('<barra-progresso valor="valor" rotulo="Envio"></barra-progresso>');
    expect(percentual()).toBeNull();
  });
});

describe('abas e aba', () => {
  let $rootScope;
  let escopo;
  let elemento;

  beforeEach(() => {
    const $injector = criarInjetor();
    $rootScope = $injector.get('$rootScope');
    escopo = $rootScope.$new();
    escopo.dados = { email: 'a@b.com' };
    elemento = $injector.get('$compile')(
      '<abas rotulo="Perfil do aluno">' +
      '  <aba titulo="Dados pessoais"><input class="campo-teste" ng-model="dados.email"></aba>' +
      '  <aba titulo="Histórico">Conteúdo 2</aba>' +
      '  <aba titulo="Documentos">Conteúdo 3</aba>' +
      '</abas>'
    )(escopo);
    document.body.appendChild(elemento[0]);
    escopo.$digest();
  });

  afterEach(() => {
    $rootScope.$destroy();
    elemento.remove();
  });

  function abas() {
    return elemento[0].querySelectorAll('[role="tab"]');
  }

  function paineis() {
    return elemento[0].querySelectorAll('[role="tabpanel"]');
  }

  it('a 1ª aba começa ativa, com os IDs ligando aba e painel', () => {
    expect(elemento[0].querySelector('[role="tablist"]').getAttribute('aria-label')).toBe('Perfil do aluno');
    expect([...abas()].map((aba) => aba.textContent)).toEqual(['Dados pessoais', 'Histórico', 'Documentos']);
    expect([...abas()].map((aba) => aba.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
    expect([...abas()].map((aba) => aba.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
    abas().forEach((aba, i) => {
      expect(aba.getAttribute('aria-controls')).toBe(paineis()[i].id);
      expect(paineis()[i].getAttribute('aria-labelledby')).toBe(aba.id);
    });
    expect(paineis()[0].classList.contains('ng-hide')).toBe(false);
    expect(paineis()[1].classList.contains('ng-hide')).toBe(true);
  });

  it('um clique na 2ª troca aria-selected e remove ng-hide do painel', () => {
    abas()[1].click();
    expect(abas()[0].getAttribute('aria-selected')).toBe('false');
    expect(abas()[1].getAttribute('aria-selected')).toBe('true');
    expect(paineis()[1].classList.contains('ng-hide')).toBe(false);
    expect(paineis()[0].classList.contains('ng-hide')).toBe(true);
    // ng-show, e não ng-if: o painel inativo continua no DOM.
    expect(paineis()).toHaveLength(3);
  });

  it('seta para a esquerda na 1ª vai para a última e move o foco; Home e End também', () => {
    abas()[0].focus();
    tecla(abas()[0], 'ArrowLeft');
    expect(abas()[2].getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(abas()[2]);

    tecla(abas()[2], 'ArrowRight');
    expect(abas()[0].getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(abas()[0]);

    tecla(abas()[0], 'End');
    expect(document.activeElement).toBe(abas()[2]);
    tecla(abas()[2], 'Home');
    expect(document.activeElement).toBe(abas()[0]);
  });

  it('ng-model dentro da aba altera o escopo do pai (transclusão)', () => {
    const campo = elemento[0].querySelector('.campo-teste');
    expect(campo.value).toBe('a@b.com');
    campo.value = 'novo@b.com';
    campo.dispatchEvent(new Event('input'));
    expect(escopo.dados.email).toBe('novo@b.com');
  });
});

describe('seletorArquivo', () => {
  let $rootScope;
  let escopo;
  let campo;
  let valor;

  beforeEach(() => {
    const $injector = criarInjetor();
    $rootScope = $injector.get('$rootScope');
    escopo = $rootScope.$new();
    escopo.arquivo = null;
    escopo.escolher = vi.fn((arquivo) => {
      escopo.arquivo = arquivo;
    });
    const elemento = $injector.get('$compile')(
      '<input type="file" seletor-arquivo arquivo="arquivo" on-selecionar="escolher(arquivo)">'
    )(escopo);
    campo = elemento[0];
    // O jsdom não deixa escrever um caminho no value de um campo de arquivo;
    // um getter/setter simulado permite conferir a limpeza.
    valor = '';
    Object.defineProperty(campo, 'value', { get: () => valor, set: (v) => { valor = v; } });
    escopo.$digest();
  });

  afterEach(() => {
    $rootScope.$destroy();
  });

  function escolherArquivo(arquivo) {
    Object.defineProperty(campo, 'files', { value: [arquivo], configurable: true });
    valor = 'C:\\fakepath\\' + arquivo.name;
    campo.dispatchEvent(new Event('change'));
  }

  it('o change entrega o File ao callback', () => {
    const arquivo = new File(['x'], 'atestado.png', { type: 'image/png' });
    escolherArquivo(arquivo);
    expect(escopo.escolher).toHaveBeenCalledWith(arquivo);
    expect(escopo.arquivo).toBe(arquivo);
  });

  it('com o binding em null, o value do campo fica vazio', () => {
    escolherArquivo(new File(['x'], 'atestado.png'));
    escopo.$digest();
    expect(valor).toBe('C:\\fakepath\\atestado.png');

    escopo.arquivo = null;
    escopo.$digest();
    expect(valor).toBe('');
  });

  it('no $destroy remove o listener de change', () => {
    escopo.$destroy();
    escolherArquivo(new File(['x'], 'atestado.png'));
    expect(escopo.escolher).not.toHaveBeenCalled();
  });
});
