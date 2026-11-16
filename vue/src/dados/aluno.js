// Dados da aluna (mesmos da versão AngularJS): identificação, contato editável,
// histórico, documentos disponíveis e solicitações já feitas.
export const aluno = {
  nome: 'Ana Beatriz Santos Lima',
  nomeCurto: 'Ana Beatriz',
  matricula: '202410458',
  curso: 'Engenharia de Software (bacharelado)',
  turno: 'Noturno',
  ingresso: '2024.1',
  semestreAtual: '6º semestre',
  periodoAtual: '2026.2',
  cargaHorariaCumprida: 2190,
  cargaHorariaTotal: 3600,
  coeficienteRendimento: 7.6,
  dataNascimento: '2005-03-14',
  emailInstitucional: 'ana.lima@aluno.itapua.edu.br',
  contato: {
    emailPessoal: 'anabeatriz.lima@email.com',
    telefone: '(71) 98765-4321',
    cep: '41600-000',
    endereco: 'Rua das Gaivotas, 120, apto 302',
    bairro: 'Itapuã',
    cidadeUf: 'Salvador/BA'
  }
};

// Notas são números; null indica disciplina em curso (o formatador nota mostra "—").
export const historico = [
  { periodo: '2026.2', codigo: 'engs601', nome: 'Desenvolvimento Web Front-end', cargaHoraria: 80, nota: null, frequencia: 92, situacao: 'Cursando' },
  { periodo: '2026.2', codigo: 'engs602', nome: 'Verificação e Validação de Software', cargaHoraria: 60, nota: null, frequencia: 100, situacao: 'Cursando' },
  { periodo: '2026.2', codigo: 'engs603', nome: 'Gerência de Projetos de Software', cargaHoraria: 60, nota: null, frequencia: 88, situacao: 'Cursando' },
  { periodo: '2026.2', codigo: 'engs604', nome: 'Sistemas Distribuídos', cargaHoraria: 60, nota: null, frequencia: 95, situacao: 'Cursando' },
  { periodo: '2026.2', codigo: 'engs605', nome: 'Segurança da Informação', cargaHoraria: 60, nota: null, frequencia: 90, situacao: 'Cursando' },
  { periodo: '2026.1', codigo: 'engs501', nome: 'Engenharia de Requisitos', cargaHoraria: 60, nota: 8.2, frequencia: 94, situacao: 'Aprovado' },
  { periodo: '2026.1', codigo: 'engs502', nome: 'Arquitetura de Software', cargaHoraria: 80, nota: 7.5, frequencia: 88, situacao: 'Aprovado' },
  { periodo: '2026.1', codigo: 'engs503', nome: 'Banco de Dados II', cargaHoraria: 60, nota: 4.8, frequencia: 81, situacao: 'Reprovado' },
  { periodo: '2026.1', codigo: 'engs504', nome: 'Interação Humano-Computador', cargaHoraria: 60, nota: 8.9, frequencia: 97, situacao: 'Aprovado' },
  { periodo: '2026.1', codigo: 'engs505', nome: 'Probabilidade e Estatística', cargaHoraria: 60, nota: 6.4, frequencia: 90, situacao: 'Aprovado' }
];

export const documentos = [
  { nome: 'Declaração de matrícula', prazo: 'Imediato', situacaoAoSolicitar: 'Emitido' },
  { nome: 'Histórico escolar', prazo: 'Até 2 dias úteis', situacaoAoSolicitar: 'Em análise' },
  { nome: 'Declaração de vínculo para estágio', prazo: 'Até 3 dias úteis', situacaoAoSolicitar: 'Em análise' },
  { nome: 'Ementas das disciplinas cursadas', prazo: 'Até 5 dias úteis', situacaoAoSolicitar: 'Em análise' }
];

// Datas em texto 'yyyy-MM-dd', exibidas com o formatador formatarData.
export const solicitacoes = [
  { documento: 'Atestado médico', data: '2026-09-22', situacao: 'Recebido' },
  { documento: 'Declaração de matrícula — 2026.2', data: '2026-08-05', situacao: 'Emitido' },
  { documento: 'Histórico escolar', data: '2026-03-12', situacao: 'Emitido' }
];
