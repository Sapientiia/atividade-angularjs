<!--
  Seção SecaoPainel: resumo da aluna (progresso, mensalidade, prazos e contato).
  Equivale ao <section ng-controller="PainelController as painel"> da versão AngularJS.

  Recebe "aluno" por prop. Quando o Perfil salva um contato novo, o App.vue
  atualiza o objeto e este cartão Contato mostra o dado novo sozinho.
-->
<template>
  <section id="painel" class="secao" aria-labelledby="titulo-painel">
    <div class="container">
      <h2 id="titulo-painel" tabindex="-1">Painel</h2>

      <div class="identificacao">
        <p class="identificacao__saudacao">Olá, {{ aluno.nomeCurto }}.</p>
        <p class="identificacao__curso">Engenharia de Software · {{ aluno.semestreAtual }} · Matrícula {{ aluno.matricula }}</p>
      </div>

      <div class="painel-grid">
        <div class="cartao">
          <h3 class="cartao__titulo">Progresso do curso</h3>
          <BarraProgresso :valor="percentual" rotulo="Progresso do curso" mostrar-percentual />
          <!-- Formatador cargaHoraria: 2190 -> "2.190 h". -->
          <p class="cartao__nota">{{ cargaHoraria(aluno.cargaHorariaCumprida) }} de {{ cargaHoraria(aluno.cargaHorariaTotal) }}</p>
        </div>

        <div class="cartao">
          <h3 class="cartao__titulo">Financeiro</h3>
          <p class="cartao__rotulo">Mensalidade {{ aluno.periodoAtual }}</p>
          <p class="cartao__valor">{{ moeda(mensalidade.valor) }}</p>
          <p class="cartao__detalhe">Vencimento: {{ formatarData(mensalidade.vencimento) }}</p>
        </div>

        <div class="cartao cartao--prazos">
          <h3 class="cartao__titulo">Prazos acadêmicos</h3>
          <ul class="prazos">
            <!-- prazosOrdenados (computed): os dados chegam fora de ordem e a tela ordena pela data. -->
            <li class="prazos__item" v-for="prazo in prazosOrdenados" :key="prazo.data">
              <time class="prazos__data" :datetime="prazo.data">{{ formatarData(prazo.data) }}</time>
              <span class="prazos__descricao">{{ prazo.descricao }}</span>
            </li>
          </ul>
        </div>

        <div class="cartao cartao--contato">
          <h3 class="cartao__titulo">Contato</h3>
          <p class="cartao__linha">{{ aluno.contato.emailPessoal }}</p>
          <p class="cartao__linha">{{ aluno.contato.telefone }}</p>
          <p class="cartao__link"><a href="#perfil">Editar no perfil</a></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BarraProgresso from '../componentes/BarraProgresso.vue';
import { percentualConcluido, mensalidadeAtual } from '../servicos/aluno.js';
import { prazos } from '../dados/secretaria.js';
import { cargaHoraria, moeda, formatarData } from '../formatadores.js';

export default {
  name: 'SecaoPainel',

  components: { BarraProgresso },

  props: {
    aluno: { type: Object, required: true }   // o mesmo objeto guardado no App.vue
  },

  data() {
    return {
      prazos: structuredClone(prazos)
    };
  },

  computed: {
    percentual() {
      return percentualConcluido(this.aluno);
    },

    mensalidade() {
      return mensalidadeAtual();
    },

    // Datas em texto 'yyyy-MM-dd' ficam em ordem cronológica na ordem alfabética.
    // O slice() copia a lista antes do sort, para não alterar o data().
    prazosOrdenados() {
      return this.prazos.slice().sort((a, b) => a.data.localeCompare(b.data));
    }
  },

  methods: {
    cargaHoraria,
    moeda,
    formatarData
  }
};
</script>
