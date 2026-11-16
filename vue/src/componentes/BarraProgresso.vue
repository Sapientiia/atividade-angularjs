<!--
  Componente BarraProgresso: trilho com preenchimento proporcional ao valor.
  Equivale à diretiva <barra-progresso> da versão AngularJS.

  Uso:
    <BarraProgresso :valor="percentual" rotulo="Progresso do curso" mostrar-percentual />
    <BarraProgresso :valor="envio.progresso" rotulo="Envio do atestado" mostrar-percentual />
-->
<template>
  <div class="progresso">
    <!-- O role e os aria-value* ficam no trilho; o leitor de tela lê o valor por eles. -->
    <div class="progresso__trilho" role="progressbar" :aria-label="rotulo"
         aria-valuemin="0" aria-valuemax="100" :aria-valuenow="percentual">
      <!-- :style: a largura do preenchimento é o próprio percentual. -->
      <div class="progresso__barra" :style="{ width: percentual + '%' }"></div>
    </div>
    <!-- aria-hidden: o número visível repetiria o aria-valuenow no leitor de tela. -->
    <span class="progresso__percentual" aria-hidden="true" v-if="mostrarPercentual">{{ percentual }}%</span>
  </div>
</template>

<script>
export default {
  name: 'BarraProgresso',

  props: {
    valor: { type: Number, required: true },              // número de 0 a 100 vindo do pai
    rotulo: { type: String, required: true },             // nome acessível da barra (aria-label)
    mostrarPercentual: { type: Boolean, default: false }  // exibe o número ao lado da barra
  },

  // computed: recalculado sempre que a prop "valor" muda. No envio do
  // atestado o pai sobe o valor de 5 em 5, e a largura acompanha cada passo
  // (no AngularJS, isso era um $watch).
  computed: {
    percentual() {
      const numero = Number(this.valor) || 0;                 // vazio ou inválido vira 0
      return Math.round(Math.min(100, Math.max(0, numero)));  // limita a 0–100 e arredonda
    }
  }
};
</script>
