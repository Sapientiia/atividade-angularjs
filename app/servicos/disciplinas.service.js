'use strict';

// DisciplinasService: catálogo de disciplinas ofertadas em 2027.1 e as regras
// de crédito, valor mensal e solicitação de matrícula.
//
// Receita .factory(): a função roda uma única vez e o objeto que ela RETORNA
// é o serviço. Todos os controladores recebem essa mesma instância, por isso
// uma matrícula solicitada no catálogo aparece em qualquer parte da página.
angular.module('portal.servicos').factory('DisciplinasService', [function () {
  var HORAS_POR_CREDITO = 20;
  var VALOR_CREDITO_EM_CENTAVOS = 11240; // R$ 112,40

  function calcularCreditos(cargaHoraria) {
    return cargaHoraria / HORAS_POR_CREDITO;
  }

  // O cálculo é feito em centavos: 3 * 112.4 dá 337.20000000000005 em ponto
  // flutuante, enquanto 3 * 11240 / 100 dá exatamente 337.2.
  function calcularValorMensal(cargaHoraria) {
    return calcularCreditos(cargaHoraria) * VALOR_CREDITO_EM_CENTAVOS / 100;
  }

  function criarDisciplina(codigo, nome, semestre, cargaHoraria, turno, vagas) {
    return {
      codigo: codigo, // em minúsculas; a tela mostra com o filtro uppercase
      nome: nome,
      semestre: semestre,
      cargaHoraria: cargaHoraria,
      turno: turno,
      vagas: vagas,
      valorMensal: calcularValorMensal(cargaHoraria),
      solicitada: false
    };
  }

  var disciplinas = [
    criarDisciplina('engs503', 'Banco de Dados II', '5º', 60, 'Noturno', 12),
    criarDisciplina('engs701', 'Qualidade de Software', '7º', 60, 'Noturno', 35),
    criarDisciplina('engs702', 'DevOps e Integração Contínua', '7º', 60, 'Noturno', 28),
    criarDisciplina('engs703', 'Desenvolvimento para Dispositivos Móveis', '7º', 80, 'Noturno', 0),
    criarDisciplina('engs704', 'Empreendedorismo em Software', '7º', 40, 'Noturno', 40),
    criarDisciplina('engs705', 'Trabalho de Conclusão de Curso I', '7º', 40, 'Noturno', 30),
    criarDisciplina('engs801', 'Trabalho de Conclusão de Curso II', '8º', 80, 'Noturno', 30),
    criarDisciplina('engs802', 'Manutenção e Evolução de Software', '8º', 60, 'Noturno', 22),
    criarDisciplina('engs803', 'Ética e Legislação em Computação', '8º', 40, 'EAD', 60),
    criarDisciplina('engs804', 'Governança de TI', '8º', 60, 'Noturno', 18),
    criarDisciplina('engs805', 'Mineração de Dados', '8º', 60, 'Noturno', 5),
    criarDisciplina('opt101', 'Libras', 'Optativa', 40, 'EAD', 50),
    criarDisciplina('opt102', 'Computação Gráfica', 'Optativa', 60, 'Matutino', 15),
    criarDisciplina('opt103', 'Desenvolvimento de Jogos Digitais', 'Optativa', 60, 'Noturno', 0),
    criarDisciplina('opt104', 'Internet das Coisas', 'Optativa', 60, 'Noturno', 9),
    criarDisciplina('opt105', 'Programação Funcional', 'Optativa', 60, 'Noturno', 20)
  ];

  // Devolve sempre o mesmo array. Quem o recebe guarda a referência, por isso
  // o serviço altera as disciplinas no lugar e nunca troca o array por outro.
  function listar() {
    return disciplinas;
  }

  function solicitarMatricula(disciplina) {
    if (disciplina.solicitada || disciplina.vagas === 0) {
      return false;
    }
    disciplina.solicitada = true;
    disciplina.vagas -= 1;
    return true;
  }

  // Soma a carga horária das disciplinas solicitadas e calcula créditos e valor
  // sobre o total, para que o resultado continue exato em centavos.
  function resumoSolicitacoes() {
    var quantidade = 0;
    var horas = 0;

    disciplinas.forEach(function (disciplina) {
      if (disciplina.solicitada) {
        quantidade += 1;
        horas += disciplina.cargaHoraria;
      }
    });

    return {
      quantidade: quantidade,
      creditos: calcularCreditos(horas),
      valorMensal: calcularValorMensal(horas)
    };
  }

  return {
    listar: listar,
    calcularCreditos: calcularCreditos,
    calcularValorMensal: calcularValorMensal,
    solicitarMatricula: solicitarMatricula,
    resumoSolicitacoes: resumoSolicitacoes
  };
}]);
