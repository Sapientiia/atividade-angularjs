'use strict';

// Diretiva <barra-progresso>: trilho com preenchimento proporcional ao valor.
//
// Exemplos de uso:
//   <barra-progresso valor="painel.percentual" rotulo="Progresso do curso" mostrar-percentual="true"></barra-progresso>
//   <barra-progresso valor="perfil.envio.progresso" rotulo="Envio do atestado" mostrar-percentual="true"></barra-progresso>
angular.module('portal.componentes').directive('barraProgresso', [function () {
  return {
    restrict: 'E',
    scope: {
      valor: '<',               // < número de 0 a 100 vindo do pai
      rotulo: '@',              // @ nome acessível da barra (aria-label)
      mostrarPercentual: '<?'   // ? opcional: true exibe o número ao lado da barra
    },
    templateUrl: 'app/componentes/barra-progresso/barra-progresso.html',
    link: function (scope) {
      scope.percentual = 0;

      // O $watch roda de novo a cada mudança do binding. No envio do atestado
      // o pai sobe o valor de 5 em 5, e a largura acompanha cada passo.
      scope.$watch('valor', function (valor) {
        var numero = Number(valor) || 0;                 // texto ou vazio vira número (ou 0)
        numero = Math.min(100, Math.max(0, numero));     // limita ao intervalo 0–100
        scope.percentual = Math.round(numero);           // inteiro, para o aria-valuenow
      });

      // $destroy: nada a limpar.
    }
  };
}]);
