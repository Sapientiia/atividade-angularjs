'use strict';

// PainelController: resumo da aluna (progresso, mensalidade, prazos e contato).
// No index.html: <section id="painel" ng-controller="PainelController as painel">.
//
// "aluno" é a mesma referência guardada no AlunoService. Quando o Perfil salva
// um contato novo, o cartão Contato mostra o dado novo sem código extra aqui.
angular.module('portal.controladores').controller('PainelController', [
  'AlunoService', 'SecretariaService',
  function (AlunoService, SecretariaService) {
    var vm = this;

    vm.aluno = AlunoService.obterAluno();
    vm.percentual = AlunoService.percentualConcluido();
    vm.mensalidade = AlunoService.mensalidadeAtual();
    // Vem fora de ordem do serviço; o template ordena com o filtro orderBy.
    vm.prazos = SecretariaService.prazosAcademicos();
  }
]);
