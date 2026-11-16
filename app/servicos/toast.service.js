'use strict';

// ToastService: fila de notificações breves, exibida pela diretiva toastContainer.
// Qualquer controlador injeta o serviço e chama, por exemplo,
// ToastService.mostrar('sucesso', 'Dados salvos.').
//
// Por que $timeout e não setTimeout: o $timeout dispara o ciclo de digest
// sozinho (a tela atualiza quando o toast some), pode ser cancelado com
// $timeout.cancel e é controlado nos testes com $timeout.flush(ms).
angular.module('portal.servicos').factory('ToastService', ['$timeout', function ($timeout) {
  var DURACAO_PADRAO = 4000; // ms visível antes de sair sozinho
  var DURACAO_SAIDA = 150;   // ms da transição de saída (opacidade no CSS)

  // A diretiva guarda a referência deste array. Por isso ele só é alterado no
  // lugar (push e splice); trocar por outro array (fila = []) deixaria a tela parada.
  var fila = [];
  var proximoId = 1;

  function buscar(id) {
    for (var i = 0; i < fila.length; i++) {
      if (fila[i].id === id) {
        return fila[i];
      }
    }
    return null;
  }

  function remover(toast) {
    var indice = fila.indexOf(toast);
    if (indice !== -1) {
      fila.splice(indice, 1);
    }
  }

  // Tipos: 'sucesso', 'erro' ou 'info'. O toast novo entra no fim da fila (embaixo).
  function mostrar(tipo, mensagem, duracaoMs) {
    var toast = {
      id: proximoId++,
      tipo: tipo,
      mensagem: mensagem,
      saindo: false,
      temporizador: null
    };
    toast.temporizador = $timeout(function () {
      fechar(toast.id);
    }, duracaoMs || DURACAO_PADRAO);
    fila.push(toast);
    return toast.id;
  }

  // Fecha em duas etapas: marca "saindo" (o CSS esmaece o toast) e remove
  // depois de 150 ms. O temporizador original é cancelado para não disparar de novo.
  function fechar(id) {
    var toast = buscar(id);
    if (!toast || toast.saindo) {
      return;
    }
    $timeout.cancel(toast.temporizador);
    toast.saindo = true;
    toast.temporizador = $timeout(function () {
      remover(toast);
    }, DURACAO_SAIDA);
  }

  return {
    fila: fila,
    mostrar: mostrar,
    fechar: fechar
  };
}]);
