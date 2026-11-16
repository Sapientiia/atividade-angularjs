<!--
  App.vue: componente raiz. Orquestra a navbar, as quatro seções e o
  ToastContainer, como o app.js orquestra os módulos na versão AngularJS.

  Fluxo de dados: o objeto "aluno" mora aqui e DESCE por props para o Painel
  e o Perfil. Quando o Perfil salva o contato, o dado SOBE pelo evento
  @salvar-contato e é este componente que atualiza o aluno.
-->
<template>
  <a class="salto" href="#conteudo">Ir para o conteúdo</a>

  <BarraNavegacao :nome-curto="aluno.nomeCurto" />

  <main id="conteudo" tabindex="-1">
    <h1 class="visualmente-oculto">Portal do Aluno — Faculdade Itapuã</h1>

    <SecaoPainel :aluno="aluno" />
    <SecaoCatalogo />
    <SecaoPerfil :aluno="aluno" @salvar-contato="salvarContato" />
    <SecaoAjuda />
  </main>

  <footer class="rodape">
    <div class="container">
      <p class="rodape__texto">Faculdade Itapuã — Portal do Aluno. Dados fictícios, para fins acadêmicos.</p>
    </div>
  </footer>

  <!-- Região das notificações: lê a fila do serviço global de toast. -->
  <ToastContainer />
</template>

<script>
import BarraNavegacao from './secoes/BarraNavegacao.vue';
import SecaoPainel from './secoes/SecaoPainel.vue';
import SecaoCatalogo from './secoes/SecaoCatalogo.vue';
import SecaoPerfil from './secoes/SecaoPerfil.vue';
import SecaoAjuda from './secoes/SecaoAjuda.vue';
import ToastContainer from './componentes/ToastContainer.vue';
import { carregarAluno } from './servicos/aluno.js';

export default {
  name: 'App',

  // components: registra os componentes usados no template acima.
  components: { BarraNavegacao, SecaoPainel, SecaoCatalogo, SecaoPerfil, SecaoAjuda, ToastContainer },

  // data: o App guarda só o que mais de uma seção usa, o objeto "aluno".
  data() {
    return {
      aluno: null
    };
  },

  // created: carrega a aluna antes da primeira renderização. O data() torna o
  // objeto reativo, e toda seção que o recebe por prop acompanha as mudanças.
  created() {
    this.aluno = carregarAluno();
  },

  methods: {
    // Ouvinte do evento "salvar-contato" emitido pela SecaoPerfil.
    salvarContato(contato) {
      this.aluno.contato = { ...contato };
    }
  }
};
</script>
