// Serviço do aluno: dados da aluna, mensalidade, validação do contato e do
// atestado. Equivale ao AlunoService da versão AngularJS.
//
// Como no serviço de disciplinas, nada fica guardado no módulo: quem chama
// carregarAluno() recebe uma cópia nova (o App.vue a guarda no data()).
import { aluno, historico, documentos, solicitacoes } from '../dados/aluno.js';
import { calcularValorMensal } from './disciplinas.js';

const EXTENSOES_ACEITAS = ['pdf', 'jpg', 'jpeg', 'png'];
const TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5 MB em bytes

// Mesma expressão que o AngularJS usa no <input type="email">, para as duas
// versões aceitarem e recusarem os mesmos e-mails.
const EMAIL_VALIDO = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
const CEP_VALIDO = /^\d{5}-\d{3}$/;

// Cópias novas a cada chamada (structuredClone).
export function carregarAluno() {
  return structuredClone(aluno);
}

export function carregarHistorico() {
  return structuredClone(historico);
}

export function carregarDocumentos() {
  return structuredClone(documentos);
}

export function carregarSolicitacoes() {
  return structuredClone(solicitacoes);
}

export function percentualConcluido(dadosAluno = aluno) {
  return Math.round(dadosAluno.cargaHorariaCumprida / dadosAluno.cargaHorariaTotal * 100);
}

// Mensalidade do período atual: soma a carga horária das disciplinas
// "Cursando" e usa a regra de valor do serviço de disciplinas (320 h = R$ 1.798,40).
export function mensalidadeAtual(listaHistorico = historico) {
  let horas = 0;
  listaHistorico.forEach((item) => {
    if (item.situacao === 'Cursando') {
      horas += item.cargaHoraria;
    }
  });
  return {
    valor: calcularValorMensal(horas),
    vencimento: '2026-12-10'
  };
}

// Devolve um objeto { campo: mensagem } só com os campos inválidos.
// As regras são as mesmas da validação do formulário na versão AngularJS:
// e-mail e telefone obrigatórios e CEP no formato 00000-000 quando preenchido.
export function validarContato(contato) {
  const erros = {};
  const email = (contato.emailPessoal || '').trim();
  const telefone = (contato.telefone || '').trim();
  const cep = (contato.cep || '').trim();

  if (!EMAIL_VALIDO.test(email)) {
    erros.emailPessoal = 'Informe um e-mail válido.';
  }
  if (telefone === '') {
    erros.telefone = 'Informe o telefone.';
  }
  if (cep !== '' && !CEP_VALIDO.test(cep)) {
    erros.cep = 'Use o formato 00000-000.';
  }
  return erros;
}

// Compara campo a campo o rascunho do formulário com o contato salvo.
export function contatoIgual(rascunho, contatoSalvo) {
  const campos = Object.keys(contatoSalvo);
  return campos.length === Object.keys(rascunho).length &&
    campos.every((campo) => rascunho[campo] === contatoSalvo[campo]);
}

// Devolve null quando o arquivo é aceito, ou o motivo da recusa.
export function validarAtestado(arquivo) {
  const extensao = arquivo && arquivo.name ? arquivo.name.split('.').pop().toLowerCase() : '';
  if (!EXTENSOES_ACEITAS.includes(extensao)) {
    return 'formato';
  }
  if (arquivo.size > TAMANHO_MAXIMO) {
    return 'tamanho';
  }
  return null;
}

// Data de hoje em 'yyyy-MM-dd' pelo horário local. toISOString() não serve:
// ele usa UTC e, à noite no Brasil, já devolveria o dia seguinte.
export function hoje() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return agora.getFullYear() + '-' + mes + '-' + dia;
}

// Linha nova para a tabela "Solicitações recentes", com a data de hoje.
export function novaSolicitacao(documento, situacao) {
  return { documento, data: hoje(), situacao };
}
