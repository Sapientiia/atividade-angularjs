'use strict';

// Diretivas <abas> (contêiner) e <aba> (painel), usadas juntas:
//
//   <abas rotulo="Perfil do aluno">
//     <aba titulo="Dados pessoais"> ...formulário com ng-model... </aba>
//     <aba titulo="Histórico"> ... </aba>
//   </abas>
//
// Transclusão: o conteúdo escrito entre as tags continua ligado ao escopo de
// quem usa a diretiva (a seção Perfil), e não ao escopo isolado. Por isso o
// formulário dentro da aba enxerga perfil.rascunho.

// Contêiner: desenha a lista de abas e guarda qual está ativa.
angular.module('portal.componentes').directive('abas', [function () {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      rotulo: '@'   // @ aria-label da lista de abas (role="tablist")
    },
    templateUrl: 'app/componentes/abas/abas.html',
    // controller em vez de link: as diretivas <aba> pedem este controlador
    // (require: '^^abas') para se registrar no contêiner.
    controller: ['$scope', '$element', function ($scope, $element) {
      var proximoNumero = 0;

      // Estado no $scope da diretiva: os escopos das abas registradas e o
      // índice da aba ativa, a única fonte da verdade sobre a seleção.
      $scope.abas = [];
      $scope.indiceAtivo = 0;

      // Chamado por cada <aba> no próprio link. Os IDs ligam a aba ao painel
      // (aria-controls e aria-labelledby) e usam o $id para não colidir.
      this.adicionar = function (aba) {
        aba.idAba = 'abas-' + $scope.$id + '-aba-' + proximoNumero;
        aba.idPainel = 'abas-' + $scope.$id + '-painel-' + proximoNumero;
        proximoNumero++;
        $scope.abas.push(aba);
      };

      // Chamado no $destroy da <aba>: o índice ativo continua apontando para
      // uma aba que existe.
      this.remover = function (aba) {
        var indice = $scope.abas.indexOf(aba);
        if (indice === -1) {
          return;
        }
        $scope.abas.splice(indice, 1);
        if (indice < $scope.indiceAtivo || $scope.indiceAtivo >= $scope.abas.length) {
          $scope.indiceAtivo = Math.max(0, $scope.indiceAtivo - 1);
        }
      };

      this.estaAtiva = function (aba) {
        return $scope.abas.indexOf(aba) === $scope.indiceAtivo;
      };

      $scope.selecionar = function (indice) {
        $scope.indiceAtivo = indice;
      };

      // Teclado do padrão de abas (ativação automática): as setas trocam de
      // aba e já mostram o painel; Home e End vão à primeira e à última.
      $scope.aoTeclar = function (evento, indice) {
        var total = $scope.abas.length;
        var destino;

        switch (evento.key) {
          case 'ArrowRight':
            destino = (indice + 1) % total;          // depois da última, volta à primeira
            break;
          case 'ArrowLeft':
            destino = (indice - 1 + total) % total;  // antes da primeira, vai à última
            break;
          case 'Home':
            destino = 0;
            break;
          case 'End':
            destino = total - 1;
            break;
          default:
            return; // Tab, Enter e as demais teclas seguem o comportamento normal
        }

        evento.preventDefault();
        $scope.selecionar(destino);
        $element[0].querySelectorAll('[role="tab"]')[destino].focus();
      };
    }]
  };
}]);

// Painel: registra-se no contêiner e só aparece quando é a aba ativa.
angular.module('portal.componentes').directive('aba', [function () {
  return {
    restrict: 'E',
    require: '^^abas',   // ^^: procura o controlador de <abas> nos elementos acima
    transclude: true,
    scope: {
      titulo: '@'        // @ texto do botão da aba
    },
    templateUrl: 'app/componentes/abas/aba.html',
    link: function (scope, element, attrs, abasCtrl) {
      abasCtrl.adicionar(scope);

      scope.estaAtiva = function () {
        return abasCtrl.estaAtiva(scope);
      };

      scope.$on('$destroy', function () {
        abasCtrl.remover(scope);
      });
    }
  };
}]);
