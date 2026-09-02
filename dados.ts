import { StringGradients } from "antd/es/progress/progress";

export type DadosDTO = {
  Origem: number;
  Hora: number;
  Entrantes: number;
  Dia: number;
  Mes: number;
  Ano: number;
  Coleta: string;
  Nome: string;
  Estado: string;
  Alarme: string;
  Coran: string;
  DataCriacao: string;

  Titulo: string;
  Link: string;
  Data: string;
  Portal: string;
  ID: string;
  Observacao: string;
  TA: string;
  UF: string;
  Municipio: string;
  Updated: string;
  Responsavel: string;
  Causa: string;
};

export type ErrorDTO = {
  Error: boolean;
  Nome: string;
};

export type TA_DTO = {
  GRUPO: any;
  RaizInvalido: any;
  dataResolucao: any;
  SemRaiz: any;
  Area: string;
  TA: number;
  Raiz: number;
  Origem: number;
  Sequencia: number;
  Cidade: string;
  UF: string;
  Endereco: string;
  DDD: string;
  Hostname: string;
  Status: string;
  SiteVip: string;
  Vip: number;
  Central: string;
  TipoSite: string;
  SiglaSite: string;
  COLETA: string;
  ALARME: string;
  Fabricante: string;
  TipoBilhete: string;
  DataCriacao: string;
  DataBaixa: string;
  TRAFEGO: string;
  STATUS_SITE: string;
  TECNOLOGIA: String;
  OBSERVACAO: string;
  HOST: string;
  DATA: string;
  CONTEM_TA: string;
  TA_ORIGEM_CHK: string;
  STATUS_ABR: string;
  DataApresentacao: string;
  Alarme: string;
  SCIENCE: string;
  Refencia: string;
  Sigla: string;
  SITE: string;
  SiglaRSH: string;
  NomeSite: string;
  Regional: string;
  Municipio: string;
  TipoTARaiz: string;
  TipoRede: string;
  TipoRedeRaiz: string;
  TipoAlarme: string;
  TipoFalha: string;
  Grupo: string;
  GrupoPai: number;
  Observacao: string;
  SLA: number;
  DiaSLA: number;
  TempoSLA: string;
  StatusOrigem: string;
  StatusTA: string;
  StatusRaiz: string;
  Doadora: string;
  Estado: string;
  Host: string;
  AbrTA: number;
  SIGLA_CEDENTE: string;
  TipoDocumentoAbr: string;
  Tomadora: string;
  Prioridade: number;
  Tipo: string;
  Tecnologia: string;
  Outros: number;
  Coran: number;
  QtdElementos: number;
  DataVida: string;
  ImpactoEqp: string;
  Causa: string;
  NomeB2B: string;

  QtdTotal: number;
  HistOutros: string;
  Historico: string;
  Operadora: string;
  ProxAtt: string;
  Editor: string;
  Descricao: string;
  Escalonamento: string;

  Dia: number;
  Total: number;
  Day: string;
  Mes: number;
  Hora: number;
  Minuto: number;
  HoraColeta: string;

  dados: Array<TA_DTO>;
  condicao1: number;
  bg: string;
  ufmap: string;

  Relatorio: string;
  UltimaAtualizaçao: string;
  TempoAbertura: string;
  TempoTrativa: number;
  Categoria: string;

  Afetacao: number;
  LocalAfetacao: string;
  Localidade: string;
  ErbTotal: number;
  ErbAfetadas: number;

  Entrante: number;
  name: string;
  data: number;
  Campo: number;
  FaixaSLA: string;
  Acompanhamento: string;
  AreaResponsavel: string;

  DataEncerramento: string;
  DadosEqp: string;
  InfoCallCenter: string;
  AttCallCenter: string;
  AtuacaoPrime: string;
  DataAtuacaoPrime: string;
  DataDespacho: string;
  Despacho: string;
  Entrega: string;
  DataEntrega: string;
  tramitacao: string;
  Semana: string;
  TempoAtendimento: string;

  Ano: number;
  TipoCausa: string;
  AlarmeID: string;

  Qtd: number;
  Periodo: string;

  UltimoRaiz: number;
  UltRaizGrupo: number;
  UfOrigem: string;
  UfRaiz: string;
  ErbAtivadas: number;

  TEMPO_DECORRIDO: string;
  UF_MUNICIPIO: string;
  Prazo: string;
  PRAZO: string;
  CAUSA: string;
  AREA_RESPONSAVEL: string;
  STATUS: string;

  ERB_ATIVA: string;
  ERB_AFETADA: string;
  MUNICIPIO: string;
  AFETAÇÃO: string;
  Responsavel: string;
};

export type ERB_DTO = {
  Tomadora: string;
  Vip: string;
  UF: string;
  Hostname: string;
  Sigla: string;
  Fornecedor: string;
  NomeSite: string;
  Municipio: string;
  Bairro: string;
  Endereco: string;
  Operadora: string;
  Contrato: string;
  CEP: string;
  AceiteOM: string;
  AceiteRF: string;
  ReprovacaoOM: string;
  DataReprovacaoOM: string;
  ReprovacaoRF: string;
  DataReprovacaoRF: string;
  Status: string;
  Situacao: string;
  DataAprovacaoComercial: string;
  Latitude: string;
  Longitude: string;
  NomeB2B: string;
  PlanoAcao: string;
  Responsavel: string;
  DataPrevista: string;

  Total: number;
  ImpactoTotal: number;
  TipoCausa: string;

  ERB_ATIVA: string;
};

export type DirecinadoDTO = {
  DiaCriacao: string;
  N2RF: number;
  Retencao: number;
  Coram: number;
  Campo: number;
  Mes: number;
  Ano: number;
  Huawei: number;
  Ericsson: number;
};

// -----------  Login ----------- //
export type CredentialsDTO = {
  username: string;
  password: string;
};

export type AccessTokenPayloadDTO = {
  exp: number;
  iat: number;
  nbf: number;
  nome: string;
  email: string;
  matricula: string;
  acesso: string;
};

export type info = {
  ta: number;
  total_qtd: number;
  ultimo_hist_outros: string;
  ultimo_hist_gestao: string;
  status_ta: string;
  operadora: string;
  grupo_atual: string;
  uf_municipio: string;
  hora_atual: string;
  proxima_atualizacao_em: string;
  id: string;
};

export type volumetria = {
  TOTAL: number;
  NOC: number;
  CORAN: number;
  CAMPO: number;
  N2N3: number;
};

export interface DataAtualizacaoItem {
  NOME_SCRIPT: string;
  DATA_UPDATE: string;
}

export type DataAtualizacaoResponse = {
  dados: DataAtualizacaoItem[];
};
