<!--
  Componente Paginacao: botões "Anterior", um por página e "Próxima".
  Equivale à diretiva <paginacao> da versão AngularJS.

  Uso:
    <Paginacao :total-paginas="totalPaginas" :pagina-atual="pagina"
               rotulo="Paginação do catálogo" @mudar-pagina="irPara" />

  O componente só mostra a página atual e AVISA o pai quando a aluna escolhe
  outra ($emit('mudar-pagina', n)). Quem muda a página é a seção (mão única).
-->
<template>
  <nav class="paginacao" :aria-label="rotulo">
    <ul class="paginacao__lista">
      <!-- :disabled tira o botão da ordem de Tab quando não há página anterior. -->
      <li class="paginacao__item">
        <button type="button" class="paginacao__botao" aria-label="Página anterior"
                :disabled="paginaAtual <= 1" @click="anterior">Anterior</button>
      </li>
      <!-- :key="p": o botão de cada página é reaproveitado e o foco não se perde. -->
      <li class="paginacao__item" v-for="p in paginas" :key="p">
        <button type="button" class="paginacao__botao" :aria-label="'Página ' + p"
                :class="{ 'paginacao__botao--atual': p === paginaAtual }"
                :aria-current="p === paginaAtual ? 'page' : null"
                @click="ir(p)">{{ p }}</button>
      </li>
      <li class="paginacao__item">
        <button type="button" class="paginacao__botao" aria-label="Próxima página"
                :disabled="paginaAtual >= totalPaginas" @click="proxima">Próxima</button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Paginacao',

  // props: o pai informa o total e a página atual; o componente não os altera.
  props: {
    totalPaginas: { type: Number, required: true },
    paginaAtual: { type: Number, required: true },
    rotulo: { type: String, default: 'Paginação' }   // aria-label do <nav>
  },

  // emits: o único jeito de o componente falar com o pai.
  emits: ['mudar-pagina'],

  // computed: valor derivado das props, recalculado só quando totalPaginas muda
  // (no AngularJS, isso exigia um $watch).
  computed: {
    paginas() {
      const lista = [];
      for (let n = 1; n <= this.totalPaginas; n++) {
        lista.push(n);
      }
      return lista;
    }
  },

  methods: {
    // Página fora do intervalo ou igual à atual é ignorada.
    ir(pagina) {
      if (pagina < 1 || pagina > this.totalPaginas || pagina === this.paginaAtual) {
        return;
      }
      // $emit: o pai recebe o número em @mudar-pagina="irPara".
      this.$emit('mudar-pagina', pagina);
    },

    // Ao chegar à primeira ou à última página, o botão usado fica desabilitado
    // e perderia o foco. O foco passa para o botão da página de destino.
    focarPagina(pagina) {
      const botoes = this.$el.querySelectorAll('.paginacao__botao');
      botoes[pagina].focus(); // índice 0 é "Anterior"; o índice n é a página n
    },

    anterior() {
      const destino = this.paginaAtual - 1;
      this.ir(destino);
      if (destino === 1) {
        this.focarPagina(destino);
      }
    },

    proxima() {
      const destino = this.paginaAtual + 1;
      this.ir(destino);
      if (destino === this.totalPaginas) {
        this.focarPagina(destino);
      }
    }
  }
};
</script>
