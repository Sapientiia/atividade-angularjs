<!--
  Seção SecaoAjuda: perguntas frequentes da secretaria.
  Equivale ao <section ng-controller="AjudaController as ajuda"> da versão AngularJS.
  Só entrega as perguntas ao <Acordeao>, que cuida sozinho de abrir e fechar cada item.
-->
<template>
  <section id="ajuda" class="secao" aria-labelledby="titulo-ajuda">
    <div class="container">
      <h2 id="titulo-ajuda" tabindex="-1">Ajuda da secretaria</h2>
      <Acordeao :itens="perguntas" />
      <p class="ajuda__horario">Secretaria acadêmica: segunda a sexta, das 8h às 20h, Bloco A, térreo.</p>
    </div>
  </section>
</template>

<script>
import Acordeao from '../componentes/Acordeao.vue';
import { perguntas } from '../dados/secretaria.js';

export default {
  name: 'SecaoAjuda',

  components: { Acordeao },

  data() {
    return {
      perguntas: structuredClone(perguntas)
    };
  }
};
</script>
