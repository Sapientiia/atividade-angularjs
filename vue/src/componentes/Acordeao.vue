<!--
  Componente Acordeao: lista de perguntas que expandem e recolhem.
  Equivale à diretiva <acordeao> da versão AngularJS.

  Uso:
    <Acordeao :itens="perguntas" />

  Cada item é um objeto { titulo, conteudo }, em texto puro. Só um item fica
  aberto por vez: abrir outro fecha o anterior, e clicar no aberto o fecha.
-->
<template>
  <div class="acordeao">
    <div class="acordeao__item" v-for="(item, i) in itens" :key="i">
      <h3 class="acordeao__titulo">
        <!-- aria-expanded recebe sempre "true" ou "false" (nunca fica ausente). -->
        <button type="button" class="acordeao__botao" :id="idBase + '-botao-' + i"
                :aria-expanded="estaAberto(i) ? 'true' : 'false'" :aria-controls="idBase + '-painel-' + i"
                @click="alternar(i)">
          <svg class="icone icone--chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter">
            <path d="M3.5 6 8 10.5 12.5 6"/>
          </svg>
          <span>{{ item.titulo }}</span>
        </button>
      </h3>
      <!-- Sem v-if/v-show: o painel fica sempre no DOM e a classe "--aberto"
           dispara a transição de altura feita no CSS (grid-template-rows). -->
      <div :class="['acordeao__painel', { 'acordeao__painel--aberto': estaAberto(i) }]"
           :id="idBase + '-painel-' + i" role="region"
           :aria-labelledby="idBase + '-botao-' + i">
        <div class="acordeao__conteudo"><p>{{ item.conteudo }}</p></div>
      </div>
    </div>
  </div>
</template>

<script>
// Contador do módulo: deixa os IDs únicos mesmo com dois acordeões na página.
let contador = 0;

export default {
  name: 'Acordeao',

  // props: a lista vem do pai; o componente lê e não altera.
  props: {
    itens: { type: Array, required: true }
  },

  // data: o índice do item aberto, ou null quando todos estão fechados.
  // Um único número garante "um aberto por vez".
  data() {
    return {
      indiceAberto: null
    };
  },

  // created: prefixo dos IDs que ligam cada botão ao seu painel
  // (aria-controls e aria-labelledby).
  created() {
    contador += 1;
    this.idBase = 'acordeao-' + contador;
  },

  methods: {
    estaAberto(indice) {
      return this.indiceAberto === indice;
    },

    alternar(indice) {
      this.indiceAberto = this.estaAberto(indice) ? null : indice;
    }
  }
};
</script>
