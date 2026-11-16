import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  carregarCatalogo, calcularValorMensal, solicitarMatricula, resumoSolicitacoes
} from '../src/servicos/disciplinas.js';
import {
  carregarAluno, percentualConcluido, mensalidadeAtual, validarContato, contatoIgual,
  validarAtestado, novaSolicitacao
} from '../src/servicos/aluno.js';
import { toast } from '../src/servicos/toast.js';

const MB = 1024 * 1024;

describe('servicos/disciplinas.js', () => {
  let catalogo;

  beforeEach(() => {
    catalogo = carregarCatalogo();
  });

  function buscar(codigo) {
    return catalogo.find((disciplina) => disciplina.codigo === codigo);
  }

  it('carrega as 16 disciplinas ofertadas', () => {
    expect(catalogo).toHaveLength(16);
  });

  it('calcula o valor mensal em centavos, sem erro de ponto flutuante', () => {
    expect(calcularValorMensal(60)).toBe(337.2);
    expect(buscar('engs703').valorMensal).toBe(449.6);
  });

  it('solicitar matrícula reserva uma vaga e marca a disciplina', () => {
    const disciplina = buscar('engs701');
    expect(solicitarMatricula(disciplina)).toBe(true);
    expect(disciplina.vagas).toBe(34);
    expect(disciplina.solicitada).toBe(true);
    expect(solicitarMatricula(disciplina)).toBe(false);
  });

  it('recusa disciplina sem vagas', () => {
    const disciplina = buscar('engs703');
    expect(solicitarMatricula(disciplina)).toBe(false);
    expect(disciplina.solicitada).toBe(false);
  });

  it('resume as solicitações: ENGS701 + ENGS801 dão 7 créditos e R$ 786,80', () => {
    solicitarMatricula(buscar('engs701'));
    solicitarMatricula(buscar('engs801'));
    expect(resumoSolicitacoes(catalogo)).toEqual({ quantidade: 2, creditos: 7, valorMensal: 786.8 });
  });

  it('carregarCatalogo devolve uma cópia nova a cada chamada', () => {
    solicitarMatricula(buscar('engs701'));
    const outraCopia = carregarCatalogo();
    expect(outraCopia).not.toBe(catalogo);
    expect(outraCopia.find((d) => d.codigo === 'engs701').vagas).toBe(35);
  });
});

describe('servicos/aluno.js', () => {
  it('calcula o percentual concluído (61%) e a mensalidade atual (R$ 1.798,40)', () => {
    expect(percentualConcluido(carregarAluno())).toBe(61);
    expect(mensalidadeAtual().valor).toBe(1798.4);
    expect(mensalidadeAtual().vencimento).toBe('2026-12-10');
  });

  it('carregarAluno devolve uma cópia nova a cada chamada', () => {
    const aluno = carregarAluno();
    aluno.contato.telefone = '';
    expect(carregarAluno().contato.telefone).toBe('(71) 98765-4321');
  });

  it('validarAtestado recusa formato e tamanho e aceita PNG de 1 MB', () => {
    expect(validarAtestado({ name: 'a.docx', size: MB })).toBe('formato');
    expect(validarAtestado({ name: 'a.PNG', size: 6 * MB })).toBe('tamanho');
    expect(validarAtestado({ name: 'a.png', size: MB })).toBe(null);
    expect(validarAtestado(null)).toBe('formato');
  });

  it('validarContato devolve a mensagem de cada campo inválido', () => {
    const contato = carregarAluno().contato;
    expect(validarContato(contato)).toEqual({});
    expect(validarContato({ ...contato, emailPessoal: 'ana@' })).toEqual({ emailPessoal: 'Informe um e-mail válido.' });
    expect(validarContato({ ...contato, emailPessoal: '' })).toEqual({ emailPessoal: 'Informe um e-mail válido.' });
    expect(validarContato({ ...contato, telefone: '  ' })).toEqual({ telefone: 'Informe o telefone.' });
    expect(validarContato({ ...contato, cep: '41600000' })).toEqual({ cep: 'Use o formato 00000-000.' });
    expect(validarContato({ ...contato, cep: '' })).toEqual({});
  });

  it('contatoIgual compara o rascunho com o contato salvo', () => {
    const contato = carregarAluno().contato;
    expect(contatoIgual({ ...contato }, contato)).toBe(true);
    expect(contatoIgual({ ...contato, bairro: 'Stella Maris' }, contato)).toBe(false);
  });

  it('novaSolicitacao usa a data de hoje no horário local', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 15, 23, 30)); // 15/11/2026, 23h30 local
    expect(novaSolicitacao('Atestado médico', 'Recebido'))
      .toEqual({ documento: 'Atestado médico', data: '2026-11-15', situacao: 'Recebido' });
    vi.useRealTimers();
  });
});

describe('servicos/toast.js', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    toast.estado.fila.splice(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('marca "saindo" aos 4.000 ms e remove o toast 150 ms depois', () => {
    toast.mostrar('sucesso', 'Dados salvos.');
    expect(toast.estado.fila).toHaveLength(1);

    vi.advanceTimersByTime(3999);
    expect(toast.estado.fila[0].saindo).toBe(false);

    vi.advanceTimersByTime(1);
    expect(toast.estado.fila[0].saindo).toBe(true);

    vi.advanceTimersByTime(150);
    expect(toast.estado.fila).toHaveLength(0);
  });

  it('fechar remove o toast após 150 ms e cancela o temporizador original', () => {
    const id = toast.mostrar('erro', 'Erro: formato inválido. Use PDF, JPG ou PNG.');
    toast.fechar(id);
    expect(toast.estado.fila[0].saindo).toBe(true);

    vi.advanceTimersByTime(150);
    expect(toast.estado.fila).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(0);
  });
});
