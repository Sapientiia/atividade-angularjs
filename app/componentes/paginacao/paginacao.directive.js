'use strict';

// Diretiva <paginacao>: botões "Anterior", um por página e "Próxima".
//
// Exemplo de uso:
//   <paginacao total-paginas="catalogo.totalPaginas" pagina-atual="catalogo.pagina"
//              on-mudar-pagina="catalogo.irPara(pagina)" rotulo="Paginação do catálogo"></paginacao>
//
// A diretiva só mostra a página atual e AVISA o pai quando a aluna escolhe
// outra. Quem muda a página é o controlador da seção (fluxo de mão única).
angular.module('portal.componentes').directive('paginacao', [function () {
  return {
    restrict: 'E',
    scope: {
      totalPaginas: '<',   // < quantidade de páginas, calculada pelo pai
      paginaAtual: '<',    // < página exibida agora (começa em 1)
      onMudarPagina: '&',  // & evento: função do pai, chamada com { pagina: n }
      rotulo: '@'          // @ texto do aria-label do <nav>
    },
    templateUrl: 'app/componentes/paginacao/paginacao.html',
    link: function (scope, element) {
      // Estado interno: a lista [1, 2, ..., total] que o ng-repeat desenha.
      scope.paginas = [];

      // O $watch reage quando o pai muda o total (busca ou filtro de semestre).
      scope.$watch('totalPaginas', function (total) {
        scope.paginas = [];
        for (var n = 1; n <= total; n++) {
          scope.paginas.push(n);
        }
      });

      // Callback &: a chave "pagina" vira a variável usada na expressão do pai,
      // catalogo.irPara(pagina). Página fora do intervalo ou igual à atual é ignorada.
      scope.ir = function (pagina) {
        if (pagina < 1 || pagina > scope.totalPaginas || pagina === scope.paginaAtual) {
          return;
        }
        scope.onMudarPagina({ pagina: pagina });
      };

      // Ao chegar à primeira ou à última página, o botão usado fica desabilitado
      // e perderia o foco. O foco passa para o botão da página de destino, que
      // continua na tela (track by p no template).
      function focarPagina(pagina) {
        var botoes = element[0].querySelectorAll('.paginacao__botao');
        botoes[pagina].focus(); // índice 0 é "Anterior"; o índice n é a página n
      }

      scope.anterior = function () {
        var destino = scope.paginaAtual - 1;
        scope.ir(destino);
        if (destino === 1) {
          focarPagina(destino);
        }
      };

      scope.proxima = function () {
        var destino = scope.paginaAtual + 1;
        scope.ir(destino);
        if (destino === scope.totalPaginas) {
          focarPagina(destino);
        }
      };

      // $destroy: nada a limpar. O $watch é removido junto com o próprio scope.
    }
  };
}]);
