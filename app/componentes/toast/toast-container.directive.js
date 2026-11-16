'use strict';

// Diretiva <toast-container>: exibe a fila de notificações do ToastService.
// Uso: <toast-container></toast-container>, uma única vez na página.
//
// scope: {} cria um escopo isolado sem bindings: o template não enxerga os
// controladores da página. O conteúdo vem do serviço, que guarda a fila e os
// temporizadores; a diretiva só mostra a fila e repassa o clique em "fechar".
angular.module('portal.componentes').directive('toastContainer', ['ToastService', function (ToastService) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'app/componentes/toast/toast-container.html',
    link: function (scope) {
      // Mesma referência do array do serviço: quando o serviço faz push ou
      // splice, o ng-repeat do template percebe no próximo digest.
      scope.toasts = ToastService.fila;

      scope.fechar = function (id) {
        ToastService.fechar(id);
      };
    }
  };
}]);
