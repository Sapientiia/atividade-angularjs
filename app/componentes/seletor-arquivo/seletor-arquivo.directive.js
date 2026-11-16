'use strict';

// Diretiva auxiliar seletor-arquivo (atributo): entrega ao controlador o
// arquivo escolhido num <input type="file">.
//
// Exemplo de uso:
//   <input type="file" seletor-arquivo arquivo="perfil.envio.arquivo"
//          on-selecionar="perfil.escolherArquivo(arquivo)">
//
// Ela existe porque o ng-model e o ng-change não funcionam em campo de arquivo.
// Não é um dos seis componentes: só segue o mesmo contrato (dado entra por <,
// evento sai por &), sem que o controlador precise ler o DOM.
angular.module('portal.componentes').directive('seletorArquivo', [function () {
  return {
    restrict: 'A',
    scope: {
      arquivo: '<?',      // < arquivo guardado no pai; quando vira null, o campo é limpo
      onSelecionar: '&'   // & evento: função do pai, chamada com { arquivo: ... }
    },
    link: function (scope, element) {
      // O "change" é um evento nativo, fora do AngularJS: o $apply roda o
      // digest para a tela refletir o arquivo escolhido.
      function aoMudar() {
        var arquivo = element[0].files[0] || null;
        scope.$apply(function () {
          scope.onSelecionar({ arquivo: arquivo });
        });
      }

      element.on('change', aoMudar);

      // Arquivo recusado ou envio concluído: o pai zera o binding e o campo
      // nativo também é limpo (o mesmo arquivo pode ser escolhido de novo).
      scope.$watch('arquivo', function (arquivo) {
        if (!arquivo) {
          element[0].value = '';
        }
      });

      // Quem registra o listener, remove.
      scope.$on('$destroy', function () {
        element.off('change', aoMudar);
      });
    }
  };
}]);
