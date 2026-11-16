'use strict';

// Diretiva <acordeao>: lista de perguntas que expandem e recolhem.
//
// Exemplo de uso:
//   <acordeao itens="ajuda.perguntas"></acordeao>
//
// Cada item é um objeto { titulo, conteudo }, em texto puro. Só um item fica
// aberto por vez: abrir outro fecha o anterior, e clicar no aberto o fecha.
angular.module('portal.componentes').directive('acordeao', [function () {
  return {
    restrict: 'E',
    scope: {
      itens: '<'  // < lista do pai; a diretiva lê e não altera
    },
    templateUrl: 'app/componentes/acordeao/acordeao.html',
    link: function (scope) {
      // Estado interno no $scope da diretiva: o índice do item aberto, ou null
      // quando todos estão fechados. Um único número garante "um aberto por vez".
      scope.indiceAberto = null;

      // Prefixo dos IDs que ligam cada botão ao seu painel (aria-controls e
      // aria-labelledby). O $id do scope evita colisão entre dois acordeões.
      scope.idBase = 'acordeao-' + scope.$id;

      scope.estaAberto = function (indice) {
        return scope.indiceAberto === indice;
      };

      scope.alternar = function (indice) {
        scope.indiceAberto = scope.estaAberto(indice) ? null : indice;
      };

      // $destroy: nada a limpar (sem listener fora do elemento e sem temporizador).
    }
  };
}]);
