<!--
  Componente Abas: títulos clicáveis e o conteúdo da aba selecionada.
  Equivale às diretivas <abas> + <aba> da versão AngularJS.

  Uso (slots nomeados, um por aba):
    <Abas rotulo="Perfil do aluno" :abas="[{ id: 'dados', titulo: 'Dados pessoais' }, ...]">
      <template #dados> ...formulário com v-model... </template>
      <template #historico> ... </template>
    </Abas>

  Slot nomeado: o conteúdo de cada aba é escrito e compilado no componente pai
  (a seção Perfil). Por isso o v-model do formulário continua ligado aos dados
  da seção. É o equivalente da transclusão do AngularJS.
-->
<template>
  <div class="abas">
    <div class="abas__lista" role="tablist" :aria-label="rotulo">
      <!-- Só a aba ativa entra na ordem de Tab (tabindex 0); as setas levam às outras. -->
      <button type="button" role="tab" class="abas__aba"
              v-for="(aba, indice) in abas" :key="aba.id"
              ref="botoes"
              :id="idBase + '-aba-' + indice" :aria-controls="idBase + '-painel-' + indice"
              :aria-selected="indice === indiceAtivo ? 'true' : 'false'"
              :tabindex="indice === indiceAtivo ? 0 : -1"
              @click="selecionar(indice)" @keydown="aoTeclar($event, indice)">{{ aba.titulo }}</button>
    </div>
    <div class="abas__paineis">
      <!-- v-show (e não v-if): o painel inativo só fica oculto. Com v-if, o
           formulário e o campo de arquivo seriam recriados a cada troca de aba. -->
      <div class="abas__painel" role="tabpanel" v-for="(aba, indice) in abas" :key="aba.id"
           :id="idBase + '-painel-' + indice" :aria-labelledby="idBase + '-aba-' + indice" tabindex="0"
           v-show="indice === indiceAtivo">
        <slot :name="aba.id"></slot>
      </div>
    </div>
  </div>
</template>

<script>
// Contador do módulo: deixa os IDs únicos mesmo com dois grupos de abas na página.
let contador = 0;

export default {
  name: 'Abas',

  props: {
    abas: { type: Array, required: true },     // lista de { id, titulo }; o id é o nome do slot
    rotulo: { type: String, required: true }   // aria-label da lista de abas (role="tablist")
  },

  // data: o índice da aba ativa, a única fonte da verdade sobre a seleção.
  data() {
    return {
      indiceAtivo: 0
    };
  },

  // created: prefixo dos IDs que ligam cada aba ao seu painel.
  created() {
    contador += 1;
    this.idBase = 'abas-' + contador;
  },

  methods: {
    selecionar(indice) {
      this.indiceAtivo = indice;
    },

    // Teclado do padrão de abas (ativação automática): as setas trocam de
    // aba e já mostram o painel; Home e End vão à primeira e à última.
    aoTeclar(evento, indice) {
      const total = this.abas.length;
      let destino;

      switch (evento.key) {
        case 'ArrowRight':
          destino = (indice + 1) % total;          // depois da última, volta à primeira
          break;
        case 'ArrowLeft':
          destino = (indice - 1 + total) % total;  // antes da primeira, vai à última
          break;
        case 'Home':
          destino = 0;
          break;
        case 'End':
          destino = total - 1;
          break;
        default:
          return; // Tab, Enter e as demais teclas seguem o comportamento normal
      }

      evento.preventDefault();
      this.selecionar(destino);
      // $nextTick: espera o Vue atualizar o tabindex antes de mover o foco.
      this.$nextTick(() => this.$refs.botoes[destino].focus());
    }
  }
};
</script>
