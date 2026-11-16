'use strict';

// AlunoService: dados da aluna, histórico, contato editável, documentos e
// envio de atestado.
//
// Injeção de dependência: o AngularJS entrega o DisciplinasService (um serviço
// usado dentro de outro, para calcular a mensalidade) e o $filter (para usar o
// filtro date fora do template e gerar a data de hoje).
angular.module('portal.servicos').factory('AlunoService', [
  'DisciplinasService', '$filter',
  function (DisciplinasService, $filter) {
    var EXTENSOES_ACEITAS = ['pdf', 'jpg', 'jpeg', 'png'];
    var TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5 MB em bytes

    var aluno = {
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

    // Notas são números; null indica disciplina em curso (o filtro nota mostra "—").
    var historico = [
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

    var documentos = [
      { nome: 'Declaração de matrícula', prazo: 'Imediato', situacaoAoSolicitar: 'Emitido' },
      { nome: 'Histórico escolar', prazo: 'Até 2 dias úteis', situacaoAoSolicitar: 'Em análise' },
      { nome: 'Declaração de vínculo para estágio', prazo: 'Até 3 dias úteis', situacaoAoSolicitar: 'Em análise' },
      { nome: 'Ementas das disciplinas cursadas', prazo: 'Até 5 dias úteis', situacaoAoSolicitar: 'Em análise' }
    ];

    // Datas em texto 'yyyy-MM-dd': o filtro date as exibe e o orderBy as ordena.
    var solicitacoes = [
      { documento: 'Declaração de matrícula — 2026.2', data: '2026-08-05', situacao: 'Emitido' },
      { documento: 'Atestado médico', data: '2026-09-22', situacao: 'Recebido' },
      { documento: 'Histórico escolar', data: '2026-03-12', situacao: 'Emitido' }
    ];

    function hoje() {
      return $filter('date')(new Date(), 'yyyy-MM-dd');
    }

    function obterAluno() {
      return aluno;
    }

    function percentualConcluido() {
      return Math.round(aluno.cargaHorariaCumprida / aluno.cargaHorariaTotal * 100);
    }

    // Mensalidade do período atual: soma a carga horária das disciplinas
    // "Cursando" e usa a regra de valor do DisciplinasService (320 h = R$ 1.798,40).
    function mensalidadeAtual() {
      var horas = 0;
      historico.forEach(function (item) {
        if (item.situacao === 'Cursando') {
          horas += item.cargaHoraria;
        }
      });
      return {
        valor: DisciplinasService.calcularValorMensal(horas),
        vencimento: '2026-12-10'
      };
    }

    function obterHistorico() {
      return historico;
    }

    // O formulário edita uma cópia (rascunho); o contato salvo só muda em salvarContato.
    function obterContato() {
      return angular.copy(aluno.contato);
    }

    function contatoIgual(rascunho) {
      return angular.equals(rascunho, aluno.contato);
    }

    // Troca só a propriedade contato: o objeto aluno continua o mesmo, e quem
    // guardou a referência dele (o Painel, por exemplo) já vê o contato novo.
    function salvarContato(rascunho) {
      aluno.contato = angular.copy(rascunho);
    }

    function documentosDisponiveis() {
      return documentos;
    }

    function obterSolicitacoes() {
      return solicitacoes;
    }

    // unshift: a solicitação nova entra no topo do mesmo array.
    function solicitarDocumento(documento) {
      var item = { documento: documento.nome, data: hoje(), situacao: documento.situacaoAoSolicitar };
      solicitacoes.unshift(item);
      return item;
    }

    // Devolve null quando o arquivo é aceito, ou o motivo da recusa.
    function validarAtestado(arquivo) {
      var extensao = arquivo && arquivo.name ? arquivo.name.split('.').pop().toLowerCase() : '';
      if (EXTENSOES_ACEITAS.indexOf(extensao) === -1) {
        return 'formato';
      }
      if (arquivo.size > TAMANHO_MAXIMO) {
        return 'tamanho';
      }
      return null;
    }

    function registrarAtestado() {
      var item = { documento: 'Atestado médico', data: hoje(), situacao: 'Recebido' };
      solicitacoes.unshift(item);
      return item;
    }

    return {
      obterAluno: obterAluno,
      percentualConcluido: percentualConcluido,
      mensalidadeAtual: mensalidadeAtual,
      obterHistorico: obterHistorico,
      obterContato: obterContato,
      contatoIgual: contatoIgual,
      salvarContato: salvarContato,
      documentosDisponiveis: documentosDisponiveis,
      obterSolicitacoes: obterSolicitacoes,
      solicitarDocumento: solicitarDocumento,
      validarAtestado: validarAtestado,
      registrarAtestado: registrarAtestado
    };
  }
]);
