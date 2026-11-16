import { describe, it, expect, beforeEach } from 'vitest';
import { criarInjetor } from './auxiliares.js';

const MB = 1024 * 1024;

describe('DisciplinasService', () => {
  let servico;

  beforeEach(() => {
    servico = criarInjetor().get('DisciplinasService');
  });

  function buscar(codigo) {
    return servico.listar().find((disciplina) => disciplina.codigo === codigo);
  }

  it('lista as 16 disciplinas ofertadas', () => {
    expect(servico.listar()).toHaveLength(16);
    expect(servico.listar()).toBe(servico.listar());
  });

  it('calcula o valor mensal em centavos, sem erro de ponto flutuante', () => {
    expect(servico.calcularValorMensal(60)).toBe(337.2);
    expect(buscar('engs703').valorMensal).toBe(449.6);
  });

  it('solicitar matrícula reserva uma vaga e marca a disciplina', () => {
    const disciplina = buscar('engs701');
    expect(servico.solicitarMatricula(disciplina)).toBe(true);
    expect(disciplina.vagas).toBe(34);
    expect(disciplina.solicitada).toBe(true);
    expect(servico.solicitarMatricula(disciplina)).toBe(false);
  });

  it('recusa disciplina sem vagas', () => {
    const disciplina = buscar('engs703');
    expect(servico.solicitarMatricula(disciplina)).toBe(false);
    expect(disciplina.solicitada).toBe(false);
  });

  it('resume as solicitações em quantidade, créditos e valor mensal', () => {
    servico.solicitarMatricula(buscar('engs701'));
    servico.solicitarMatricula(buscar('engs801'));
    expect(servico.resumoSolicitacoes()).toEqual({ quantidade: 2, creditos: 7, valorMensal: 786.8 });
  });
});

describe('AlunoService', () => {
  let servico;

  beforeEach(() => {
    servico = criarInjetor().get('AlunoService');
  });

  it('calcula o progresso do curso e a mensalidade atual', () => {
    expect(servico.percentualConcluido()).toBe(61);
    expect(servico.mensalidadeAtual()).toEqual({ valor: 1798.4, vencimento: '2026-12-10' });
  });

  it('valida o formato e o tamanho do atestado', () => {
    expect(servico.validarAtestado({ name: 'a.docx' })).toBe('formato');
    expect(servico.validarAtestado({ name: 'a.PNG', size: 6 * MB })).toBe('tamanho');
    expect(servico.validarAtestado({ name: 'a.png', size: 1 * MB })).toBeNull();
  });

  it('salvarContato altera o contato da mesma aluna', () => {
    const aluno = servico.obterAluno();
    const rascunho = servico.obterContato();
    rascunho.telefone = '(71) 91234-5678';
    expect(servico.contatoIgual(rascunho)).toBe(false);

    servico.salvarContato(rascunho);

    expect(servico.obterAluno()).toBe(aluno);
    expect(aluno.contato.telefone).toBe('(71) 91234-5678');
    expect(servico.contatoIgual(rascunho)).toBe(true);
  });

  it('novas solicitações entram no topo da mesma lista', () => {
    const solicitacoes = servico.obterSolicitacoes();
    servico.solicitarDocumento(servico.documentosDisponiveis()[1]);
    expect(servico.obterSolicitacoes()).toBe(solicitacoes);
    expect(solicitacoes).toHaveLength(4);
    expect(solicitacoes[0]).toMatchObject({ documento: 'Histórico escolar', situacao: 'Em análise' });
  });
});

describe('SecretariaService', () => {
  it('tem 6 perguntas frequentes e 5 prazos', () => {
    const servico = criarInjetor().get('SecretariaService');
    expect(servico.perguntasFrequentes()).toHaveLength(6);
    expect(servico.prazosAcademicos()).toHaveLength(5);
  });
});

describe('ToastService', () => {
  let servico;
  let $timeout;

  beforeEach(() => {
    const $injector = criarInjetor();
    servico = $injector.get('ToastService');
    $timeout = $injector.get('$timeout');
  });

  it('o toast sai sozinho aos 4.000 ms e é removido 150 ms depois', () => {
    servico.mostrar('sucesso', 'Dados salvos.');

    $timeout.flush(3999);
    expect(servico.fila).toHaveLength(1);
    expect(servico.fila[0].saindo).toBe(false);

    $timeout.flush(1);
    expect(servico.fila[0].saindo).toBe(true);

    $timeout.flush(150);
    expect(servico.fila).toHaveLength(0);
  });

  it('novos toasts entram no fim da fila', () => {
    servico.mostrar('sucesso', 'primeiro');
    servico.mostrar('erro', 'segundo');
    expect(servico.fila.map((toast) => toast.mensagem)).toEqual(['primeiro', 'segundo']);
  });

  it('fechar(id) cancela o temporizador original e remove após a saída', () => {
    const fila = servico.fila;
    const id = servico.mostrar('info', 'x');

    servico.fechar(id);
    expect(fila[0].saindo).toBe(true);

    $timeout.flush(150);
    expect(fila).toHaveLength(0);
    expect(servico.fila).toBe(fila);
    $timeout.verifyNoPendingTasks();
  });
});
