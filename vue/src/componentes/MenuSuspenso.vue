<!--
  Componente MenuSuspenso: botão que mostra uma lista de opções clicáveis.
  Equivale à diretiva <menu-suspenso> da versão AngularJS.

  Uso:
    <MenuSuspenso :rotulo="nomeCurto" :opcoes="opcoes" @selecionar="aoSelecionarConta" />
    <MenuSuspenso :rotulo="..." :opcoes="..." :selecionada="semestre" @selecionar="filtrarPorSemestre" />

  O dado entra por props e a escolha sai por evento ($emit('selecionar', opcao)).
-->
<template>
  <div class="menu-suspenso">
    <!-- Padrão "menu button": o botão anuncia que abre um menu e se ele está aberto. -->
    <button type="button" class="btn menu-suspenso__botao" :id="idBase + '-botao'"
            aria-haspopup="true" :aria-expanded="aberto ? 'true' : 'false'" :aria-controls="idBase + '-lista'"
            ref="botao" @click="alternar" @keydown="aoTeclarNoBotao">
      <span>{{ rotulo }}</span>
      <svg class="icone icone--chevron-pequeno" viewBox="0 0 16 16" aria-hidden="true" focusable="false"
           fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter">
        <path d="M3.5 6 8 10.5 12.5 6"/>
      </svg>
    </button>
    <!-- v-show: a lista continua no DOM e só fica oculta, como o ng-show. -->
    <ul class="menu-suspenso__lista" :id="idBase + '-lista'" role="menu" :aria-labelledby="idBase + '-botao'"
        v-show="aberto">
      <li role="none" v-for="(opcao, indice) in opcoes" :key="opcao.rotulo">
        <!-- null remove o atributo: só a opção vigente recebe aria-current. -->
        <button type="button" role="menuitem" tabindex="-1" class="menu-suspenso__item"
                ref="itens"
                :aria-current="opcao === selecionada ? 'true' : null"
                @click="selecionar(opcao)" @keydown="aoTeclarNoItem($event, indice)">
          <svg class="icone icone--check menu-suspenso__check" viewBox="0 0 16 16" aria-hidden="true" focusable="false"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter"
               v-if="opcao === selecionada">
            <path d="M3 8.5 6.5 12 13 4.5"/>
          </svg>
          {{ opcao.rotulo }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
// Contador do módulo: cada instância ganha um número, e os IDs ficam únicos
// mesmo com dois menus na página (no AngularJS, o papel do scope.$id).
let contador = 0;

export default {
  name: 'MenuSuspenso',

  // props: dados que o componente pai passa. O filho lê, mas não altera.
  props: {
    rotulo: { type: String, required: true },       // texto do botão
    opcoes: { type: Array, required: true },        // lista de { rotulo }
    selecionada: { type: Object, default: null }    // opção vigente (só no filtro de semestre)
  },

  // emits: eventos que o componente avisa ao pai.
  emits: ['selecionar'],

  // data: estado interno, só deste componente.
  data() {
    return {
      aberto: false
    };
  },

  // created: roda ao criar o componente, antes de existir DOM.
  // Bom lugar para preparar valores que não dependem da tela, como o idBase.
  created() {
    contador += 1;
    this.idBase = 'menu-' + contador;
    this.focoCancelado = false;
  },

  // mounted: roda depois que o componente já está no DOM.
  // O clique fora é ouvido no document, fora do componente.
  mounted() {
    document.addEventListener('click', this.aoClicarFora);
  },

  // beforeUnmount: limpeza. Quem registra listener fora do próprio elemento remove.
  beforeUnmount() {
    document.removeEventListener('click', this.aoClicarFora);
    this.focoCancelado = true; // um $nextTick pendente não foca mais nada
  },

  methods: {
    focarItem(indice) {
      const itens = this.$refs.itens || [];
      if (itens[indice]) {
        itens[indice].focus();
      }
    },

    abrir(indiceFoco) {
      this.aberto = true;
      this.focoCancelado = false;
      // A lista ainda está com display: none e elemento oculto não recebe foco.
      // O $nextTick espera o Vue atualizar o DOM (equivale ao $timeout do AngularJS).
      this.$nextTick(() => {
        if (!this.focoCancelado && this.aberto) {
          this.focarItem(indiceFoco);
        }
      });
    },

    fechar(devolverFoco) {
      this.aberto = false;
      this.focoCancelado = true;
      if (devolverFoco) {
        this.$refs.botao.focus();
      }
    },

    alternar() {
      if (this.aberto) {
        this.fechar(false);
      } else {
        this.abrir(0);
      }
    },

    // Fecha e devolve o foco ao botão ANTES de avisar o pai; assim o pai ainda
    // pode mandar o foco para outro lugar (ex.: "Meu perfil" foca o título da seção).
    selecionar(opcao) {
      this.fechar(true);
      // $emit: o pai recebe a opção em @selecionar="..." (o callback do menu).
      this.$emit('selecionar', opcao);
    },

    // Enter e Espaço não precisam de tratamento: no <button> eles já
    // disparam o clique, que chama alternar().
    aoTeclarNoBotao(evento) {
      if (evento.key === 'ArrowDown') {
        evento.preventDefault();
        this.abrir(0);
      } else if (evento.key === 'ArrowUp') {
        evento.preventDefault();
        this.abrir(this.opcoes.length - 1);
      } else if (evento.key === 'Escape' && this.aberto) {
        this.fechar(true);
      }
    },

    aoTeclarNoItem(evento, indice) {
      const total = this.opcoes.length;

      switch (evento.key) {
        case 'ArrowDown':
          evento.preventDefault();
          this.focarItem((indice + 1) % total);
          break;
        case 'ArrowUp':
          evento.preventDefault();
          this.focarItem((indice - 1 + total) % total);
          break;
        case 'Home':
          evento.preventDefault();
          this.focarItem(0);
          break;
        case 'End':
          evento.preventDefault();
          this.focarItem(total - 1);
          break;
        case 'Escape':
          evento.preventDefault();
          this.fechar(true);
          break;
        case 'Tab':
          // Sem preventDefault: a tabulação segue a partir do botão.
          this.fechar(true);
          break;
      }
    },

    // Clique fora: ignora cliques dentro do próprio componente (this.$el).
    // Diferente do AngularJS, não precisa de $apply: o Vue percebe a mudança sozinho.
    aoClicarFora(evento) {
      if (!this.aberto || this.$el.contains(evento.target)) {
        return;
      }
      this.fechar(false);
    }
  }
};
</script>
