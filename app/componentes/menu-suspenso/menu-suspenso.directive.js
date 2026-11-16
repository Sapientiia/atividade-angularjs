'use strict';

// Diretiva <menu-suspenso>: botão que mostra uma lista de opções clicáveis.
//
// Exemplos de uso:
//   <menu-suspenso rotulo="{{ conta.nomeCurto }}" opcoes="conta.opcoes"></menu-suspenso>
//   <menu-suspenso rotulo="Semestre: {{ ... }}" opcoes="..." selecionada="..."
//                  on-selecionar="catalogo.filtrarPorSemestre(opcao)"></menu-suspenso>
//
// Cada opção é um objeto { rotulo, acao? }. A ação pode vir na própria opção
// (callback por opção) ou no atributo on-selecionar (callback geral).
angular.module('portal.componentes').directive('menuSuspenso', ['$document', '$timeout', function ($document, $timeout) {
  return {
    restrict: 'E',
    // Escopo isolado: tudo o que a diretiva usa entra pelos bindings abaixo.
    scope: {
      rotulo: '@',        // @ texto: lê o atributo já interpolado ({{ }})
      opcoes: '<',        // < dado de mão única: a diretiva lê, mas não altera, a lista do pai
      selecionada: '<?',  // ? opcional: só o filtro de semestre marca a opção vigente
      onSelecionar: '&'   // & evento: função do pai, chamada com { opcao: ... }
    },
    templateUrl: 'app/componentes/menu-suspenso/menu-suspenso.html',
    link: function (scope, element) {
      var focoPendente = null;

      // Estado interno no $scope da diretiva. O $id deixa os IDs únicos
      // mesmo com dois menus na mesma página.
      scope.aberto = false;
      scope.idBase = 'menu-' + scope.$id;

      function botao() {
        return element[0].querySelector('.menu-suspenso__botao');
      }

      function itens() {
        return element[0].querySelectorAll('.menu-suspenso__item');
      }

      function focarItem(indice) {
        var lista = itens();
        if (lista[indice]) {
          lista[indice].focus();
        }
      }

      scope.abrir = function (indiceFoco) {
        scope.aberto = true;
        // A lista ainda está com ng-hide (display: none) e elemento oculto não
        // recebe foco. O $timeout espera o fim do digest, que mostra a lista.
        // O "false" evita um digest extra: o foco não muda nada no $scope.
        $timeout.cancel(focoPendente);
        focoPendente = $timeout(function () {
          focarItem(indiceFoco);
        }, 0, false);
      };

      scope.fechar = function (devolverFoco) {
        scope.aberto = false;
        $timeout.cancel(focoPendente);
        if (devolverFoco) {
          botao().focus();
        }
      };

      scope.alternar = function () {
        if (scope.aberto) {
          scope.fechar(false);
        } else {
          scope.abrir(0);
        }
      };

      // Fecha e devolve o foco ao botão ANTES dos callbacks; assim a ação da
      // opção ainda pode mandar o foco para outro lugar (ex.: "Meu perfil").
      scope.selecionar = function (opcao) {
        scope.fechar(true);
        if (angular.isFunction(opcao.acao)) {
          opcao.acao(opcao);
        }
        // Callback &: o objeto passado define as variáveis disponíveis na
        // expressão do pai. Sem o atributo, o AngularJS entrega uma função vazia.
        scope.onSelecionar({ opcao: opcao });
      };

      // Enter e Espaço não precisam de tratamento: no <button> eles já
      // disparam o clique, que chama alternar().
      scope.aoTeclarNoBotao = function (evento) {
        if (evento.key === 'ArrowDown') {
          evento.preventDefault();
          scope.abrir(0);
        } else if (evento.key === 'ArrowUp') {
          evento.preventDefault();
          scope.abrir(scope.opcoes.length - 1);
        } else if (evento.key === 'Escape' && scope.aberto) {
          scope.fechar(true);
        }
      };

      scope.aoTeclarNoItem = function (evento, indice) {
        var total = scope.opcoes.length;

        switch (evento.key) {
          case 'ArrowDown':
            evento.preventDefault();
            focarItem((indice + 1) % total);
            break;
          case 'ArrowUp':
            evento.preventDefault();
            focarItem((indice - 1 + total) % total);
            break;
          case 'Home':
            evento.preventDefault();
            focarItem(0);
            break;
          case 'End':
            evento.preventDefault();
            focarItem(total - 1);
            break;
          case 'Escape':
            evento.preventDefault();
            scope.fechar(true);
            break;
          case 'Tab':
            // Sem preventDefault: a tabulação segue a partir do botão.
            scope.fechar(true);
            break;
        }
      };

      // Clique fora: o listener fica no document, fora do AngularJS. Por ser
      // um evento nativo, a mudança de estado precisa de scope.$apply para
      // rodar o digest e esconder a lista.
      function aoClicarFora(evento) {
        if (!scope.aberto || element[0].contains(evento.target)) {
          return;
        }
        scope.$apply(function () {
          scope.fechar(false);
        });
      }

      $document.on('click', aoClicarFora);

      // Limpeza: quem registra listener fora do próprio elemento remove no $destroy.
      scope.$on('$destroy', function () {
        $document.off('click', aoClicarFora);
        $timeout.cancel(focoPendente);
      });
    }
  };
}]);
