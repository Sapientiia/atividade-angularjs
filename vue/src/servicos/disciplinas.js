// Serviço de disciplinas: catálogo e regras de crédito, valor mensal e
// solicitação de matrícula. Equivale ao DisciplinasService da versão AngularJS.
//
// Diferença importante: aqui o módulo NÃO guarda o estado. carregarCatalogo()
// entrega uma cópia nova, a seção guarda essa cópia no próprio data() (que a
// torna reativa) e as funções abaixo alteram o objeto que recebem.
import { disciplinas } from '../dados/disciplinas.js';

const HORAS_POR_CREDITO = 20;
const VALOR_CREDITO_EM_CENTAVOS = 11240; // R$ 112,40

export function calcularCreditos(cargaHoraria) {
  return cargaHoraria / HORAS_POR_CREDITO;
}

// O cálculo é feito em centavos: 3 * 112.4 dá 337.20000000000005 em ponto
// flutuante, enquanto 3 * 11240 / 100 dá exatamente 337.2.
export function calcularValorMensal(cargaHoraria) {
  return calcularCreditos(cargaHoraria) * VALOR_CREDITO_EM_CENTAVOS / 100;
}

// structuredClone: cópia profunda dos dados. Cada carga começa do zero, e o
// estado de um teste não vaza para o próximo.
export function carregarCatalogo() {
  return structuredClone(disciplinas).map((disciplina) => ({
    ...disciplina,
    valorMensal: calcularValorMensal(disciplina.cargaHoraria),
    solicitada: false
  }));
}

// Recebe a disciplina vinda do template (já reativa). Ao alterar vagas e
// solicitada no próprio objeto, o Vue percebe e atualiza a tela.
export function solicitarMatricula(disciplina) {
  if (disciplina.solicitada || disciplina.vagas === 0) {
    return false;
  }
  disciplina.solicitada = true;
  disciplina.vagas -= 1;
  return true;
}

// Soma a carga horária das solicitadas e calcula créditos e valor sobre o
// total, para que o resultado continue exato em centavos.
export function resumoSolicitacoes(lista) {
  let quantidade = 0;
  let horas = 0;

  lista.forEach((disciplina) => {
    if (disciplina.solicitada) {
      quantidade += 1;
      horas += disciplina.cargaHoraria;
    }
  });

  return {
    quantidade,
    creditos: calcularCreditos(horas),
    valorMensal: calcularValorMensal(horas)
  };
}
