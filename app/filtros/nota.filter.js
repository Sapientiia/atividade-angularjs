'use strict';

// Filtro próprio para notas: sempre com uma casa decimal e vírgula
// ({{ 8.2 | nota }} -> "8,2"). Disciplina em curso ainda não tem nota
// (null nos dados) e aparece como travessão.
angular.module('portal.filtros').filter('nota', [function () {
  var decimal = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  return function (valor) {
    if (valor === null || valor === undefined) {
      return '—';
    }
    return decimal.format(valor);
  };
}]);
