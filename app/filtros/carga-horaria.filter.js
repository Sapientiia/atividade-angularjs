'use strict';

// Filtro próprio: mostra uma carga horária em horas, com o separador de milhar
// brasileiro. Uso no template: {{ 2190 | cargaHoraria }} -> "2.190 h".
// A fábrica do filtro roda uma vez; a função devolvida roda a cada digest.
angular.module('portal.filtros').filter('cargaHoraria', [function () {
  var numero = new Intl.NumberFormat('pt-BR');

  return function (horas) {
    if (horas === null || horas === undefined) {
      return '';
    }
    return numero.format(horas) + ' h';
  };
}]);
