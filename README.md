# Atividade AngularJS e Vue.js — Portal do Aluno

Portal do Aluno da **Faculdade Itapuã**, uma instituição fictícia, feito para a
disciplina *Tópicos Avançados em Engenharia de Software* (UCSAL, 2026.2).
A mesma aplicação existe em duas versões:

- **AngularJS 1.8.3**, na raiz do repositório: a atividade principal, com
  arquitetura modular e os seis componentes (acordeão, paginação, barra de
  progresso, abas, menu suspenso e toast) implementados como diretivas.
- **Vue 3**, na pasta `vue/`: o desafio extra, com os mesmos componentes
  escritos como componentes `.vue`.

Todo o conteúdo (aluna, disciplinas, notas, documentos, contatos) é fictício e
tem fins apenas acadêmicos.

## Tecnologias

| Versão | Tecnologias |
|---|---|
| AngularJS (raiz) | AngularJS 1.8.3 via CDN do jsDelivr, com `integrity` (SRI); sem build e sem outras bibliotecas; CSS próprio em `css/estilo.css` |
| Vue (`vue/`) | Vue 3 com Options API e Vite; sem biblioteca de componentes; `vue` é a única dependência de execução |
| Testes | Vitest + jsdom; `angular-mocks` na raiz e `@vue/test-utils` em `vue/` |

As duas versões usam o mesmo CSS: `vue/src/estilo.css` é uma cópia idêntica de
`css/estilo.css`.

## Onde cada componente aparece

| Componente | Local | Uso |
|---|---|---|
| Menu suspenso (instância 1) | Barra de navegação, à direita | Menu da conta: "Meu perfil", "Ajuda", "Sair" |
| Menu suspenso (instância 2) | Disciplinas, barra de filtros | Filtro do catálogo por semestre |
| Paginação | Disciplinas, abaixo da lista | 5 disciplinas por página |
| Barra de progresso (instância 1) | Painel, cartão "Progresso do curso" | Carga horária cumprida / total |
| Barra de progresso (instância 2) | Perfil, aba Documentos | Envio simulado do atestado médico |
| Abas | Perfil | Dados pessoais, Histórico, Documentos |
| Acordeão | Ajuda | Perguntas frequentes da secretaria |
| Toast | Região fixa no topo, centralizada | Retorno das ações de todas as seções |

## Estrutura de pastas

```
atividade-angularjs/
├── index.html                    # página única da versão AngularJS
├── app/
│   ├── app.js                    # módulo principal "portal", que reúne os demais
│   ├── filtros/                  # módulo portal.filtros: cargaHoraria, moeda, nota
│   ├── servicos/                 # módulo portal.servicos: disciplinas, aluno, secretaria, toast
│   ├── componentes/              # módulo portal.componentes: uma pasta por diretiva
│   │   ├── acordeao/             #   (.directive.js + .html)
│   │   ├── paginacao/
│   │   ├── barra-progresso/
│   │   ├── abas/                 #   abas + aba
│   │   ├── menu-suspenso/
│   │   ├── toast/                #   toastContainer (exibe a fila do ToastService)
│   │   └── seletor-arquivo/      #   diretiva de atributo para o campo de arquivo
│   └── controladores/            # módulo portal.controladores: um controlador por seção
├── css/estilo.css                # estilo único da versão AngularJS
├── testes/                       # testes da versão AngularJS (Vitest + angular-mocks)
├── vue/                          # desafio extra em Vue 3, projeto independente
│   ├── index.html
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.js               # cria a aplicação e monta o App.vue
│   │   ├── App.vue               # componente raiz
│   │   ├── componentes/          # os 6 componentes (.vue)
│   │   ├── secoes/               # navbar e as quatro seções da página
│   │   ├── servicos/             # regras de negócio e o serviço global de toast
│   │   ├── dados/                # dados fictícios
│   │   ├── formatadores.js       # funções que substituem os filtros do AngularJS
│   │   └── estilo.css            # cópia de ../css/estilo.css
│   └── testes/                   # testes da versão Vue (Vitest + @vue/test-utils)
├── .devcontainer/                # configuração do GitHub Codespaces
├── package.json                  # só as ferramentas de teste da raiz
└── vitest.config.js
```

> **Atenção:** a versão AngularJS precisa ser aberta por um servidor HTTP.
> Abrir o `index.html` direto do disco (`file://`) não funciona, porque as
> diretivas carregam seus templates com `templateUrl`, e o navegador bloqueia
> essas leituras fora de HTTP. Use um dos comandos abaixo.

## Como abrir no GitHub Codespaces

O repositório tem a pasta `.devcontainer/`, então o ambiente já vem pronto,
com Node.js 22 e o VS Code em português.

1. Na página do repositório no GitHub, clique em **Code**.
2. Abra a aba **Codespaces** e clique em **Create codespace on main**.
3. Aguarde a criação. As dependências de teste são instaladas sozinhas
   (`npm install` na raiz e em `vue/`).
4. Ao conectar, a versão AngularJS sobe automaticamente na porta 3000
   (`npx --yes serve@14.2.8 -l 3000 .`) e o navegador abre a porta
   encaminhada ("Portal AngularJS"). Se não abrir, use a aba **Portas** do
   VS Code e clique no endereço da porta 3000.
5. Para a versão Vue, abra um **segundo terminal** e rode:

   ```bash
   cd vue && npm run dev
   ```

   O Vite usa a porta 5173 ("Portal Vue (Vite)"), que também abre sozinha.

## Como executar localmente

Requisito: **Node.js 22 LTS** (22.22.2 ou mais recente). O Codespaces já vem
com essa versão.

Versão AngularJS, na raiz do repositório:

```bash
npm start
# ou, sem instalar nada:
npx --yes serve@14.2.8 -l 3000 .
```

Depois, abra http://localhost:3000.

Versão Vue:

```bash
cd vue
npm install
npm run dev
```

Depois, abra http://localhost:5173. Para gerar a versão de produção, use
`npm run build` (a saída fica em `vue/dist/`, fora do controle de versão).

## Como rodar os testes

Versão AngularJS (na raiz):

```bash
npm install
npm test
```

Versão Vue:

```bash
cd vue
npm install
npm test
```

### Aviso `deprecated` no `npm install` da raiz

O `npm install` da raiz mostra um aviso `deprecated` do pacote `angular`, e o
`npm audit` aponta vulnerabilidades conhecidas sem correção. Isso é esperado:
o suporte oficial ao AngularJS terminou e não haverá novas versões. O pacote
é usado só pelos testes, na mesma versão 1.8.3 que a página carrega do CDN;
a página não lê nada de `node_modules/`.

## Conceitos exigidos → onde estão no código (AngularJS)

Os caminhos são relativos à raiz do repositório e os números indicam a linha
(aproximada) em que o conceito aparece.

| Conceito | Onde está |
|---|---|
| Módulo principal `app.js` | `app/app.js:13` declara o módulo `portal` com as quatro dependências; cada camada cria o seu módulo em `app/filtros/filtros.module.js:5`, `app/servicos/servicos.module.js:5`, `app/componentes/componentes.module.js:7` e `app/controladores/controladores.module.js:5`; o bootstrap é o `ng-app="portal"` de `index.html:16` |
| Diretivas (os 6 componentes) | `acordeao.directive.js:10`, `paginacao.directive.js:11`, `barra-progresso.directive.js:8`, `abas.directive.js:15` (e `aba` na linha 95), `menu-suspenso.directive.js:12`, `toast-container.directive.js:9`, todas em `app/componentes/<nome>/` |
| Diretiva de atributo `seletorArquivo` | `app/componentes/seletor-arquivo/seletor-arquivo.directive.js:13`; uso em `index.html:344` |
| Binding `<` (dado de mão única) | `paginacao.directive.js:15-16`, `barra-progresso.directive.js:12`, `acordeao.directive.js:14`, `menu-suspenso.directive.js:18`; opcional (`<?`) em `barra-progresso.directive.js:14`, `menu-suspenso.directive.js:19` e `seletor-arquivo.directive.js:17` |
| Binding `@` (texto) | `paginacao.directive.js:18`, `menu-suspenso.directive.js:17`, `abas.directive.js:20` e `:101` |
| Binding `&` (callback) | `paginacao.directive.js:17` (usado em `index.html:164`), `menu-suspenso.directive.js:20` (usado em `index.html:111`), `seletor-arquivo.directive.js:18` (usado em `index.html:346`) |
| Transclusão (`abas` + `aba`) | `abas.directive.js:18` e `:99` (`transclude`), `:98` (`require: '^^abas'`); `ng-transclude` em `abas.html:12` e `aba.html:4` |
| Controladores com `controllerAs` | `ContaController as conta` (`index.html:19`), `PainelController as painel` (`:48`), `CatalogoController as catalogo` (`:94`), `PerfilController as perfil` (`:170`), `AjudaController as ajuda` (`:384`); registros em `app/controladores/*.controller.js` |
| `$scope`: estado interno das diretivas | `indiceAberto` (`acordeao.directive.js:20`), `paginas` (`paginacao.directive.js:23`), `percentual` (`barra-progresso.directive.js:18`), `indiceAtivo` (`abas.directive.js:31`), `aberto` (`menu-suspenso.directive.js:28`), `toasts` (`toast-container.directive.js:17`) |
| `$scope` no `controller` de `abas` | `abas.directive.js:25` |
| `$scope.$watch` | `paginacao.directive.js:26`, `barra-progresso.directive.js:22`, `seletor-arquivo.directive.js:34`, `perfil.controller.js:84` |
| `$scope.$apply` (eventos nativos) | `menu-suspenso.directive.js:137` (clique fora), `seletor-arquivo.directive.js:25` (`change` do arquivo) |
| `$scope.$on('$destroy')` | `perfil.controller.js:130`, `menu-suspenso.directive.js:145`, `seletor-arquivo.directive.js:41`, `abas.directive.js:111` |
| `ng-model` (two-way binding) | Busca do catálogo em `index.html:104`; campos editáveis do perfil em `index.html:211`, `220`, `229`, `239`, `244` e `249` (`perfil.rascunho.*`) |
| Factories | `DisciplinasService` (`disciplinas.service.js:9`), `AlunoService` (`aluno.service.js:9`), `ToastService` (`toast.service.js:10`), em `app/servicos/` |
| Service (`.service`) | `SecretariaService` em `app/servicos/secretaria.service.js:9` |
| Injeção de um serviço em outro | `AlunoService` recebe `DisciplinasService` e `$filter` em `aluno.service.js:10` |
| Filtros próprios | `cargaHoraria` (`app/filtros/carga-horaria.filter.js:6`), `moeda` (`moeda.filter.js:6`), `nota` (`nota.filter.js:6`); uso em `index.html:62`, `68` e `263` |
| Filtros nativos nos templates | `orderBy` (`index.html:76`), `date` (`:69`, `:77`), `limitTo` (`:139`), `uppercase` (`:140`), `filter` (`:281`, `:307`), `lowercase` (`:329`) |
| Filtros nativos via `$filter` | `catalogo.controller.js:45-48` (`filter` e `orderBy`), `aluno.service.js:68` (`date`) |
| `ng-click` | `index.html:153` (Solicitar matrícula), `:256` (Descartar alterações), `:332` (Solicitar documento), `:351` (Enviar arquivo); nos componentes: `acordeao.html:7`, `paginacao.html:6`, `13` e `17`, `abas.html:9`, `menu-suspenso.html:5` e `18`, `toast-container.html:25` |
| `ng-change` | `index.html:104` (busca) e `:211`, `220`, `229`, `239`, `244`, `249` (campos do perfil) |
| Outros eventos | `ng-submit` em `index.html:204`; `ng-keydown` em `abas.html:9` e `menu-suspenso.html:5` e `18`; `ng-disabled` em `paginacao.html:6` e `index.html:151` |
| `ng-repeat` | `index.html:76` (prazos), `:139` (catálogo), `:281` e `:307` (histórico); `acordeao.html:2`, `paginacao.html:9`, `abas.html:5`, `menu-suspenso.html:15`, `toast-container.html:4` |
| `$timeout` | `toast.service.js:44` (duração) e `:60` (saída), `menu-suspenso.directive.js:52` (foco ao abrir) |
| `$interval` | `perfil.controller.js:124` (envio simulado do atestado) |

## Conceitos exigidos → onde estão no código (Vue)

Os caminhos são relativos a `vue/src/`.

| Conceito | Onde está |
|---|---|
| `App.vue` orquestrando | `main.js:7` monta o `App.vue`; `App.vue:12-30` compõe a navbar, as quatro seções e o `ToastContainer`, registrados em `App.vue:46` |
| `props` com `type`, `required` e `default` | `componentes/Paginacao.vue:40-44`, `componentes/BarraProgresso.vue:26-30`; também em `Acordeao.vue:45`, `Abas.vue:46`, `MenuSuspenso.vue:53`, `secoes/SecaoPainel.vue:66`, `secoes/SecaoPerfil.vue:244` e `secoes/BarraNavegacao.vue:41` |
| `data` | `componentes/Acordeao.vue:51` (`indiceAberto`), `Abas.vue:52`, `MenuSuspenso.vue:63`, `App.vue:49` (`aluno`), `secoes/SecaoCatalogo.vue:103` |
| `computed` | `Paginacao.vue:52` (`paginas`), `BarraProgresso.vue:36` (`percentual`), `ToastContainer.vue:51`; catálogo em `SecaoCatalogo.vue:119`, `127`, `132` e `137`; Painel em `SecaoPainel.vue:76`; Perfil em `SecaoPerfil.vue:270` (`erros`) e `274` (histórico por período) |
| `methods` | `Paginacao.vue:61`, `App.vue:61`, `SecaoPerfil.vue:294` |
| `v-on` / `@` | `@click` em `Paginacao.vue:18`, `25` e `29`; `@click` e `@keydown` em `MenuSuspenso.vue:16`; `@input` em `SecaoCatalogo.vue:17`; `@submit.prevent` em `SecaoPerfil.vue:46`; `@change` em `SecaoPerfil.vue:187` |
| `emits` / `$emit('mudar-pagina')` | `Paginacao.vue:47` e `:68`; ouvido em `SecaoCatalogo.vue:74` |
| `emits` / `$emit('selecionar')` | `MenuSuspenso.vue:60` e `:130`; ouvido em `BarraNavegacao.vue:25` e `SecaoCatalogo.vue:23` |
| `emits` / `$emit('salvar-contato')` | `SecaoPerfil.vue:249` e `:330`; ouvido em `App.vue:19` |
| `created` | `App.vue:57`, `SecaoCatalogo.vue:143`, `SecaoPerfil.vue:284`, `Acordeao.vue:59`, `Abas.vue:59`, `MenuSuspenso.vue:71` |
| `mounted` | `MenuSuspenso.vue:79` (registra o clique fora no `document`) |
| `beforeUnmount` | `MenuSuspenso.vue:84` (remove o listener), `SecaoPerfil.vue:290` (cancela o intervalo do envio) |
| `v-model` | Busca em `SecaoCatalogo.vue:17`; campos do perfil com `v-model.trim` em `SecaoPerfil.vue:54`, `63`, `72`, `81`, `86` e `91` |
| Slots nomeados | `<slot :name="aba.id">` em `componentes/Abas.vue:33`; preenchidos por `<template #dados>`, `#historico` e `#documentos` em `SecaoPerfil.vue:17`, `104` e `161` |
| Serviço global de toast com `reactive()` | `servicos/toast.js:14` (estado reativo) e `:21` (objeto `toast` exportado); lido por `ToastContainer.vue:51-54` |
| Formatadores no lugar dos filtros | `formatadores.js:10` (`cargaHoraria`), `18` (`moeda`), `26` (`nota`), `36` (`formatarData`), `45` (`caixaAlta`), `50` (`caixaBaixa`); uso em `SecaoCatalogo.vue:51` e `54` |
| `$nextTick`, `setTimeout` e `setInterval` | `$nextTick` em `Abas.vue:95` e `MenuSuspenso.vue:102`; `setTimeout` em `servicos/toast.js:32` e `:46`; `setInterval` em `SecaoPerfil.vue:396` |

## Comparação AngularJS × Vue

| Ponto | AngularJS 1.8 | Vue 3 |
|---|---|---|
| Entrada de dados no componente | Bindings `<` e `@` no `scope` isolado da diretiva | `props`, com `type`, `required` e `default` |
| Saída de eventos | Binding `&`: o pai passa uma expressão, chamada com `{ pagina: n }` | `$emit('mudar-pagina', n)`, ouvido com `@mudar-pagina` |
| Estado interno | Propriedades no `$scope` da diretiva | `data()` |
| Valores derivados | `$watch` recalcula o valor quando o binding muda | `computed`, recalculado sozinho |
| Conteúdo vindo do pai | Transclusão: `abas` + `aba` com `transclude` e `require: '^^abas'` | Slots nomeados (`<slot :name>` e `<template #nome>`) |
| Formatação na tela | Filtros (`{{ valor \| moeda }}`) | Funções formatadoras chamadas no template (`{{ moeda(valor) }}`) |
| Dados e regras de negócio | Services/factories com injeção de dependência | Módulos ES importados onde são usados |
| Temporizadores e atualização da tela | `$timeout` e `$interval` (já rodam o digest); `$apply` para eventos nativos | `setTimeout` e `setInterval`; `$nextTick` para esperar o DOM atualizar |
| Campo de arquivo | Diretiva de atributo `seletorArquivo`, porque `ng-model` não funciona em `type="file"` | `@change` no campo, com `ref` para limpá-lo |
| Ciclo de vida | `$scope.$on('$destroy')` para limpeza | `created`, `mounted` e `beforeUnmount` |
| Execução | Página sem build: um servidor estático basta | Vite em desenvolvimento e `npm run build` para produção |

## Acessibilidade

- Idioma `pt-BR`, um único `h1` e um `h2` por seção, ligados às seções por
  `aria-labelledby`; link "Ir para o conteúdo" como primeiro item do teclado.
- Foco sempre visível (`:focus-visible`) e navegação completa por teclado.
- Acordeão: cada cabeçalho é um botão com `aria-expanded` e `aria-controls`.
- Abas: `role="tablist"`, `tab` e `tabpanel`, `aria-selected`, setas do
  teclado para trocar de aba e Home/End para a primeira e a última.
- Menu suspenso: `aria-haspopup` e `aria-expanded` no botão; setas, Home e End
  entre as opções; Esc fecha e devolve o foco ao botão.
- Barra de progresso: `role="progressbar"` com `aria-valuenow` e nome
  acessível próprio.
- Paginação: `nav` com `aria-label` e `aria-current="page"` na página atual.
- Toast: região `role="status"` com `aria-live="polite"`, presente desde o
  carregamento para o leitor de tela anunciar cada mensagem.
- Formulário do perfil: todos os campos com `label`, erros ligados por
  `aria-describedby` e marcados com `aria-invalid`.
- Quem ativa a opção de reduzir movimento no sistema não vê as transições.

## Responsividade

O layout é fluido e usa os pontos de quebra do Bootstrap 4 (576, 768 e
992 px), reproduzidos em CSS próprio. Nas larguras de referência:

| Largura | Comportamento |
|---|---|
| 375 px | cabeçalho em duas linhas; Painel em uma coluna; cada disciplina do catálogo vira um bloco "rótulo valor"; o histórico rola dentro da própria tabela, sem rolar a página |
| 768 px | cabeçalho em uma linha; Painel e catálogo em duas colunas; formulário do perfil em duas colunas |
| 1280 px | Painel em três colunas; catálogo como tabela completa |
