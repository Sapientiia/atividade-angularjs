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
| Vue (`vue/`) | Vue 3 com Options API e Vite; sem biblioteca de componentes |
| Testes | Vitest + jsdom; `angular-mocks` na raiz e `@vue/test-utils` em `vue/` |

## Estrutura de pastas

```
atividade-angularjs/
├── index.html              # página única da versão AngularJS
├── app/
│   ├── app.js              # módulo principal "portal", que reúne os demais
│   ├── filtros/            # filtros próprios (carga horária, moeda, nota)
│   ├── servicos/           # services/factories com os dados e as regras
│   ├── componentes/        # uma pasta por diretiva (.directive.js + .html)
│   └── controladores/      # um controlador por seção da página
├── css/estilo.css          # estilo único da versão AngularJS
├── testes/                 # testes da versão AngularJS (Vitest)
├── vue/                    # desafio extra em Vue 3, projeto independente
├── .devcontainer/          # configuração do GitHub Codespaces
├── package.json            # só as ferramentas de teste da raiz
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

Depois, abra http://localhost:5173.

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
