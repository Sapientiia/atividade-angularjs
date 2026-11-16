<!--
  Seção SecaoCatalogo: catálogo de disciplinas com busca, filtro de semestre,
  paginação e solicitação de matrícula.
  Equivale ao <section ng-controller="CatalogoController as catalogo"> da versão AngularJS.
-->
<template>
  <section id="disciplinas" class="secao" aria-labelledby="titulo-disciplinas">
    <div class="container">
      <h2 id="titulo-disciplinas" tabindex="-1">Disciplinas ofertadas — 2027.1</h2>

      <div class="filtros">
        <div class="filtros__busca">
          <label class="rotulo" for="busca-disciplina">Buscar disciplina</label>
          <!-- v-model: two-way binding com "termo" (equivale ao ng-model).
               @input: a cada tecla, volta à página 1 (equivale ao ng-change). -->
          <input type="search" id="busca-disciplina" class="campo" placeholder="Código ou nome"
                 v-model="termo" @input="aoBuscar">
        </div>
        <!-- Segunda instância do menu suspenso: marca a opção vigente e avisa a escolha por evento. -->
        <MenuSuspenso :rotulo="'Semestre: ' + semestre.rotulo"
                      :opcoes="opcoesSemestre"
                      :selecionada="semestre"
                      @selecionar="filtrarPorSemestre" />
      </div>

      <p class="catalogo__resumo" v-show="resumo.quantidade > 0">
        Solicitações:
        <strong>{{ resumo.quantidade }} {{ resumo.quantidade === 1 ? 'disciplina' : 'disciplinas' }}</strong>
        · {{ resumo.creditos }} créditos · {{ moeda(resumo.valorMensal) }} por mês
      </p>

      <!-- Uma única tabela: a partir de 992 px aparece como tabela; abaixo
           disso, o CSS transforma cada linha num bloco "rótulo valor" com o
           texto de data-rotulo. -->
      <table class="tabela tabela--catalogo" aria-labelledby="titulo-disciplinas"
             v-show="filtradas.length > 0">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Disciplina</th>
            <th scope="col">Semestre</th>
            <th scope="col" class="tabela__numero">Carga horária</th>
            <th scope="col">Turno</th>
            <th scope="col" class="tabela__numero">Vagas</th>
            <th scope="col" class="tabela__numero">Valor mensal</th>
            <th scope="col"><span class="visualmente-oculto">Ação</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="disciplina in disciplinasDaPagina" :key="disciplina.codigo">
            <td class="tabela__codigo">{{ caixaAlta(disciplina.codigo) }}</td>
            <td class="tabela__nome">{{ disciplina.nome }}</td>
            <td data-rotulo="Semestre">{{ disciplina.semestre }}</td>
            <td class="tabela__numero" data-rotulo="Carga horária">{{ cargaHoraria(disciplina.cargaHoraria) }}</td>
            <td data-rotulo="Turno">{{ disciplina.turno }}</td>
            <td class="tabela__numero" data-rotulo="Vagas">{{ disciplina.vagas }}</td>
            <td class="tabela__numero" data-rotulo="Valor mensal">{{ moeda(disciplina.valorMensal) }}</td>
            <td class="tabela__acao">
              <!-- O aria-label diferencia os botões iguais para o leitor de tela;
                   "Solicitada" e "Sem vagas" ficam só com o texto visível (null remove o atributo). -->
              <button type="button" class="btn btn--secundario"
                      :disabled="disciplina.solicitada || disciplina.vagas === 0"
                      :aria-label="disciplina.solicitada || disciplina.vagas === 0 ? null : 'Solicitar matrícula em ' + caixaAlta(disciplina.codigo) + ' – ' + disciplina.nome"
                      @click="solicitar(disciplina)">{{ rotuloDoBotao(disciplina) }}</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p class="catalogo__vazio" v-show="filtradas.length === 0">Nenhuma disciplina encontrada.</p>

      <!-- A paginação recebe o total e a página por props e avisa a troca pelo evento @mudar-pagina. -->
      <Paginacao :total-paginas="totalPaginas" :pagina-atual="pagina"
                 rotulo="Paginação do catálogo" @mudar-pagina="irPara"
                 v-show="totalPaginas > 0" />
    </div>
  </section>
</template>

<script>
import MenuSuspenso from '../componentes/MenuSuspenso.vue';
import Paginacao from '../componentes/Paginacao.vue';
import { carregarCatalogo, solicitarMatricula, resumoSolicitacoes } from '../servicos/disciplinas.js';
import { toast } from '../servicos/toast.js';
import { moeda, cargaHoraria, caixaAlta } from '../formatadores.js';

// O valor de cada opção é comparado com o campo "semestre" da disciplina;
// null em "Todos os semestres" desliga o filtro.
const OPCOES_SEMESTRE = [
  { rotulo: 'Todos os semestres', valor: null },
  { rotulo: '5º semestre', valor: '5º' },
  { rotulo: '7º semestre', valor: '7º' },
  { rotulo: '8º semestre', valor: '8º' },
  { rotulo: 'Optativas', valor: 'Optativa' }
];

export default {
  name: 'SecaoCatalogo',

  components: { MenuSuspenso, Paginacao },

  // data: estado próprio da seção (só ela usa o catálogo).
  data() {
    return {
      disciplinas: [],
      opcoesSemestre: OPCOES_SEMESTRE,
      termo: '',                       // ligado ao campo de busca por v-model
      semestre: OPCOES_SEMESTRE[0],    // opção marcada no menu de filtro
      pagina: 1,
      porPagina: 5
    };
  },

  // computed: valores derivados do data. O Vue recalcula cada um só quando
  // algo de que ele depende muda (termo, semestre, pagina, disciplinas).
  computed: {
    // Combina o semestre (comparação exata) e a busca (só código e nome) e
    // ordena pelo código. Equivale aos filtros filter e orderBy do AngularJS.
    filtradas() {
      const termo = this.termo.toLowerCase();
      return this.disciplinas
        .filter((d) => !this.semestre.valor || d.semestre === this.semestre.valor)
        .filter((d) => d.codigo.includes(termo) || d.nome.toLowerCase().includes(termo))
        .sort((a, b) => a.codigo.localeCompare(b.codigo));
    },

    totalPaginas() {
      return Math.ceil(this.filtradas.length / this.porPagina);
    },

    // Fatia da página atual (equivale ao limitTo do AngularJS).
    disciplinasDaPagina() {
      const inicio = (this.pagina - 1) * this.porPagina;
      return this.filtradas.slice(inicio, inicio + this.porPagina);
    },

    resumo() {
      return resumoSolicitacoes(this.disciplinas);
    }
  },

  // created: carrega o catálogo antes da primeira renderização.
  created() {
    this.disciplinas = carregarCatalogo();
  },

  methods: {
    // Formatadores usados no template (o Vue 3 não tem filtros).
    moeda,
    cargaHoraria,
    caixaAlta,

    // Chamado pelo @input do campo de busca, a cada tecla.
    aoBuscar() {
      this.pagina = 1;
    },

    // Ouvinte do evento "selecionar" do MenuSuspenso.
    filtrarPorSemestre(opcao) {
      this.semestre = opcao;
      this.pagina = 1;
    },

    // Ouvinte do evento "mudar-pagina" da Paginacao: é aqui que a página muda de fato.
    irPara(pagina) {
      this.pagina = pagina;
    },

    solicitar(disciplina) {
      if (solicitarMatricula(disciplina)) {
        toast.mostrar('sucesso',
          'Matrícula solicitada: ' + caixaAlta(disciplina.codigo) + ' – ' + disciplina.nome + '.');
      }
    },

    rotuloDoBotao(disciplina) {
      if (disciplina.solicitada) {
        return 'Solicitada';
      }
      if (disciplina.vagas === 0) {
        return 'Sem vagas';
      }
      return 'Solicitar matrícula';
    }
  }
};
</script>
