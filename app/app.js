'use strict';

// Módulo principal do Portal do Aluno.
// Ele não registra nada sozinho: só declara, no array de dependências, os quatro
// módulos que orquestra. Cada camada (filtros, serviços, componentes e
// controladores) cria o próprio módulo no seu arquivo *.module.js, e o
// AngularJS junta tudo no bootstrap feito pelo ng-app="portal" do index.html.
//
// Convenção usada em toda a pasta app/: as funções injetáveis são escritas com
// anotação em array (['Servico', function (Servico) {...}]). O index.html liga
// o ng-strict-di, que recusa funções sem essa anotação, porque a injeção pelo
// nome dos parâmetros deixaria de funcionar se o código fosse minificado.
angular.module('portal', [
  'portal.filtros',
  'portal.servicos',
  'portal.componentes',
  'portal.controladores'
]);
