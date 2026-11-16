// Conteúdo da secretaria acadêmica (mesmos dados da versão AngularJS).

export const perguntas = [
  {
    titulo: 'Como solicito matrícula nas disciplinas de 2027.1?',
    conteudo: 'Em Disciplinas, use "Solicitar matrícula" em cada disciplina desejada entre 01/12/2026 e 12/12/2026. A coordenação analisa os pedidos em até 5 dias úteis.'
  },
  {
    titulo: 'Até quando posso trancar o semestre?',
    conteudo: 'O trancamento de 2026.2 pode ser pedido até 20/11/2026, na secretaria acadêmica. Mensalidades já vencidas continuam devidas.'
  },
  {
    titulo: 'Como peço a segunda via de um documento?',
    conteudo: 'Em Perfil, aba Documentos, escolha o documento e clique em "Solicitar". A declaração de matrícula sai na hora; o histórico escolar fica pronto em até 2 dias úteis.'
  },
  {
    titulo: 'Como entrego um atestado médico?',
    conteudo: 'Envie o arquivo em PDF, JPG ou PNG, com até 5 MB, em Perfil, aba Documentos, em até 3 dias úteis após o início do afastamento.'
  },
  {
    titulo: 'Quais são os requisitos para o estágio supervisionado?',
    conteudo: 'Ter cumprido 50% da carga horária do curso e solicitar a declaração de vínculo para estágio. O termo de compromisso deve ser assinado antes do início das atividades.'
  },
  {
    titulo: 'Quando posso colar grau?',
    conteudo: 'Após integralizar as 3.600 h do curso, incluindo TCC, estágio e atividades complementares, sem pendências na biblioteca. A colação de 2027.1 está prevista para 23/07/2027.'
  }
];

// Propositalmente fora de ordem: o Painel ordena a lista numa propriedade computed.
export const prazos = [
  { data: '2026-12-05', descricao: 'Divulgação das notas finais de 2026.2' },
  { data: '2027-02-08', descricao: 'Início das aulas de 2027.1' },
  { data: '2026-11-20', descricao: 'Último dia para trancamento de 2026.2' },
  { data: '2026-12-12', descricao: 'Fim da solicitação de matrícula 2027.1' },
  { data: '2026-12-01', descricao: 'Início da solicitação de matrícula 2027.1' }
];
