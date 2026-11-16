<!--
  Seção BarraNavegacao: navbar fixa com a marca, os links das seções e o menu da conta.
  Equivale ao <header ng-controller="ContaController as conta"> da versão AngularJS.
-->
<template>
  <header class="cabecalho">
    <div class="navbar">
      <div class="container navbar__conteudo">
        <div class="navbar__marca">
          <span class="navbar__nome">Faculdade Itapuã</span>
          <span class="navbar__subtitulo">Portal do Aluno</span>
        </div>

        <nav class="navbar__nav" aria-label="Seções do portal">
          <ul class="navbar__links">
            <li><a class="navbar__link" href="#painel">Painel</a></li>
            <li><a class="navbar__link" href="#disciplinas">Disciplinas</a></li>
            <li><a class="navbar__link" href="#perfil">Perfil</a></li>
            <li><a class="navbar__link" href="#ajuda">Ajuda</a></li>
          </ul>
        </nav>

        <div class="navbar__conta">
          <!-- :rotulo e :opcoes descem como props; a escolha sobe pelo evento @selecionar. -->
          <MenuSuspenso :rotulo="nomeCurto" :opcoes="opcoes" @selecionar="aoSelecionarConta" />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import MenuSuspenso from '../componentes/MenuSuspenso.vue';
import { toast } from '../servicos/toast.js';

export default {
  name: 'BarraNavegacao',

  components: { MenuSuspenso },

  props: {
    nomeCurto: { type: String, required: true }   // vem do objeto aluno do App.vue
  },

  data() {
    return {
      // No AngularJS cada opção trazia a própria função (acao). Aqui o menu
      // só emite a opção escolhida, e quem decide o que fazer é esta seção.
      opcoes: [
        { rotulo: 'Meu perfil' },
        { rotulo: 'Ajuda' },
        { rotulo: 'Sair' }
      ]
    };
  },

  methods: {
    // Navegação pela âncora comum (#perfil) e foco no título da seção, para o
    // teclado continuar dali.
    irParaSecao(id) {
      window.location.hash = id;
      document.getElementById('titulo-' + id).focus({ preventScroll: true });
      // Se o hash já era o mesmo, o navegador não rola de novo; o scrollIntoView
      // garante a rolagem e respeita o scroll-margin-top da seção.
      document.getElementById(id).scrollIntoView();
    },

    // Ouvinte do evento "selecionar" emitido pelo MenuSuspenso.
    aoSelecionarConta(opcao) {
      if (opcao.rotulo === 'Meu perfil') {
        this.irParaSecao('perfil');
      } else if (opcao.rotulo === 'Ajuda') {
        this.irParaSecao('ajuda');
      } else if (opcao.rotulo === 'Sair') {
        toast.mostrar('info', 'Saída simulada: este portal não tem login real.');
      }
    }
  }
};
</script>
