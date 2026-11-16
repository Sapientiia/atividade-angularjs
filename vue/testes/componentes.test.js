import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Paginacao from '../src/componentes/Paginacao.vue';
import MenuSuspenso from '../src/componentes/MenuSuspenso.vue';
import ToastContainer from '../src/componentes/ToastContainer.vue';
import Acordeao from '../src/componentes/Acordeao.vue';
import BarraProgresso from '../src/componentes/BarraProgresso.vue';
import Abas from '../src/componentes/Abas.vue';
import { toast } from '../src/servicos/toast.js';

describe('Paginacao', () => {
  function montar(paginaAtual) {
    return mount(Paginacao, { props: { totalPaginas: 4, paginaAtual } });
  }

  it('na página 1, "Anterior" fica desabilitado e só o botão 1 tem aria-current', () => {
    const wrapper = montar(1);
    const botoes = wrapper.findAll('.paginacao__botao');
    expect(botoes[0].attributes('disabled')).toBeDefined();
    expect(wrapper.findAll('[aria-current="page"]')).toHaveLength(1);
    expect(botoes[1].attributes('aria-current')).toBe('page');
    expect(botoes[5].attributes('disabled')).toBeUndefined();
  });

  it('clicar na página 3 emite mudar-pagina com 3', async () => {
    const wrapper = montar(1);
    await wrapper.findAll('.paginacao__botao')[3].trigger('click');
    expect(wrapper.emitted('mudar-pagina')[0]).toEqual([3]);
  });

  it('na última página, "Próxima" fica desabilitado', () => {
    const wrapper = montar(4);
    const botoes = wrapper.findAll('.paginacao__botao');
    expect(botoes[5].attributes('disabled')).toBeDefined();
    expect(botoes[0].attributes('disabled')).toBeUndefined();
  });
});

describe('MenuSuspenso', () => {
  const opcoes = [{ rotulo: 'Meu perfil' }, { rotulo: 'Ajuda' }, { rotulo: 'Sair' }];

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('abre ao clicar, emite selecionar com a opção e fecha', async () => {
    const wrapper = mount(MenuSuspenso, { props: { rotulo: 'Ana Beatriz', opcoes }, attachTo: document.body });
    const botao = wrapper.find('.menu-suspenso__botao');
    expect(botao.attributes('aria-expanded')).toBe('false');

    await botao.trigger('click');
    expect(botao.attributes('aria-expanded')).toBe('true');
    await nextTick();
    expect(document.activeElement.textContent.trim()).toBe('Meu perfil');

    await wrapper.findAll('.menu-suspenso__item')[1].trigger('click');
    expect(wrapper.emitted('selecionar')[0]).toEqual([opcoes[1]]);
    expect(botao.attributes('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(botao.element);
    wrapper.unmount();
  });

  it('um clique em document.body fecha o menu', async () => {
    const wrapper = mount(MenuSuspenso, { props: { rotulo: 'Ana Beatriz', opcoes }, attachTo: document.body });
    await wrapper.find('.menu-suspenso__botao').trigger('click');
    document.body.click();
    await nextTick();
    expect(wrapper.find('.menu-suspenso__botao').attributes('aria-expanded')).toBe('false');
    wrapper.unmount();
  });

  it('Esc fecha e marca a opção selecionada com aria-current', async () => {
    const wrapper = mount(MenuSuspenso, {
      props: { rotulo: 'Semestre', opcoes, selecionada: opcoes[2] }, attachTo: document.body
    });
    await wrapper.find('.menu-suspenso__botao').trigger('click');
    await wrapper.findAll('.menu-suspenso__item')[0].trigger('keydown', { key: 'Escape' });
    expect(wrapper.find('.menu-suspenso__botao').attributes('aria-expanded')).toBe('false');
    expect(wrapper.findAll('[aria-current="true"]')).toHaveLength(1);
    expect(wrapper.findAll('.menu-suspenso__item')[2].attributes('aria-current')).toBe('true');
    wrapper.unmount();
  });

  it('unmount remove o listener de clique do document', () => {
    const espiao = vi.spyOn(document, 'removeEventListener');
    const wrapper = mount(MenuSuspenso, { props: { rotulo: 'Ana Beatriz', opcoes } });
    const ouvinte = wrapper.vm.aoClicarFora;
    wrapper.unmount();
    expect(espiao).toHaveBeenCalledWith('click', ouvinte);
  });
});

describe('ToastContainer', () => {
  it('toast.mostrar gera o item na tela com a classe do tipo, e o botão o fecha', async () => {
    vi.useFakeTimers();
    toast.estado.fila.splice(0);
    const wrapper = mount(ToastContainer);

    toast.mostrar('erro', 'Erro: formato inválido. Use PDF, JPG ou PNG.');
    await nextTick();
    const item = wrapper.find('.toast');
    expect(item.classes()).toContain('toast--erro');
    expect(item.find('.toast__mensagem').text()).toBe('Erro: formato inválido. Use PDF, JPG ou PNG.');

    await wrapper.find('.toast__fechar').trigger('click');
    expect(wrapper.find('.toast').classes()).toContain('toast--saindo');
    vi.advanceTimersByTime(150);
    await nextTick();
    expect(wrapper.findAll('.toast')).toHaveLength(0);
    vi.useRealTimers();
    wrapper.unmount();
  });
});

describe('Acordeao', () => {
  const itens = [
    { titulo: 'Pergunta 1', conteudo: 'Resposta 1' },
    { titulo: 'Pergunta 2', conteudo: 'Resposta 2' },
    { titulo: 'Pergunta 3', conteudo: 'Resposta 3' }
  ];

  function estados(wrapper) {
    return wrapper.findAll('.acordeao__botao').map((botao) => botao.attributes('aria-expanded'));
  }

  it('começa fechado e mantém só um item aberto por vez', async () => {
    const wrapper = mount(Acordeao, { props: { itens } });
    expect(estados(wrapper)).toEqual(['false', 'false', 'false']);

    await wrapper.findAll('.acordeao__botao')[0].trigger('click');
    expect(estados(wrapper)).toEqual(['true', 'false', 'false']);

    await wrapper.findAll('.acordeao__botao')[1].trigger('click');
    expect(estados(wrapper)).toEqual(['false', 'true', 'false']);
    expect(wrapper.findAll('.acordeao__painel')[1].classes()).toContain('acordeao__painel--aberto');
    expect(wrapper.findAll('.acordeao__painel--aberto')).toHaveLength(1);
  });

  it('clicar no item aberto o fecha, e o botão aponta para o próprio painel', async () => {
    const wrapper = mount(Acordeao, { props: { itens } });
    const botao = wrapper.findAll('.acordeao__botao')[2];
    await botao.trigger('click');
    await botao.trigger('click');
    expect(estados(wrapper)).toEqual(['false', 'false', 'false']);
    const painel = wrapper.findAll('.acordeao__painel')[2];
    expect(botao.attributes('aria-controls')).toBe(painel.attributes('id'));
    expect(painel.attributes('aria-labelledby')).toBe(botao.attributes('id'));
  });
});

describe('BarraProgresso', () => {
  function montar(valor, mostrarPercentual = false) {
    return mount(BarraProgresso, { props: { valor, rotulo: 'Progresso do curso', mostrarPercentual } });
  }

  it('61 dá width: 61% e aria-valuenow="61"', () => {
    const wrapper = montar(61);
    expect(wrapper.find('.progresso__barra').attributes('style')).toContain('width: 61%');
    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('61');
  });

  it('limita o valor a 0–100 e arredonda', () => {
    expect(montar(150).find('[role="progressbar"]').attributes('aria-valuenow')).toBe('100');
    expect(montar(-5).find('[role="progressbar"]').attributes('aria-valuenow')).toBe('0');
    expect(montar(33.6).find('[role="progressbar"]').attributes('aria-valuenow')).toBe('34');
  });

  it('o percentual só aparece com mostrar-percentual', () => {
    expect(montar(61).find('.progresso__percentual').exists()).toBe(false);
    expect(montar(61, true).find('.progresso__percentual').text()).toBe('61%');
  });
});

describe('Abas', () => {
  const abas = [
    { id: 'dados', titulo: 'Dados pessoais' },
    { id: 'historico', titulo: 'Histórico' },
    { id: 'documentos', titulo: 'Documentos' }
  ];

  function montar() {
    return mount(Abas, {
      props: { abas, rotulo: 'Perfil do aluno' },
      slots: {
        dados: '<p class="conteudo-dados">Formulário</p>',
        historico: '<p class="conteudo-historico">Tabelas</p>',
        documentos: '<p class="conteudo-documentos">Documentos</p>'
      },
      attachTo: document.body
    });
  }

  function selecionadas(wrapper) {
    return wrapper.findAll('[role="tab"]').map((aba) => aba.attributes('aria-selected'));
  }

  it('a primeira aba começa ativa e só o painel dela fica visível', () => {
    const wrapper = montar();
    expect(selecionadas(wrapper)).toEqual(['true', 'false', 'false']);
    expect(wrapper.find('.conteudo-dados').isVisible()).toBe(true);
    expect(wrapper.find('.conteudo-historico').isVisible()).toBe(false);
    wrapper.unmount();
  });

  it('o clique troca aria-selected e mostra o slot da aba escolhida', async () => {
    const wrapper = montar();
    await wrapper.findAll('[role="tab"]')[1].trigger('click');
    expect(selecionadas(wrapper)).toEqual(['false', 'true', 'false']);
    expect(wrapper.find('.conteudo-historico').isVisible()).toBe(true);
    expect(wrapper.find('.conteudo-dados').isVisible()).toBe(false);
    wrapper.unmount();
  });

  it('as setas são circulares e movem o foco para a nova aba', async () => {
    const wrapper = montar();
    const lista = wrapper.findAll('[role="tab"]');

    await lista[0].trigger('keydown', { key: 'ArrowLeft' });
    await nextTick();
    expect(selecionadas(wrapper)).toEqual(['false', 'false', 'true']);
    expect(document.activeElement).toBe(lista[2].element);
    expect(lista[2].attributes('tabindex')).toBe('0');

    await lista[2].trigger('keydown', { key: 'ArrowRight' });
    await nextTick();
    expect(selecionadas(wrapper)).toEqual(['true', 'false', 'false']);
    expect(document.activeElement).toBe(lista[0].element);
    wrapper.unmount();
  });
});
