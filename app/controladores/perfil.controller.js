'use strict';

// PerfilController: seção Perfil do aluno (dados pessoais, histórico,
// documentos e envio de atestado).
// No index.html: <section id="perfil" ng-controller="PerfilController as perfil">.
//
// controllerAs e $scope: "PerfilController as perfil" publica este controlador
// (o vm abaixo) no $scope da seção, na propriedade $scope.perfil. Por isso o
// template escreve ng-model="perfil.rascunho.emailPessoal": é o two-way binding
// entre o campo e $scope.perfil.rascunho, que é o mesmo objeto que vm.rascunho.
// O $scope continua disponível para o que só ele faz: $watch e $on('$destroy').
angular.module('portal.controladores').controller('PerfilController', [
  '$scope', '$interval', 'AlunoService', 'ToastService',
  function ($scope, $interval, AlunoService, ToastService) {
    var vm = this;
    var intervalo = null;

    vm.aluno = AlunoService.obterAluno();
    // O formulário edita um rascunho (cópia). O contato salvo só muda em salvar().
    vm.rascunho = AlunoService.obterContato();
    vm.alterado = false;
    // vm.formDados é publicado pelo próprio <form name="perfil.formDados">.
    vm.historico = AlunoService.obterHistorico();
    vm.documentos = AlunoService.documentosDisponiveis();
    vm.solicitacoes = AlunoService.obterSolicitacoes();
    vm.envio = { arquivo: null, progresso: 0, enviando: false, concluido: false };

    // ---- Dados pessoais ----

    // Chamado pelo ng-change de cada campo editável.
    vm.marcarAlteracao = function () {
      vm.alterado = true;
    };

    // As mensagens de erro só aparecem depois de tentar salvar ($submitted).
    vm.campoInvalido = function (nome) {
      return Boolean(vm.formDados && vm.formDados.$submitted && vm.formDados[nome].$invalid);
    };

    // $setPristine volta o formulário ao estado inicial e esconde as mensagens.
    function limparEstado() {
      vm.alterado = false;
      vm.formDados.$setPristine();
    }

    vm.salvar = function () {
      if (vm.formDados.$invalid) {
        ToastService.mostrar('erro', 'Erro: verifique os campos destacados.');
        return;
      }
      // Editou e voltou ao valor salvo: nada a gravar, e o aviso some.
      if (AlunoService.contatoIgual(vm.rascunho)) {
        limparEstado();
        ToastService.mostrar('info', 'Nenhuma alteração para salvar.');
        return;
      }
      AlunoService.salvarContato(vm.rascunho);
      limparEstado();
      ToastService.mostrar('sucesso', 'Dados salvos.');
    };

    vm.descartar = function () {
      vm.rascunho = AlunoService.obterContato();
      limparEstado();
      ToastService.mostrar('info', 'Alterações descartadas.');
    };

    // ---- Documentos ----

    vm.solicitarDocumento = function (documento) {
      AlunoService.solicitarDocumento(documento);
      ToastService.mostrar('sucesso', 'Solicitação registrada: ' + documento.nome + '.');
    };

    // Callback da diretiva seletor-arquivo: só guarda o arquivo escolhido.
    vm.escolherArquivo = function (arquivo) {
      vm.envio.arquivo = arquivo;
    };

    // $scope.$watch observa uma expressão a cada digest e chama a função quando
    // o valor muda. A expressão usa o apelido "perfil" do controllerAs.
    // Chegou um arquivo novo: zera o envio anterior, o que esconde o bloco do
    // progresso. Quando o arquivo volta a null (recusado ou enviado), nada muda.
    $scope.$watch('perfil.envio.arquivo', function (arquivo) {
      if (arquivo) {
        vm.envio.progresso = 0;
        vm.envio.concluido = false;
      }
    });

    function concluir() {
      vm.envio.enviando = false;
      vm.envio.concluido = true;
      vm.envio.arquivo = null; // a diretiva limpa o campo de arquivo
      AlunoService.registrarAtestado();
      ToastService.mostrar('sucesso', 'Arquivo enviado.');
    }

    // Um passo do envio simulado: 5% a cada 150 ms, 20 passos, cerca de 3 s.
    function avancar() {
      vm.envio.progresso += 5;
      if (vm.envio.progresso >= 100) {
        $interval.cancel(intervalo);
        intervalo = null;
        concluir();
      }
    }

    vm.enviarArquivo = function () {
      var erro = AlunoService.validarAtestado(vm.envio.arquivo);

      if (erro === 'formato') {
        ToastService.mostrar('erro', 'Erro: formato inválido. Use PDF, JPG ou PNG.');
        vm.envio.arquivo = null;
        return;
      }
      if (erro === 'tamanho') {
        ToastService.mostrar('erro', 'Erro: o arquivo passa de 5 MB.');
        vm.envio.arquivo = null;
        return;
      }

      vm.envio.enviando = true;
      intervalo = $interval(avancar, 150);
    };

    // $scope.$on('$destroy'): o AngularJS avisa quando o escopo da seção é
    // destruído. Se isso acontecer no meio do envio, o $interval é cancelado
    // e não fica rodando sem tela.
    $scope.$on('$destroy', function () {
      if (intervalo) {
        $interval.cancel(intervalo);
      }
    });
  }
]);
