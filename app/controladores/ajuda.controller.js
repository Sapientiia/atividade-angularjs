'use strict';

// AjudaController: seção Ajuda da secretaria.
// No index.html: <section id="ajuda" ng-controller="AjudaController as ajuda">.
// Só entrega as perguntas frequentes do SecretariaService ao <acordeao>,
// que cuida sozinho de abrir e fechar cada item.
angular.module('portal.controladores').controller('AjudaController', [
  'SecretariaService',
  function (SecretariaService) {
    var vm = this;

    vm.perguntas = SecretariaService.perguntasFrequentes();
  }
]);
