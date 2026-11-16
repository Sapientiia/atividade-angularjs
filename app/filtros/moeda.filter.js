'use strict';

// Filtro próprio para valores em reais: {{ 1798.4 | moeda }} -> "R$ 1.798,40".
// O filtro nativo currency não é usado porque, sem o arquivo de locale do
// AngularJS, ele formata no padrão americano ($1,798.40).
angular.module('portal.filtros').filter('moeda', [function () {
  var real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return function (valor) {
    if (valor === null || valor === undefined) {
      return '';
    }
    return real.format(valor);
  };
}]);
