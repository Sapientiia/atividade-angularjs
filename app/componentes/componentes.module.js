'use strict';

// Cria o módulo das diretivas (os componentes visuais).
// A dependência de 'portal.servicos' existe só por causa do toastContainer,
// que lê a fila de mensagens do ToastService. As demais diretivas recebem
// tudo por bindings e podem ser levadas para outra aplicação junto com este módulo.
angular.module('portal.componentes', ['portal.servicos']);
