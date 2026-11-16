'use strict';

// ContaController: menu da conta na navbar (Meu perfil, Ajuda, Sair).
// No index.html: <header ng-controller="ContaController as conta">.
// Com "controller as", o template lê conta.nomeCurto e conta.opcoes, que são
// propriedades deste controlador (vm = this).
angular.module('portal.controladores').controller('ContaController', [
  'AlunoService', 'ToastService', '$window',
  function (AlunoService, ToastService, $window) {
    var vm = this;

    vm.nomeCurto = AlunoService.obterAluno().nomeCurto;

    // Navegação pela âncora comum (#perfil). $location e $anchorScroll não são
    // usados: o $location assumiria o hash da página e reescreveria #perfil
    // como #!#perfil, quebrando os links da navbar.
    function irParaSecao(id) {
      var documento = $window.document;
      $window.location.hash = id;
      // O foco vai para o título da seção, para o teclado continuar dali.
      documento.getElementById('titulo-' + id).focus({ preventScroll: true });
      // Se o hash já era o mesmo, o navegador não rola de novo; o scrollIntoView
      // garante a rolagem e respeita o scroll-margin-top da seção.
      documento.getElementById(id).scrollIntoView();
    }

    // Cada opção traz o próprio callback (acao), chamado pela diretiva menuSuspenso.
    vm.opcoes = [
      {
        rotulo: 'Meu perfil',
        acao: function () {
          irParaSecao('perfil');
        }
      },
      {
        rotulo: 'Ajuda',
        acao: function () {
          irParaSecao('ajuda');
        }
      },
      {
        rotulo: 'Sair',
        acao: function () {
          ToastService.mostrar('info', 'Saída simulada: este portal não tem login real.');
        }
      }
    ];
  }
]);
