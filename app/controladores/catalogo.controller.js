'use strict';

// CatalogoController: seção Disciplinas (busca, filtro de semestre, paginação
// e solicitação de matrícula).
// No index.html: <section id="disciplinas" ng-controller="CatalogoController as catalogo">.
//
// O $filter dá acesso, no JavaScript, aos mesmos filtros usados no template.
// O filter e o orderBy ficam aqui, e não no template, porque o controlador
// precisa saber quantas disciplinas sobraram para calcular o total de páginas.
angular.module('portal.controladores').controller('CatalogoController', [
  'DisciplinasService', 'ToastService', '$filter',
  function (DisciplinasService, ToastService, $filter) {
    var vm = this;

    // O valor de cada opção é comparado com o campo "semestre" da disciplina;
    // null em "Todos os semestres" desliga o filtro.
    vm.opcoesSemestre = [
      { rotulo: 'Todos os semestres', valor: null },
      { rotulo: '5º semestre', valor: '5º' },
      { rotulo: '7º semestre', valor: '7º' },
      { rotulo: '8º semestre', valor: '8º' },
      { rotulo: 'Optativas', valor: 'Optativa' }
    ];

    vm.termo = '';                        // ligado ao campo de busca por ng-model
    vm.semestre = vm.opcoesSemestre[0];   // opção marcada no menu de filtro
    vm.pagina = 1;
    vm.porPagina = 5;
    vm.filtradas = [];
    vm.totalPaginas = 0;
    vm.resumo = DisciplinasService.resumoSolicitacoes();

    // A busca olha só o código e o nome, como diz o placeholder "Código ou nome".
    // Um filtro de texto puro também acharia "Noturno" ou o número de vagas.
    function correspondeABusca(disciplina) {
      var termo = (vm.termo || '').toLowerCase();
      return disciplina.codigo.indexOf(termo) !== -1 ||
        disciplina.nome.toLowerCase().indexOf(termo) !== -1;
    }

    // Recalcula a lista sempre que a busca ou o semestre mudam.
    function atualizarLista() {
      var lista = DisciplinasService.listar();
      if (vm.semestre.valor) {
        lista = $filter('filter')(lista, { semestre: vm.semestre.valor }, true); // true = comparação exata
      }
      lista = $filter('filter')(lista, correspondeABusca);                       // código ou nome
      vm.filtradas = $filter('orderBy')(lista, 'codigo');
      vm.totalPaginas = Math.ceil(vm.filtradas.length / vm.porPagina);
    }

    // Chamado pelo ng-change do campo de busca, a cada tecla.
    vm.aoBuscar = function () {
      vm.pagina = 1;
      atualizarLista();
    };

    // Callback geral do menu suspenso: on-selecionar="catalogo.filtrarPorSemestre(opcao)".
    vm.filtrarPorSemestre = function (opcao) {
      vm.semestre = opcao;
      vm.pagina = 1;
      atualizarLista();
    };

    // Callback da paginação: on-mudar-pagina="catalogo.irPara(pagina)".
    // A diretiva só avisa; é aqui que a página muda de fato.
    vm.irPara = function (pagina) {
      vm.pagina = pagina;
    };

    // Posição da primeira disciplina da página, usada pelo limitTo do template.
    vm.inicioDaPagina = function () {
      return (vm.pagina - 1) * vm.porPagina;
    };

    vm.solicitar = function (disciplina) {
      if (DisciplinasService.solicitarMatricula(disciplina)) {
        vm.resumo = DisciplinasService.resumoSolicitacoes();
        ToastService.mostrar('sucesso',
          'Matrícula solicitada: ' + disciplina.codigo.toUpperCase() + ' – ' + disciplina.nome + '.');
      }
    };

    vm.rotuloDoBotao = function (disciplina) {
      if (disciplina.solicitada) {
        return 'Solicitada';
      }
      if (disciplina.vagas === 0) {
        return 'Sem vagas';
      }
      return 'Solicitar matrícula';
    };

    atualizarLista();
  }
]);
