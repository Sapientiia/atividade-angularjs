// Serviço global de toast: fila de notificações breves.
// Equivale ao ToastService da versão AngularJS (lá com $timeout, aqui com setTimeout).
//
// "Global" porque é um módulo ES: todo arquivo que faz
//   import { toast } from '../servicos/toast.js'
// recebe o MESMO objeto. O reactive() torna a fila reativa: quando uma seção
// chama toast.mostrar(), o ToastContainer atualiza a tela sozinho.
import { reactive } from 'vue';

const DURACAO_PADRAO = 4000; // ms visível antes de sair sozinho
const DURACAO_SAIDA = 150;   // ms da transição de saída (opacidade no CSS)

// Estado global: um único objeto reativo compartilhado por toda a aplicação.
const estado = reactive({ fila: [] });
let proximoId = 1;

function buscar(id) {
  return estado.fila.find((item) => item.id === id) || null;
}

export const toast = {
  estado,

  // Tipos: 'sucesso', 'erro' ou 'info'. O toast novo entra no fim da fila (embaixo).
  mostrar(tipo, mensagem, duracaoMs = DURACAO_PADRAO) {
    const id = proximoId++;
    estado.fila.push({
      id,
      tipo,
      mensagem,
      saindo: false,
      temporizador: setTimeout(() => toast.fechar(id), duracaoMs)
    });
    return id;
  },

  // Fecha em duas etapas: marca "saindo" (o CSS esmaece o toast) e remove
  // depois de 150 ms. O temporizador original é cancelado para não disparar de novo.
  fechar(id) {
    const item = buscar(id);
    if (!item || item.saindo) {
      return;
    }
    clearTimeout(item.temporizador);
    item.saindo = true;
    item.temporizador = setTimeout(() => {
      const indice = estado.fila.indexOf(item);
      if (indice !== -1) {
        estado.fila.splice(indice, 1);
      }
    }, DURACAO_SAIDA);
  }
};
