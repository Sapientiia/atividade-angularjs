import { describe, it, expect, beforeEach, vi } from 'vitest';
import { criarInjetor } from './auxiliares.js';

describe('CatalogoController', () => {
  let catalogo;
  let ToastService;

  beforeEach(() => {
    const $injector = criarInjetor();
    ToastService = $injector.get('ToastService');
    catalogo = $injector.get('$controller')('CatalogoController', {
      $scope: $injector.get('$rootScope').$new()
    });
  });

  function buscar(termo) {
    catalogo.termo = termo;
    catalogo.aoBuscar();
  }

  function opcao(rotulo) {
    return catalogo.opcoesSemestre.find((item) => item.rotulo === rotulo);
  }

  function codigos() {
    return catalogo.filtradas.map((disciplina) => disciplina.codigo);
  }

  it('começa com as 16 disciplinas em ordem de código, em 4 páginas', () => {
    expect(catalogo.filtradas).toHaveLength(16);
    expect(codigos()[0]).toBe('engs503');
    expect(codigos()[15]).toBe('opt105');
    expect(catalogo.totalPaginas).toBe(4);
    expect(catalogo.pagina).toBe(1);
    expect(catalogo.semestre.rotulo).toBe('Todos os semestres');
  });

  it('a busca compara só código e nome, sem diferenciar maiúsculas', () => {
    buscar('banco');
    expect(codigos()).toEqual(['engs503']);

    buscar('ENGS8');
    expect(catalogo.filtradas).toHaveLength(5);

    buscar('noturno');
    expect(catalogo.filtradas).toHaveLength(0);
    expect(catalogo.totalPaginas).toBe(0);
  });

  it('o filtro "Optativas" deixa 5 disciplinas em 1 página', () => {
    catalogo.filtrarPorSemestre(opcao('Optativas'));
    expect(catalogo.filtradas).toHaveLength(5);
    expect(catalogo.totalPaginas).toBe(1);
  });

  it('"7º semestre" com a busca "software" combina os dois e dá 2 disciplinas', () => {
    catalogo.filtrarPorSemestre(opcao('7º semestre'));
    buscar('software');
    expect(codigos()).toEqual(['engs701', 'engs704']);
  });

  it('buscar e trocar o semestre voltam à página 1', () => {
    catalogo.irPara(3);
    expect(catalogo.inicioDaPagina()).toBe(10);
    buscar('engs');
    expect(catalogo.pagina).toBe(1);

    catalogo.irPara(2);
    catalogo.filtrarPorSemestre(opcao('8º semestre'));
    expect(catalogo.pagina).toBe(1);
  });

  it('solicitar ENGS701 atualiza o resumo e mostra o T-03 na fila de toasts', () => {
    const disciplina = catalogo.filtradas.find((item) => item.codigo === 'engs701');
    catalogo.solicitar(disciplina);

    expect(disciplina.vagas).toBe(34);
    expect(catalogo.rotuloDoBotao(disciplina)).toBe('Solicitada');
    expect(catalogo.resumo).toEqual({ quantidade: 1, creditos: 3, valorMensal: 337.2 });
    expect(ToastService.fila).toHaveLength(1);
    expect(ToastService.fila[0].tipo).toBe('sucesso');
    expect(ToastService.fila[0].mensagem).toBe('Matrícula solicitada: ENGS701 – Qualidade de Software.');
  });

  it('rótulos do botão: "Sem vagas" para ENGS703 e "Solicitar matrícula" para as demais', () => {
    const semVagas = catalogo.filtradas.find((item) => item.codigo === 'engs703');
    expect(catalogo.rotuloDoBotao(semVagas)).toBe('Sem vagas');
    catalogo.solicitar(semVagas);
    expect(ToastService.fila).toHaveLength(0);
    expect(catalogo.rotuloDoBotao(catalogo.filtradas[0])).toBe('Solicitar matrícula');
  });
});

describe('PerfilController', () => {
  let perfil;
  let escopo;
  let $interval;
  let ToastService;
  let AlunoService;

  beforeEach(() => {
    const $injector = criarInjetor();
    $interval = $injector.get('$interval');
    ToastService = $injector.get('ToastService');
    AlunoService = $injector.get('AlunoService');
    escopo = $injector.get('$rootScope').$new();
    // "as perfil" publica o controlador em escopo.perfil, como o ng-controller da página.
    perfil = $injector.get('$controller')('PerfilController as perfil', { $scope: escopo });
    // Na página, o <form name="perfil.formDados"> publica o formulário aqui.
    perfil.formDados = { $invalid: false, $submitted: false, $setPristine: vi.fn() };
  });

  // Na página, o seletor-arquivo chama o callback dentro de $apply; o digest
  // roda o $watch do arquivo antes de a aluna clicar em "Enviar arquivo".
  function escolher(arquivo) {
    perfil.escolherArquivo(arquivo);
    escopo.$digest();
  }

  function ultimoToast() {
    const toast = ToastService.fila[ToastService.fila.length - 1];
    return toast.tipo + ': ' + toast.mensagem;
  }

  it('salvar sem mudança mostra o T-02 e esconde o aviso', () => {
    perfil.marcarAlteracao();
    perfil.salvar();
    expect(ultimoToast()).toBe('info: Nenhuma alteração para salvar.');
    expect(perfil.alterado).toBe(false);
    expect(perfil.formDados.$setPristine).toHaveBeenCalled();
  });

  it('salvar com mudança grava no serviço e mostra o T-01; inválido mostra o T-04', () => {
    perfil.rascunho.telefone = '(71) 91234-5678';
    perfil.marcarAlteracao();
    perfil.salvar();
    expect(ultimoToast()).toBe('sucesso: Dados salvos.');
    expect(AlunoService.obterAluno().contato.telefone).toBe('(71) 91234-5678');

    perfil.formDados.$invalid = true;
    perfil.salvar();
    expect(ultimoToast()).toBe('erro: Erro: verifique os campos destacados.');
  });

  it('descartar restaura o rascunho e mostra o T-05', () => {
    perfil.rascunho.cep = '00000-000';
    perfil.marcarAlteracao();
    perfil.descartar();
    expect(perfil.rascunho.cep).toBe('41600-000');
    expect(perfil.alterado).toBe(false);
    expect(ultimoToast()).toBe('info: Alterações descartadas.');
  });

  it('solicitar um documento insere a linha no topo e mostra o T-06', () => {
    perfil.solicitarDocumento(perfil.documentos[1]);
    expect(perfil.solicitacoes[0].documento).toBe('Histórico escolar');
    expect(perfil.solicitacoes[0].situacao).toBe('Em análise');
    expect(ultimoToast()).toBe('sucesso: Solicitação registrada: Histórico escolar.');
  });

  it('envio válido com $interval.flush(3000) chega a 100, mostra o T-07 e insere "Atestado médico"', () => {
    escolher({ name: 'atestado.png', size: 1024 * 1024 });
    perfil.enviarArquivo();
    expect(perfil.envio.enviando).toBe(true);

    $interval.flush(1500);
    expect(perfil.envio.progresso).toBe(50);

    $interval.flush(1500);
    expect(perfil.envio.progresso).toBe(100);
    expect(perfil.envio.enviando).toBe(false);
    expect(perfil.envio.concluido).toBe(true);
    expect(perfil.envio.arquivo).toBeNull();
    expect(ultimoToast()).toBe('sucesso: Arquivo enviado.');
    expect(perfil.solicitacoes[0]).toMatchObject({ documento: 'Atestado médico', situacao: 'Recebido' });
  });

  it('formato e tamanho inválidos mostram T-08 e T-09 e limpam o arquivo', () => {
    perfil.escolherArquivo({ name: 'atestado.docx', size: 1000 });
    perfil.enviarArquivo();
    expect(ultimoToast()).toBe('erro: Erro: formato inválido. Use PDF, JPG ou PNG.');
    expect(perfil.envio.arquivo).toBeNull();

    perfil.escolherArquivo({ name: 'atestado.pdf', size: 6 * 1024 * 1024 });
    perfil.enviarArquivo();
    expect(ultimoToast()).toBe('erro: Erro: o arquivo passa de 5 MB.');
    expect(perfil.envio.enviando).toBe(false);
  });

  it('controllerAs publica o controlador no $scope, e o $watch zera o envio ao chegar outro arquivo', () => {
    expect(escopo.perfil).toBe(perfil);
    perfil.escolherArquivo({ name: 'atestado.png', size: 1000 });
    escopo.$digest();
    perfil.enviarArquivo();
    $interval.flush(3000);
    escopo.$digest();
    expect(perfil.envio.concluido).toBe(true);

    perfil.escolherArquivo({ name: 'outro.png', size: 1000 });
    escopo.$digest();
    expect(perfil.envio.concluido).toBe(false);
    expect(perfil.envio.progresso).toBe(0);
  });

  it('o $destroy cancela o $interval de um envio em andamento', () => {
    const cancelar = vi.spyOn($interval, 'cancel');
    escolher({ name: 'atestado.jpg', size: 1000 });
    perfil.enviarArquivo();
    $interval.flush(300);

    escopo.$destroy();
    expect(cancelar).toHaveBeenCalled();
    $interval.flush(3000);
    expect(perfil.envio.progresso).toBe(10);
  });
});
