<!--
  Seção SecaoPerfil: dados pessoais, histórico, documentos e envio de atestado.
  Equivale ao <section ng-controller="PerfilController as perfil"> da versão AngularJS.

  "Dados descem, eventos sobem": a seção recebe "aluno" por prop e NUNCA a
  altera. O formulário edita um rascunho (data) e, ao salvar, a seção emite
  "salvar-contato"; quem atualiza o aluno é o App.vue.
-->
<template>
  <section id="perfil" class="secao" aria-labelledby="titulo-perfil">
    <div class="container">
      <h2 id="titulo-perfil" tabindex="-1">Perfil do aluno</h2>

      <!-- Cada <template #nome> preenche o slot de mesmo nome dentro de <Abas>.
           O conteúdo é compilado aqui, por isso enxerga rascunho, erros e salvar. -->
      <Abas rotulo="Perfil do aluno" :abas="abas">
        <template #dados>
          <h3>Identificação</h3>
          <dl class="dados">
            <div class="dados__item">
              <dt>Nome</dt>
              <dd>{{ aluno.nome }}</dd>
            </div>
            <div class="dados__item">
              <dt>Matrícula</dt>
              <dd>{{ aluno.matricula }}</dd>
            </div>
            <div class="dados__item">
              <dt>Curso</dt>
              <dd>{{ aluno.curso }}</dd>
            </div>
            <div class="dados__item">
              <dt>Data de nascimento</dt>
              <dd>{{ formatarData(aluno.dataNascimento) }}</dd>
            </div>
            <div class="dados__item">
              <dt>E-mail institucional</dt>
              <dd>{{ aluno.emailInstitucional }}</dd>
            </div>
          </dl>

          <!-- novalidate: desliga os balões do navegador; a validação é a do
               computed "erros" e as mensagens são as da página.
               @submit.prevent: chama salvar() sem recarregar a página.
               @input: qualquer digitação no formulário marca "Alterações não salvas." -->
          <form class="formulario" novalidate @submit.prevent="salvar" @input="marcarAlteracao">
            <fieldset class="formulario__grupo">
              <legend class="formulario__legenda">Contato e endereço</legend>
              <div class="formulario__campos">
                <div class="grupo-campo">
                  <label class="rotulo" for="campo-email">E-mail pessoal <span class="rotulo__obrigatorio">(obrigatório)</span></label>
                  <!-- v-model.trim: two-way binding com o rascunho, sem espaços nas pontas. -->
                  <input type="email" id="campo-email" name="emailPessoal" class="campo" required
                         v-model.trim="rascunho.emailPessoal"
                         :class="{ 'campo--invalido': campoInvalido('emailPessoal') }"
                         :aria-invalid="campoInvalido('emailPessoal') ? 'true' : null"
                         :aria-describedby="campoInvalido('emailPessoal') ? 'erro-email' : null">
                  <p class="mensagem-erro" id="erro-email" v-show="campoInvalido('emailPessoal')">Informe um e-mail válido.</p>
                </div>
                <div class="grupo-campo">
                  <label class="rotulo" for="campo-telefone">Telefone celular <span class="rotulo__obrigatorio">(obrigatório)</span></label>
                  <input type="tel" id="campo-telefone" name="telefone" class="campo" required
                         v-model.trim="rascunho.telefone"
                         :class="{ 'campo--invalido': campoInvalido('telefone') }"
                         :aria-invalid="campoInvalido('telefone') ? 'true' : null"
                         :aria-describedby="campoInvalido('telefone') ? 'erro-telefone' : null">
                  <p class="mensagem-erro" id="erro-telefone" v-show="campoInvalido('telefone')">Informe o telefone.</p>
                </div>
                <div class="grupo-campo">
                  <label class="rotulo" for="campo-cep">CEP</label>
                  <input type="text" id="campo-cep" name="cep" class="campo"
                         v-model.trim="rascunho.cep"
                         :class="{ 'campo--invalido': campoInvalido('cep') }"
                         :aria-invalid="campoInvalido('cep') ? 'true' : null"
                         :aria-describedby="campoInvalido('cep') ? 'erro-cep' : null">
                  <p class="mensagem-erro" id="erro-cep" v-show="campoInvalido('cep')">Use o formato 00000-000.</p>
                </div>
                <div class="grupo-campo grupo-campo--largo">
                  <label class="rotulo" for="campo-endereco">Endereço</label>
                  <input type="text" id="campo-endereco" name="endereco" class="campo"
                         v-model.trim="rascunho.endereco">
                </div>
                <div class="grupo-campo">
                  <label class="rotulo" for="campo-bairro">Bairro</label>
                  <input type="text" id="campo-bairro" name="bairro" class="campo"
                         v-model.trim="rascunho.bairro">
                </div>
                <div class="grupo-campo">
                  <label class="rotulo" for="campo-cidade">Cidade/UF</label>
                  <input type="text" id="campo-cidade" name="cidadeUf" class="campo"
                         v-model.trim="rascunho.cidadeUf">
                </div>
              </div>
            </fieldset>

            <div class="formulario__acoes">
              <button type="submit" class="btn btn--primario">Salvar alterações</button>
              <button type="button" class="btn btn--secundario" @click="descartar">Descartar alterações</button>
              <p class="formulario__aviso" role="status" v-show="alterado">Alterações não salvas.</p>
            </div>
          </form>
        </template>

        <template #historico>
          <p class="historico__coeficiente">Coeficiente de rendimento: {{ nota(aluno.coeficienteRendimento) }}</p>

          <!-- historicoEmCurso e historicoAnterior (computed) separam as linhas de cada período. -->
          <div class="tabela-rolagem" role="region" tabindex="0" aria-label="2026.2 — em curso">
            <table class="tabela">
              <caption>2026.2 — em curso</caption>
              <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Disciplina</th>
                  <th scope="col" class="tabela__numero">Carga horária</th>
                  <th scope="col" class="tabela__numero">Nota</th>
                  <th scope="col" class="tabela__numero">Frequência</th>
                  <th scope="col">Situação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="d in historicoEmCurso" :key="d.codigo">
                  <td>{{ caixaAlta(d.codigo) }}</td>
                  <td>{{ d.nome }}</td>
                  <td class="tabela__numero">{{ cargaHoraria(d.cargaHoraria) }}</td>
                  <td class="tabela__numero">{{ nota(d.nota) }}</td>
                  <td class="tabela__numero">{{ d.frequencia }}%</td>
                  <td :class="{ 'situacao--reprovado': d.situacao === 'Reprovado' }">{{ d.situacao }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="tabela-rolagem" role="region" tabindex="0" aria-label="2026.1">
            <table class="tabela">
              <caption>2026.1</caption>
              <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Disciplina</th>
                  <th scope="col" class="tabela__numero">Carga horária</th>
                  <th scope="col" class="tabela__numero">Nota</th>
                  <th scope="col" class="tabela__numero">Frequência</th>
                  <th scope="col">Situação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="d in historicoAnterior" :key="d.codigo">
                  <td>{{ caixaAlta(d.codigo) }}</td>
                  <td>{{ d.nome }}</td>
                  <td class="tabela__numero">{{ cargaHoraria(d.cargaHoraria) }}</td>
                  <td class="tabela__numero">{{ nota(d.nota) }}</td>
                  <td class="tabela__numero">{{ d.frequencia }}%</td>
                  <td :class="{ 'situacao--reprovado': d.situacao === 'Reprovado' }">{{ d.situacao }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <template #documentos>
          <div class="documentos">
            <div class="documentos__bloco">
              <h3>Documentos disponíveis</h3>
              <ul class="documentos__lista">
                <li class="documentos__item" v-for="doc in documentos" :key="doc.nome">
                  <div>
                    <span class="documentos__nome">{{ doc.nome }}</span>
                    <!-- caixaBaixa: "Até 2 dias úteis" vira "até 2 dias úteis" depois dos dois-pontos. -->
                    <span class="documentos__prazo">Prazo: {{ caixaBaixa(doc.prazo) }}</span>
                  </div>
                  <button type="button" class="btn btn--secundario" :aria-label="'Solicitar ' + doc.nome"
                          @click="solicitarDocumento(doc)">Solicitar</button>
                </li>
              </ul>
            </div>

            <div class="documentos__bloco">
              <h3>Enviar atestado médico</h3>
              <label class="rotulo" for="campo-atestado">Arquivo (PDF, JPG ou PNG, até 5 MB)</label>
              <!-- v-model não funciona em campo de arquivo: o @change entrega o
                   arquivo escolhido e o ref permite limpar o campo depois. -->
              <input type="file" id="campo-atestado" class="campo-arquivo" accept=".pdf,.jpg,.jpeg,.png"
                     aria-describedby="apoio-atestado"
                     ref="campoArquivo"
                     :disabled="envio.enviando"
                     @change="escolherArquivo($event.target.files[0] || null)">
              <p class="texto-apoio" id="apoio-atestado">Envie em até 3 dias úteis após o início do afastamento.</p>
              <button type="button" class="btn btn--primario"
                      :disabled="!envio.arquivo || envio.enviando"
                      @click="enviarArquivo">{{ envio.enviando ? 'Enviando…' : 'Enviar arquivo' }}</button>
              <div class="envio__progresso" v-show="envio.enviando || envio.concluido">
                <BarraProgresso :valor="envio.progresso" rotulo="Envio do atestado" mostrar-percentual />
                <p class="envio__concluido" v-show="envio.concluido">Envio concluído.</p>
              </div>
            </div>

            <div class="documentos__bloco documentos__bloco--largo">
              <h3 id="titulo-solicitacoes">Solicitações recentes</h3>
              <table class="tabela" aria-labelledby="titulo-solicitacoes">
                <thead>
                  <tr>
                    <th scope="col">Documento</th>
                    <th scope="col">Data</th>
                    <th scope="col">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- A chave conta de baixo para cima: com o unshift, as linhas antigas mantêm a chave. -->
                  <tr v-for="(s, indice) in solicitacoes" :key="solicitacoes.length - indice">
                    <td>{{ s.documento }}</td>
                    <td>{{ formatarData(s.data) }}</td>
                    <td>{{ s.situacao }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </Abas>
    </div>
  </section>
</template>

<script>
import Abas from '../componentes/Abas.vue';
import BarraProgresso from '../componentes/BarraProgresso.vue';
import {
  carregarHistorico, carregarDocumentos, carregarSolicitacoes,
  validarContato, contatoIgual, validarAtestado, novaSolicitacao
} from '../servicos/aluno.js';
import { toast } from '../servicos/toast.js';
import { cargaHoraria, nota, formatarData, caixaAlta, caixaBaixa } from '../formatadores.js';

const PASSO_MS = 150;     // um passo do envio simulado a cada 150 ms
const PASSO_PERCENTUAL = 5; // 20 passos de 5%: cerca de 3 s

export default {
  name: 'SecaoPerfil',

  components: { Abas, BarraProgresso },

  // props: o aluno vem do App.vue. Esta seção só lê; não altera a prop.
  props: {
    aluno: { type: Object, required: true }
  },

  // emits: o contato salvo sobe para o App.vue por evento.
  emits: ['salvar-contato'],

  data() {
    return {
      abas: [
        { id: 'dados', titulo: 'Dados pessoais' },
        { id: 'historico', titulo: 'Histórico' },
        { id: 'documentos', titulo: 'Documentos' }
      ],
      rascunho: {},           // cópia editável do contato (preenchida no created)
      alterado: false,        // mostra "Alterações não salvas."
      tentouSalvar: false,    // as mensagens de erro só aparecem depois de tentar salvar
      historico: carregarHistorico(),
      documentos: carregarDocumentos(),
      solicitacoes: carregarSolicitacoes(),
      envio: { arquivo: null, progresso: 0, enviando: false, concluido: false }
    };
  },

  computed: {
    // Recalculado a cada tecla: o objeto { campo: mensagem } dos campos inválidos.
    erros() {
      return validarContato(this.rascunho);
    },

    historicoEmCurso() {
      return this.historico.filter((d) => d.periodo === '2026.2');
    },

    historicoAnterior() {
      return this.historico.filter((d) => d.periodo === '2026.1');
    }
  },

  // created: o formulário começa com uma cópia do contato salvo.
  created() {
    this.rascunho = { ...this.aluno.contato };
    this.intervalo = null; // id do setInterval do envio (não precisa ser reativo)
  },

  // beforeUnmount: se a seção sair da página no meio do envio, o intervalo não fica rodando.
  beforeUnmount() {
    clearInterval(this.intervalo);
  },

  methods: {
    // Formatadores usados no template.
    cargaHoraria,
    nota,
    formatarData,
    caixaAlta,
    caixaBaixa,

    // ---- Dados pessoais ----

    marcarAlteracao() {
      this.alterado = true;
    },

    campoInvalido(campo) {
      return this.tentouSalvar && Boolean(this.erros[campo]);
    },

    limparEstado() {
      this.alterado = false;
      this.tentouSalvar = false;
    },

    salvar() {
      this.tentouSalvar = true;
      if (Object.keys(this.erros).length > 0) {
        toast.mostrar('erro', 'Erro: verifique os campos destacados.');
        return;
      }
      // Editou e voltou ao valor salvo: nada a gravar, e o aviso some.
      if (contatoIgual(this.rascunho, this.aluno.contato)) {
        this.limparEstado();
        toast.mostrar('info', 'Nenhuma alteração para salvar.');
        return;
      }
      // $emit: o App.vue recebe uma cópia do rascunho e atualiza o aluno.
      this.$emit('salvar-contato', { ...this.rascunho });
      this.limparEstado();
      toast.mostrar('sucesso', 'Dados salvos.');
    },

    descartar() {
      this.rascunho = { ...this.aluno.contato };
      this.limparEstado();
      toast.mostrar('info', 'Alterações descartadas.');
    },

    // ---- Documentos ----

    // unshift: a solicitação nova entra no topo da tabela.
    solicitarDocumento(documento) {
      this.solicitacoes.unshift(novaSolicitacao(documento.nome, documento.situacaoAoSolicitar));
      toast.mostrar('sucesso', 'Solicitação registrada: ' + documento.nome + '.');
    },

    // Chamado pelo @change do campo de arquivo. Escolher outro arquivo esconde
    // o bloco do progresso de um envio anterior.
    escolherArquivo(arquivo) {
      this.envio.arquivo = arquivo;
      this.envio.progresso = 0;
      this.envio.concluido = false;
    },

    // Esvazia o campo nativo, para o mesmo arquivo poder ser escolhido de novo.
    limparCampoArquivo() {
      this.envio.arquivo = null;
      this.$refs.campoArquivo.value = '';
    },

    concluir() {
      this.envio.enviando = false;
      this.envio.concluido = true;
      this.limparCampoArquivo();
      this.solicitacoes.unshift(novaSolicitacao('Atestado médico', 'Recebido'));
      toast.mostrar('sucesso', 'Arquivo enviado.');
    },

    // Um passo do envio simulado.
    avancar() {
      this.envio.progresso += PASSO_PERCENTUAL;
      if (this.envio.progresso >= 100) {
        clearInterval(this.intervalo);
        this.intervalo = null;
        this.concluir();
      }
    },

    enviarArquivo() {
      const erro = validarAtestado(this.envio.arquivo);

      if (erro === 'formato') {
        toast.mostrar('erro', 'Erro: formato inválido. Use PDF, JPG ou PNG.');
        this.limparCampoArquivo();
        return;
      }
      if (erro === 'tamanho') {
        toast.mostrar('erro', 'Erro: o arquivo passa de 5 MB.');
        this.limparCampoArquivo();
        return;
      }

      this.envio.enviando = true;
      this.intervalo = setInterval(this.avancar, PASSO_MS);
    }
  }
};
</script>
