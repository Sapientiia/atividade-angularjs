<!--
  Componente ToastContainer: exibe a fila de notificações do serviço global de toast.
  Equivale à diretiva <toast-container> da versão AngularJS.
  Uso: <ToastContainer />, uma única vez, no App.vue.

  Não recebe props: o conteúdo vem do serviço (src/servicos/toast.js), que
  guarda a fila e os temporizadores. O componente só mostra a fila e repassa
  o clique em "fechar".
-->
<template>
  <!-- A região aria-live existe desde o carregamento, vazia, para o leitor de tela anunciar cada toast que entrar. -->
  <div class="toasts" role="status" aria-live="polite">
    <div v-for="item in toasts" :key="item.id"
         :class="['toast', 'toast--' + item.tipo, { 'toast--saindo': item.saindo }]">
      <!-- v-if escolhe o ícone do tipo; o texto já diz o tipo, o ícone só reforça. -->
      <svg class="icone toast__icone" viewBox="0 0 16 16" aria-hidden="true" focusable="false"
           fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter">
        <g v-if="item.tipo === 'sucesso'">
          <circle cx="8" cy="8" r="8" fill="currentColor" stroke="none"/>
          <path class="icone__glifo" d="M4.5 8.25 7 10.75l4.5-5" stroke-width="1.75"/>
        </g>
        <g v-else-if="item.tipo === 'erro'">
          <circle cx="8" cy="8" r="8" fill="currentColor" stroke="none"/>
          <path class="icone__glifo" d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke-width="1.75"/>
        </g>
        <g v-else-if="item.tipo === 'info'">
          <circle cx="8" cy="8" r="8" fill="currentColor" stroke="none"/>
          <path class="icone__glifo" d="M8 7v4.5" stroke-width="1.75"/>
          <circle class="icone__ponto" cx="8" cy="4.6" r="1" stroke="none"/>
        </g>
      </svg>
      <p class="toast__mensagem">{{ item.mensagem }}</p>
      <button type="button" class="toast__fechar" aria-label="Fechar notificação" @click="fechar(item.id)">
        <svg class="icone" viewBox="0 0 16 16" aria-hidden="true" focusable="false"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter">
          <path d="M4 4l8 8M12 4l-8 8"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { toast } from '../servicos/toast.js';

export default {
  name: 'ToastContainer',

  // computed: lê a fila reativa do serviço. Quando o serviço faz push ou
  // splice, o Vue redesenha a lista sozinho.
  computed: {
    toasts() {
      return toast.estado.fila;
    }
  },

  methods: {
    fechar(id) {
      toast.fechar(id);
    }
  }
};
</script>
