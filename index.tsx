import { useEffect, useState, useMemo } from "react";
import { TA_DTO } from "../../models/dados.ts";
import * as Rede from "../../service/acesso/acesso-service.ts";
import * as Coleta from "../../service/coleta-service.ts";
import "./backlogAcesso.css";
import "../../components/ChartsBase/chartsBaseEstilo.css";
import LoaderBar from "../../components/Loading/barLoader.tsx";
import CardCimaBacklogAcesso from "./cardCimaBacklogAcesso.tsx";
import { SelectChangeEvent } from "@mui/material/Select";
import FilterBaseDinamicoMultiplos from "../../components/FilterBase/filterBaseDinamicoMultiplos.tsx";
import ToggleBase from "../../components/ToggleBase/toggleBase.tsx";
import BacklogAcessoTabelas from "./backlogAcessoTabelas.tsx";
import ConteinerGraficos from "./ConteinerGraficos/conteinerGraficos.tsx";
import BacklogAcessoTabelaGeral from "./backlogAcessoTabelaGeral.tsx";
import BotaoAcaoBase from "../../components/ButtonBase/botaoAcaoBase.tsx";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { exportToExcel } from "../../components/Excel/export.tsx";
import * as Service from "../../service/ClientesMacroDetalhado/clientes.ts";
import BacklogAcessoTabelasClientes from "./tabelaClientes.tsx";
import ConteinerGraficosClientes from "./graficoClientes.tsx";
import BacklogAcessoTabelaPréBaixa from "./backlogAcessoTabelaPreBaixas.tsx";
import GraficoEvolutivaBacklog from "./ConteinerGraficoEvolutiva/graficoEvolutivaBacklog.tsx";
// import GraficoEntrantesBacklog from "./ConteinerGraficoEntrantes/graficoEntrantesBacklog.tsx";
import GraficoEntrantesBacklogNovo from "./ConteinerGraficoEntrantesNovo/graficoEntrantesBacklog.tsx";
import GraficoEntrantesGeralBacklog from "./ConteinerGraficoGeralEntrantes/graficoEntrantesGeralBacklog.tsx";

export default function BacklogAcessoGeral() {
  const [dataColeta, setDataColeta] = useState([]);

  const [dadosBacklogAcesso, setDadosBacklogAcesso] = useState<TA_DTO[]>([]);

  const [volumetriaDadosBacklog, setVolumetriaDadosBacklog] = useState([]);
  const [entrantesBacklogAcesso, setEntrantesBacklogAcesso] = useState([]);
  const [saidasBacklogAcesso, setSaidasBacklogAcesso] = useState([]);

  const [dadosClienteBacklog, setDadosClienteBacklog] = useState([]);

  const somaTotal = volumetriaDadosBacklog.reduce((acc, item) => {
    return acc + Number(item.TOTAL);
  }, 0);

  function filtrarPorUltimaTramitacao(dados) {
    const mapa = new Map();

    dados.forEach((item) => {
      const numEvento = item.NUM_EVENTO;
      const dataAtual = new Date(item.TRAMITADO_EM);

      if (!mapa.has(numEvento)) {
        mapa.set(numEvento, item);
      } else {
        const existente = mapa.get(numEvento);
        const dataExistente = new Date(existente.TRAMITADO_EM);

        if (dataAtual > dataExistente) {
          mapa.set(numEvento, item);
        }
      }
    });

    return Array.from(mapa.values());
  }

  useEffect(() => {
    Service.getDados().then((response) => {
      const tratados = filtrarPorUltimaTramitacao(response.data);
      setDadosClienteBacklog(tratados);
    });
  }, []);

  // Filtros de Dados de Clientes - Backlog Acesso

  const filasPermitidas = [
    "OMRE01 - Gerencia O&M Rede de Acesso SPC-B",
    "OMRC02 - Ger O&M Rede Acesso TX NE",
    "OMRB01 - Ger O&M Rede de Acesso e Tx MG",
    "OMRA02 - Ger O&M Rede de Acesso e Tx DF GO TO",
    "OMRE03 - Gerencia O&M Rede de Acesso SPI",
    "OMRC01 - Ger O&M Rede de Acesso e Tx BA SE",
    "OMRA01 - Ger O&M Rede Acesso e Tx MS MT RO AC",
    "OMRD02 - Ger O&M Rede de Acesso e Tx PA AP MA",
    "OMRD01 - Ger O&M Rede de Acesso e Tx AM RR",
    "OMRE02 - GERENCIA O&M TRANSMISSÃO SP",
    "RB#ME02 - Ger. O&M Acesso Móvel Regional SUL",
    "RB#ME02 - Ger. O&M Acesso Móvel Regional ES_RJ",
  ];

  const isFechado = (item: any) =>
    ["Finalizado", "Ev. Solucionado"].includes(item.ESTADO || "");

  const isAtivo = (item: any) =>
    !isFechado(item) &&
    item.FILA_ATUAL_ATIVOS === "SIM" &&
    filasPermitidas.includes(item.AREA_DESTINO_ACIONADA || "");

  const isAcimaSla = (item: any) => {
    const tma = Number(item.TMPTRAMITACAO);
    const sla = Number(item.SLA_SEGUNDOS);
    return !Number.isNaN(tma) && !Number.isNaN(sla) && tma > sla;
  };

  const clientesAtivosAcimaSla = useMemo(
    () =>
      (dadosClienteBacklog || []).filter(
        (item: any) => isAtivo(item) && isAcimaSla(item),
      ),
    [dadosClienteBacklog],
  );

  const getTotal = (nome: string) => {
    if (nome === "Clientes") {
      return clientesAtivosAcimaSla.length;
    }

    return dadosClienteBacklog;
  };

  const filtrarTabela = (nome: string) => {
    if (nome === "Clientes") {
      return clientesAtivosAcimaSla;
    }

    return dadosClienteBacklog;
  };

  useEffect(() => {
    Coleta.getHoraAcessoRede().then((response) => setDataColeta(response.data));

    Rede.getDadosBacklogAcesso().then((response) =>
      setDadosBacklogAcesso(response.data),
    );

    // Rede.getEntrantesBacklogAcesso().then((response) =>
    //   setEntrantesBacklogAcesso(response.data),
    // );
    // Rede.getSaidasBacklogAcesso().then((response) =>
    //   setSaidasBacklogAcesso(response.data),
    // );

    Rede.getVolumetriaDadosGrafico().then((response) =>
      setVolumetriaDadosBacklog(response.data),
    );
    Rede.getEntrantesDadosGrafico().then((response) =>
      setEntrantesBacklogAcesso(response.data),
    );
    Rede.getSaidasDadosGrafico().then((response) =>
      setSaidasBacklogAcesso(response.data),
    );
  }, []);

  // Filtro por Classificação ou Área Responsável Origem - Filtra por um ou outro, a depender do dado
  const dadosBacklogAcessoNormalizados = dadosBacklogAcesso.map((dado) => {
    const classificacao = dado.CLASSIFICACAO?.trim();
    const areaOrigem = dado.NOVA_AREA_RESPONSAVEL_ORIGEM ?? "OUTROS";

    const areaResponsavelEfetiva =
      classificacao && classificacao !== "" ? classificacao : areaOrigem;

    return {
      ...dado,
      AREA_RESPONSAVEL_EFETIVA: areaResponsavelEfetiva,
    };
  });

  const dadosBacklogAcessoTempoMaior = dadosBacklogAcessoNormalizados.filter(
    (dado) => dado.TEMPO_24H === "MAIOR",
  );

  const dadosBacklogAcessoSemRaiz = dadosBacklogAcessoTempoMaior.filter(
    (dado) => dado.RAIZ === null,
  );

  const dadosBacklogAcessoComRaiz = dadosBacklogAcessoTempoMaior.filter(
    (dado) => dado.RAIZ !== null,
  );

  const dadosRaizFechadoOrigemAtivo = dadosBacklogAcessoTempoMaior.filter(
    (dado) =>
      dado.RAIZ !== null &&
      dado.PRIMEIRO_RAIZ_STATUS === "Fechado" &&
      dado.STATUS === "Ativo",
  );

  // Lógica para o Filtro por Tecnologia e Tipo de Bilhete dos Dados - Backlog Acesso

  const [tecnologia, setTecnologia] = useState<string[]>(["Todas"]);

  const tecnologiasDisponiveis = [
    { valor: "Todas", titulo: "Todas" },
    { valor: "GSM", titulo: "GSM" },
    { valor: "WCDMA", titulo: "WCDMA" },
    { valor: "LTE", titulo: "LTE" },
    { valor: "NR", titulo: "NR" },
  ];

  const handleChangeTecnologia = (event: SelectChangeEvent<string[]>) => {
    setTecnologia(event.target.value as string[]);
  };

  const [tipoBilhete, setTipoBilhete] = useState<string[]>(["Todos"]);

  const tiposDeBilheteDisponiveis = [
    ...new Set(dadosBacklogAcessoTempoMaior.map((dado) => dado.TIPO_BILHETE)),
  ].filter(Boolean);

  const tiposDeBilheteDisponiveisFinal = [
    { valor: "Todos", titulo: "Todos" },
    ...tiposDeBilheteDisponiveis
      .map((item) => ({
        valor: item,
        titulo: String(item),
      }))
      .sort((a, b) =>
        a.titulo.localeCompare(b.titulo, "pt-BR", { sensitivity: "base" }),
      ),
  ];

  const handleChangeBilhete = (event: SelectChangeEvent<string[]>) => {
    setTipoBilhete(event.target.value as string[]);
  };

  const dadosFiltrados = useMemo(() => {
    const filtrados = dadosBacklogAcessoSemRaiz.filter((item) => {
      const filtroTecnologia = tecnologia.includes("Todas")
        ? true
        : tecnologia.includes(item.TECNOLOGIA);
      const filtroBilhete = tipoBilhete.includes("Todos")
        ? true
        : tipoBilhete.includes(item.TIPO_BILHETE);
      return filtroTecnologia && filtroBilhete;
    });

    const mapa = new Map<string, TA_DTO>();
    filtrados.forEach((item) => {
      if (!mapa.has(item.ORIGEM)) {
        mapa.set(item.ORIGEM, item);
      }
    });

    return Array.from(mapa.values());
  }, [dadosBacklogAcessoSemRaiz, tecnologia, tipoBilhete]);

  const dadosFiltradosComRaiz = useMemo(() => {
    const filtrados = dadosBacklogAcessoComRaiz.filter((item) => {
      const filtroTecnologia = tecnologia.includes("Todas")
        ? true
        : tecnologia.includes(item.TECNOLOGIA);
      const filtroBilhete = tipoBilhete.includes("Todos")
        ? true
        : tipoBilhete.includes(item.TIPO_BILHETE);
      return filtroTecnologia && filtroBilhete;
    });

    const mapa = new Map<string, TA_DTO>();
    filtrados.forEach((item) => {
      if (!mapa.has(item.ORIGEM)) {
        mapa.set(item.ORIGEM, item);
      }
    });

    return Array.from(mapa.values());
  }, [dadosBacklogAcessoComRaiz, tecnologia, tipoBilhete]);

  const dadosFiltradosRaizFechadoOrigemAtivo = useMemo(() => {
    const filtrados = dadosRaizFechadoOrigemAtivo.filter((item) => {
      const filtroTecnologia = tecnologia.includes("Todas")
        ? true
        : tecnologia.includes(item.TECNOLOGIA);
      const filtroBilhete = tipoBilhete.includes("Todos")
        ? true
        : tipoBilhete.includes(item.TIPO_BILHETE);
      return filtroTecnologia && filtroBilhete;
    });

    const mapa = new Map<string, TA_DTO>();
    filtrados.forEach((item) => {
      if (!mapa.has(item.ORIGEM)) {
        mapa.set(item.ORIGEM, item);
      }
    });

    return Array.from(mapa.values());
  }, [dadosRaizFechadoOrigemAtivo, tecnologia, tipoBilhete]);

  const dadosFiltradosComRaizSemTratativa = dadosFiltradosComRaiz.filter(
    (dado) => dado.ANALISE === "Sem tratativa",
  );

  const dadosFiltradosTotalGeral = useMemo(() => {
    const filtrados = dadosBacklogAcessoTempoMaior.filter((item) => {
      const filtroTecnologia = tecnologia.includes("Todas")
        ? true
        : tecnologia.includes(item.TECNOLOGIA);
      const filtroBilhete = tipoBilhete.includes("Todos")
        ? true
        : tipoBilhete.includes(item.TIPO_BILHETE);
      return filtroTecnologia && filtroBilhete;
    });

    const mapa = new Map<string, TA_DTO>();
    filtrados.forEach((item) => {
      if (!mapa.has(item.ORIGEM)) {
        mapa.set(item.ORIGEM, item);
      }
    });

    return Array.from(mapa.values());
  }, [dadosBacklogAcessoTempoMaior, tecnologia, tipoBilhete]);

  const dadosGrupo = useMemo(() => {
    return dadosFiltradosTotalGeral.filter((item) => item.GRUPO?.trim());
  }, [dadosFiltradosTotalGeral]);

  // Dados Backlog Acesso - Cards por Área Responsável

  const origensDistintasBacklogAcesso = useMemo(() => {
    return Array.from(new Set(dadosFiltrados.map((item) => item.ORIGEM)));
  }, [dadosFiltrados]);

  const ordemAreas = [
    "SUPORTE N1",
    "SUPORTE N1 RETENÇÃO",
    "SUPORTE N1 DOL",
    "SUPORTE N2_N3",
  ];

  const dadosPorAreaResp = useMemo(() => {
    const mapa = {};

    const origensSet = new Set(origensDistintasBacklogAcesso);

    dadosFiltrados.forEach((item) => {
      if (!origensSet.has(item.ORIGEM)) return;

      const area = item.AREA_RESPONSAVEL_EFETIVA;

      if (!mapa[area]) {
        mapa[area] = {
          registros: [],
          origens: new Set(),
        };
      }

      if (!mapa[area].origens.has(item.ORIGEM)) {
        mapa[area].origens.add(item.ORIGEM);
        mapa[area].registros.push(item);
      }
    });

    const resultado = {};
    Object.entries(mapa).forEach(([area, valor]) => {
      resultado[area] = valor.registros;
    });

    return resultado;
  }, [dadosFiltrados, origensDistintasBacklogAcesso]);

  const cardsPorAreaResp = useMemo(() => {
    const lista = Object.entries(dadosPorAreaResp).map(([area, dados]) => ({
      area,
      quantidade: dados.length,
      dadosCompletos: dados,
    }));

    lista.sort((a, b) => {
      const indexA = ordemAreas.indexOf(a.area);
      const indexB = ordemAreas.indexOf(b.area);

      return (
        (indexA === -1 ? ordemAreas.length : indexA) -
        (indexB === -1 ? ordemAreas.length : indexB)
      );
    });

    return lista;
  }, [dadosPorAreaResp]);

  // Visão de Dados Filtrados por Classificação de Área Responsável

  // const classificaçõesValidas = new Set(
  //   dadosBacklogPréFiltrados
  //     .filter((dado) => dado.CLASSIFICACAO != null && dado.CLASSIFICACAO !== "")
  //     .map((dado) => dado.CLASSIFICACAO),
  // );

  // Formatação de Dados - Tabela Geral do Backlog Acesso

  const [tipoGeral, setTipoGeral] = useState("semRaiz");

  const dadosBaseGeral = useMemo(() => {
    if (tipoGeral === "totalGeral") return dadosFiltradosTotalGeral;
    if (tipoGeral === "altoValor") return dadosGrupo;
    if (tipoGeral === "comRaiz") return dadosFiltradosComRaiz;
    if (tipoGeral === "raizFechado")
      return dadosFiltradosRaizFechadoOrigemAtivo;
    if (tipoGeral === "comRaizSemTratativa")
      return dadosFiltradosComRaizSemTratativa;
    return dadosFiltrados;
  }, [
    tipoGeral,
    dadosFiltrados,
    dadosFiltradosTotalGeral,
    dadosFiltradosComRaiz,
    dadosFiltradosComRaizSemTratativa,
    dadosFiltradosRaizFechadoOrigemAtivo,
    dadosGrupo,
  ]);

  const dadosGeraisGrafico = dadosBaseGeral;

  const dadosPorAreaRespGeral = useMemo(() => {
    const dadosBase = dadosBaseGeral;
    const mapa = {};
    dadosBase.forEach((item) => {
      const area = item.AREA_RESPONSAVEL_EFETIVA;
      if (!mapa[area]) {
        mapa[area] = [];
      }
      mapa[area].push(item);
    });
    return mapa;
  }, [dadosBaseGeral]);

  const processarDadosTabela = (dados) => {
    const linhasTabela = [];
    const totaisTabela = {
      P1: 0,
      P2: 0,
      P3: 0,
      P4: 0,
      GRUPO: 0,
      RAIZ: 0,
      TOTAL_GERAL: 0,
    };

    Object.entries(dados).forEach(([area, registros]) => {
      const contagem = { P1: 0, P2: 0, P3: 0, P4: 0, GRUPO: 0, RAIZ: 0 };

      registros.forEach((item) => {
        if (item.PRIORIDADE === 1) contagem.P1++;
        if (item.PRIORIDADE === 2) contagem.P2++;
        if (item.PRIORIDADE === 3) contagem.P3++;
        if (item.PRIORIDADE === 4) contagem.P4++;

        if (item.GRUPO?.trim()) {
          contagem.GRUPO++;
        }
        if (item.RAIZ == null) {
          contagem.RAIZ++;
        }
      });

      const totalLinha = contagem.P1 + contagem.P2 + contagem.P3 + contagem.P4;

      totaisTabela.P1 += contagem.P1;
      totaisTabela.P2 += contagem.P2;
      totaisTabela.P3 += contagem.P3;
      totaisTabela.P4 += contagem.P4;
      totaisTabela.GRUPO += contagem.GRUPO;
      totaisTabela.RAIZ += contagem.RAIZ;
      totaisTabela.TOTAL_GERAL += totalLinha;

      linhasTabela.push({
        AREA_RESPONSAVEL_EFETIVA: area,
        ...contagem,
        TOTAL_GERAL: totalLinha,
      });
    });
    console.log(totaisTabela);
    linhasTabela.sort((a, b) => b.TOTAL_GERAL - a.TOTAL_GERAL);

    return { linhasTabela, totaisTabela };
  };

  const { linhasTabela, totaisTabela } = useMemo(
    () => processarDadosTabela(dadosPorAreaRespGeral),
    [dadosPorAreaRespGeral],
  );

  const dadosBasePréBaixa = dadosBaseGeral.filter(
    (dado) => dado.QTD_PRE_BAIXA_RECUSADA >= 5,
  );

  const dadosPorAreaRespPréBaixa = useMemo(() => {
    const dadosBase = dadosBasePréBaixa;
    const mapa = {};
    dadosBase.forEach((item) => {
      const area = item.AREA_RESPONSAVEL_EFETIVA;
      if (!mapa[area]) {
        mapa[area] = [];
      }
      mapa[area].push(item);
    });
    return mapa;
  }, [dadosBasePréBaixa]);

  const processarDadosTabelaPréBaixa = (dados) => {
    const linhasTabelaPréBaixa = [];
    const totaisTabelaPréBaixa = { P1: 0, P2: 0, P3: 0, P4: 0, TOTAL_GERAL: 0 };

    Object.entries(dados).forEach(([area, registros]) => {
      const contagem = { P1: 0, P2: 0, P3: 0, P4: 0 };

      registros.forEach((item) => {
        if (item.PRIORIDADE === 1) contagem.P1++;
        if (item.PRIORIDADE === 2) contagem.P2++;
        if (item.PRIORIDADE === 3) contagem.P3++;
        if (item.PRIORIDADE === 4) contagem.P4++;
      });

      const totalLinha = contagem.P1 + contagem.P2 + contagem.P3 + contagem.P4;

      totaisTabelaPréBaixa.P1 += contagem.P1;
      totaisTabelaPréBaixa.P2 += contagem.P2;
      totaisTabelaPréBaixa.P3 += contagem.P3;
      totaisTabelaPréBaixa.P4 += contagem.P4;
      totaisTabelaPréBaixa.TOTAL_GERAL += totalLinha;

      linhasTabelaPréBaixa.push({
        AREA_RESPONSAVEL_EFETIVA: area,
        ...contagem,
        TOTAL_GERAL: totalLinha,
      });
    });

    linhasTabelaPréBaixa.sort((a, b) => b.TOTAL_GERAL - a.TOTAL_GERAL);

    return { linhasTabelaPréBaixa, totaisTabelaPréBaixa };
  };

  const { linhasTabelaPréBaixa, totaisTabelaPréBaixa } = useMemo(
    () => processarDadosTabelaPréBaixa(dadosPorAreaRespPréBaixa),
    [dadosPorAreaRespPréBaixa],
  );

  // Lógica para filtrar os dados - FilterBaseDinamicoMultiplos

  const botãoDesabilitarFiltros =
    tecnologia.length === 1 &&
    tecnologia[0] === "Todas" &&
    tipoBilhete.length === 1 &&
    tipoBilhete[0] === "Todos";

  const handleRemoverFiltros = () => {
    setTecnologia(["Todas"]);
    setTipoBilhete(["Todos"]);
  };

  const variavelFiltros = useMemo(
    () => [
      {
        dadosFiltro: "tecnologia",
        valoresFiltro: tecnologia,
        valoresFiltroDisponiveis: tecnologiasDisponiveis,
        onChange: handleChangeTecnologia,
        valorOpcaoGeral: "Todas",
      },
      {
        dadosFiltro: "tipoBilhete",
        valoresFiltro: tipoBilhete,
        valoresFiltroDisponiveis: tiposDeBilheteDisponiveisFinal,
        onChange: handleChangeBilhete,
        valorOpcaoGeral: "Todos",
      },
    ],
    [
      tecnologia,
      tipoBilhete,
      tecnologiasDisponiveis,
      tiposDeBilheteDisponiveisFinal,
    ],
  );

  // Lógica para Estabelecer os dados - Area Responsável Ativa

  const [nomeCardAtivo, setNomeCardAtivo] = useState("");

  // const dadosClassificaçõesValidas = dadosBacklogPréFiltrados.filter(
  //   (dado) => dado.CLASSIFICACAO === nomeCardAtivo,
  // );

  // const dadosCardAtivo = useMemo(() => {
  //   if (nomeCardAtivo === "Total com Raiz") return dadosFiltradosComRaiz;
  //   if (nomeCardAtivo === "Total sem Raiz") return dadosFiltrados;
  //   if (nomeCardAtivo) {
  //     return dadosFiltrados.filter(
  //       (item) => item.AREA_RESPONSAVEL_EFETIVA === nomeCardAtivo,
  //     );
  //   }
  //   return null;
  // }, [nomeCardAtivo, dadosFiltrados, dadosFiltradosComRaiz]);

  const dadosCardAtivo = useMemo(() => {
    if (nomeCardAtivo === "Total com Raiz") return dadosFiltradosComRaiz;
    if (nomeCardAtivo === "Raiz Fechado") return dadosFiltradosComRaiz;
    if (nomeCardAtivo === "Total sem Raiz") return dadosFiltrados;
    if (nomeCardAtivo === "Com Raiz - Sem Tratativa")
      return dadosFiltradosComRaizSemTratativa;
    if (nomeCardAtivo === "Total Geral - Acesso")
      return dadosFiltradosTotalGeral;
    if (nomeCardAtivo === "Clientes") return clientesAtivosAcimaSla;
    if (nomeCardAtivo) {
      return dadosFiltrados.filter(
        (item) => item.AREA_RESPONSAVEL_EFETIVA === nomeCardAtivo,
      );
    }
    return null;
  }, [
    nomeCardAtivo,
    dadosFiltrados,
    dadosFiltradosComRaiz,
    dadosFiltradosComRaizSemTratativa,
    dadosFiltradosTotalGeral,
    clientesAtivosAcimaSla,
  ]);

  const dadosCardAtivoPréBaixa = useMemo(() => {
    if (!nomeCardAtivo) return null;

    return dadosFiltrados.filter(
      (item) =>
        item.QTD_PRE_BAIXA_RECUSADA >= 5 &&
        item.AREA_RESPONSAVEL_EFETIVA === nomeCardAtivo,
    );
  }, [nomeCardAtivo, dadosFiltrados]);

  const corDeFundoCards = "rgba(196, 125, 255, 0.404)";

  const handleCardDadosAtivo = (card) => {
    setNomeCardAtivo(card.area);
    setVisaoAtual("0");
  };

  const handleCardDadosSemRaiz = () => {
    setNomeCardAtivo("");
    setTipoGeral("semRaiz");
    setVisaoAtual("0");
  };
  const handleCardDadosAltoValor = () => {
    setNomeCardAtivo("");
    setTipoGeral("altoValor");
    setVisaoAtual("0");
  };

  const handleCardDadosComRaiz = () => {
    setNomeCardAtivo("");
    setTipoGeral("comRaiz");
    setVisaoAtual("0");
  };

  const handleCardDadosComRaizFechado = () => {
    setNomeCardAtivo("");
    setTipoGeral("raizFechado");
    setVisaoAtual("0");
  };

  const handleCardDadosComRaizSemTratativa = () => {
    setNomeCardAtivo("");
    setTipoGeral("comRaizSemTratativa");
    setVisaoAtual("0");
  };

  const handleCardDadosTotalGeral = () => {
    setNomeCardAtivo("");
    setTipoGeral("totalGeral");
    setVisaoAtual("0");
  };

  const handleClickDownloadGeral = () => {
    const dadosExport = dadosBaseGeral;
    const sufixo =
      tipoGeral === "comRaiz"
        ? "(com Raiz)"
        : tipoGeral === "comRaizSemTratativa"
          ? "(com Raiz - Sem Tratativa)"
          : tipoGeral === "raizFechado"
            ? "(com Raiz Fechado)"
            : tipoGeral === "totalGeral"
              ? "(Total Geral - Acesso)"
              : "(sem Raiz)";
    exportToExcel(dadosExport, `Backlog Acesso - Dados Gerais ${sufixo}`);
  };

  const handleClickDownloadArea = () => {
    exportToExcel(dadosCardAtivo, `Backlog Acesso - Dados de ${nomeCardAtivo}`);
  };

  // Código para Estabelecer a lógica - Toggle Base

  const [visaoAtual, setVisaoAtual] = useState("0");

  const handleToggle = (event) => {
    setVisaoAtual(event.target.value);
  };

  const dadosToggle = useMemo(() => {
    const base = [
      { valor: "0", titulo: "Visão em Tabela" },
      { valor: "1", titulo: "Visão em Gráficos" },
    ];

    const semEvolutivaPreBaixa = ["", "Clientes"];

    const podeMostrarAvancados =
      !semEvolutivaPreBaixa.includes(nomeCardAtivo) &&
      tipoGeral !== "raizFechado";

    if (podeMostrarAvancados) {
      base.push({ valor: "2", titulo: "Visão de Pré-Baixas" });
      base.push({ valor: "4", titulo: "Volumetria Backlog" });
      base.push({ valor: "5", titulo: "Evolutiva Backlog" });
    }

    // Caso específico de visão geral (sem card ativo)
    if (nomeCardAtivo === "" && tipoGeral !== "raizFechado") {
      base.push({ valor: "5", titulo: "Evolutiva Backlog" });
    }

    return base;
  }, [nomeCardAtivo, tipoGeral]);

  useEffect(() => {
    const valoresDisponiveis = new Set(dadosToggle.map((op) => op.valor));
    if (!valoresDisponiveis.has(visaoAtual)) {
      setVisaoAtual("0");
    }
  }, [dadosToggle, visaoAtual]);

  const dataColetaDeloitte = Array.isArray(dataColeta?.dados)
    ? dataColeta.dados
    : [];

  const coletaHoraFastAPI = dataColetaDeloitte.find(
    (item) => item.NOME_SCRIPT === "ACESSO REDE",
  );

  const coletaAtual = coletaHoraFastAPI
    ? coletaHoraFastAPI.DATA_UPDATE
    : "Não disponível";

  const tituloEvolutiva =
    nomeCardAtivo && nomeCardAtivo.trim() !== ""
      ? nomeCardAtivo
      : tipoGeral === "semRaiz"
        ? "Total sem Raiz"
        : tipoGeral === "raizFechado"
          ? "Total com Raiz Fechado"
          : tipoGeral === "comRaiz"
            ? "Total com Raiz"
            : "Total Geral - Acesso";

  // Dados Filtrados para Visão de Gráficos Entrantes / Saídas
  // A Antiga Visão usa a Variável dadosBacklogAcessoSemRaiz
  // Como base para os Filtros desses dados, além disso,
  // Usavamos como parâmetro de areaOrigem a chave de
  // NOVA_AREA_RESPONSAVEL_ORIGEM

  // function normalizarDadosGrafico(item: any) {
  //   const classificacao = item.CLASSIFICACAO?.trim();
  //   const areaOrigem = item.NOVA_AREA_RESPONSAVEL_ORIGEM ?? "OUTROS";

  //   const efetiva =
  //     classificacao && classificacao !== "" ? classificacao : areaOrigem;

  //   return {
  //     ...item,
  //     AREA_RESPONSAVEL_EFETIVA: efetiva,
  //   };
  // }

  // const novoEntrantesBacklogAcesso = entrantesBacklogAcesso.map(
  //   normalizarDadosGrafico,
  // );

  // const novoSaidasBacklogAcesso = saidasBacklogAcesso.map(
  //   normalizarDadosGrafico,
  // );

  // Lógica de Dados Filtrados para os Cards de Totais Gerais - Backlog Acesso

  let dadosFiltradosTotaisGerais = volumetriaDadosBacklog;

  if (tipoGeral === "totalGeral") {
    dadosFiltradosTotaisGerais = volumetriaDadosBacklog;
  } else if (tipoGeral === "semRaiz") {
    dadosFiltradosTotaisGerais = volumetriaDadosBacklog.filter(
      (dado) => dado.COM_RAIZ === "NAO",
    );
  } else if (tipoGeral === "comRaiz") {
    dadosFiltradosTotaisGerais = volumetriaDadosBacklog.filter(
      (dado) => dado.COM_RAIZ === "SIM",
    );
  } else if (tipoGeral === "raizFechado") {
    dadosFiltradosTotaisGerais = volumetriaDadosBacklog.filter(
      (dado) =>
        dado.COM_RAIZ === "SIM" &&
        dado.PRIMEIRO_RAIZ_STATUS === "Fechado" &&
        dado.STATUS === "Ativo",
    );
  } else if (tipoGeral !== "totalGeral") {
    dadosFiltradosTotaisGerais = volumetriaDadosBacklog.filter(
      (dado) => dado.COM_RAIZ === "SIM" && dado.ANALISE === "Sem tratativa",
    );
  }

  let dadosFiltradosEntrantesGerais = entrantesBacklogAcesso;

  if (tipoGeral === "semRaiz") {
    dadosFiltradosEntrantesGerais = entrantesBacklogAcesso.filter(
      (dado) => dado.COM_RAIZ === "NAO",
    );
  } else if (tipoGeral === "comRaiz") {
    dadosFiltradosEntrantesGerais = entrantesBacklogAcesso.filter(
      (dado) => dado.COM_RAIZ === "SIM",
    );
  } else if (tipoGeral === "raizFechado") {
    dadosFiltradosEntrantesGerais = entrantesBacklogAcesso.filter(
      (dado) =>
        dado.COM_RAIZ === "SIM" &&
        dado.PRIMEIRO_RAIZ_STATUS === "Fechado" &&
        dado.STATUS === "Ativo",
    );
  } else if (tipoGeral !== "totalGeral") {
    dadosFiltradosEntrantesGerais = entrantesBacklogAcesso.filter(
      (dado) => dado.COM_RAIZ === "SIM" && dado.ANALISE === "Sem tratativa",
    );
  }

  let dadosFiltradosSaidasGerais = saidasBacklogAcesso;

  if (tipoGeral === "semRaiz") {
    dadosFiltradosSaidasGerais = saidasBacklogAcesso.filter(
      (dado) => dado.COM_RAIZ === "NAO",
    );
  } else if (tipoGeral === "comRaiz") {
    dadosFiltradosSaidasGerais = saidasBacklogAcesso.filter(
      (dado) => dado.COM_RAIZ === "SIM",
    );
  } else if (tipoGeral === "raizFechado") {
    dadosFiltradosSaidasGerais = saidasBacklogAcesso.filter(
      (dado) =>
        dado.COM_RAIZ === "SIM" &&
        dado.PRIMEIRO_RAIZ_STATUS === "Fechado" &&
        dado.STATUS === "Ativo",
    );
  } else if (tipoGeral !== "totalGeral") {
    dadosFiltradosSaidasGerais = saidasBacklogAcesso.filter(
      (dado) => dado.COM_RAIZ === "SIM" && dado.ANALISE === "Sem tratativa",
    );
  }

  // Lógica de Dados Filtrados para os Cards de Área Responsável - Backlog Acesso

  function filtrarPorAreaResponsavel(
    listaNormalizada: any[],
    nomeCardAtivo: string,
  ) {
    return listaNormalizada.filter(
      (item) => item.NOVA_CLASSIFICACAO === nomeCardAtivo,
    );
  }

  const dadosGeraisFiltrados = filtrarPorAreaResponsavel(
    volumetriaDadosBacklog,
    nomeCardAtivo,
  );

  const dadosEntrantesFiltrados = filtrarPorAreaResponsavel(
    entrantesBacklogAcesso,
    nomeCardAtivo,
  );

  const dadosSaidasFiltrados = filtrarPorAreaResponsavel(
    saidasBacklogAcesso,
    nomeCardAtivo,
  );

  const tituloGeralBacklog = {
    semRaiz: "TAs sem Raiz",
    comRaiz: "TAs com Raiz",
    raizFechado: "Raiz Fechado",
    totalGeral: "Total Geral - Acesso",
    comRaizSemTratativa: "Com Raiz - Sem Tratativa",
    altoValor: "Alto Valor",
  };

  return (
    <>
      {cardsPorAreaResp.length == 0 ? (
        <LoaderBar />
      ) : (
        <div className="PáginaBacklogAcessoWrapper">
          <div className="BacklogAcessoContentHeader">
            <h3 className="BacklogAcessoTitulo">Backlog - Rede De Acesso</h3>
            <h4 className="BacklogAcessoSubTitulo">
              Última atualização:{" "}
              <span className="DataColeta">{coletaAtual}</span>
            </h4>
            <div className="VisãoBacklogAcessoFilterBaseDinamicoMultiplosWrapper">
              <FilterBaseDinamicoMultiplos
                variavelFiltros={variavelFiltros}
                valorWidthBotao={"350px"}
              />
            </div>
            <BotaoAcaoBase
              iconeBotao={
                <FilterAltOffOutlinedIcon className="IconeBotãoAção" />
              }
              isDisabled={botãoDesabilitarFiltros}
              textoTooltip={
                botãoDesabilitarFiltros ? "" : "Remover Filtros da Página"
              }
              onButtonClick={handleRemoverFiltros}
              position={{
                top: "-55px",
                left: "190px",
              }}
            />
            <p className="BacklogAcessoSubGraficosNomeGrupo">
              Clique em um dos Cards para ampliar seus dados abaixo
            </p>
          </div>
          <div className="CardsBacklogAcessoMainWrapper">
            <div className="CardsBacklogAcessoConteinerCima">
              <CardCimaBacklogAcesso
                key="TotalGeral"
                titulo="Total Geral - Acesso"
                numero={dadosFiltradosTotalGeral.length}
                onClick={() => handleCardDadosTotalGeral()}
                corDeFundoCards={corDeFundoCards}
              />
              <CardCimaBacklogAcesso
                key="SemRaiz"
                titulo="Total sem Raiz"
                numero={dadosFiltrados.length}
                onClick={() => handleCardDadosSemRaiz()}
                corDeFundoCards={corDeFundoCards}
              />
              <CardCimaBacklogAcesso
                key="ComRaiz"
                titulo="Total com Raiz"
                numero={dadosFiltradosComRaiz.length}
                onClick={() => handleCardDadosComRaiz()}
                corDeFundoCards={corDeFundoCards}
              />
              <CardCimaBacklogAcesso
                key="comRaizFechado"
                titulo="Raiz Fechado"
                numero={dadosFiltradosRaizFechadoOrigemAtivo.length}
                onClick={() => handleCardDadosComRaizFechado()}
                corDeFundoCards={corDeFundoCards}
              />
              <CardCimaBacklogAcesso
                key="ComRaiz"
                titulo="Com Raiz - Sem Tratativa"
                numero={dadosFiltradosComRaizSemTratativa.length}
                onClick={() => handleCardDadosComRaizSemTratativa()}
                corDeFundoCards={corDeFundoCards}
              />
              <CardCimaBacklogAcesso
                key="altoValor"
                titulo="Volumetria Alto Valor"
                numero={dadosGrupo.length}
                onClick={() => handleCardDadosAltoValor()}
                corDeFundoCards={corDeFundoCards}
              />
              {cardsPorAreaResp.map((card) => (
                <CardCimaBacklogAcesso
                  key={card.area}
                  titulo={card.area}
                  numero={card.quantidade}
                  onClick={() => handleCardDadosAtivo(card)}
                />
              ))}
              <CardCimaBacklogAcesso
                key="Clientes"
                titulo="Clientes"
                numero={getTotal("Clientes")}
                onClick={() => {
                  setNomeCardAtivo("Clientes");
                  setVisaoAtual("0");
                }}
              />
            </div>
          </div>
          <div className="BacklogAcessoContentExpansionConteiner">
            <div className="BacklogAcessoTabelaAtivaWrapper">
              {nomeCardAtivo === "" ? (
                <div className="BacklogAcessoTabelaGeralOutterWrapper">
                  <h3 className="BacklogAcessoTitulo">
                    Visão Geral do Backlog - {tituloGeralBacklog[tipoGeral]}
                  </h3>

                  <h4 className="BacklogAcessoSubTitulo">
                    Total por Área Responsável e Prioridade
                  </h4>
                  <div className="BacklogAcessoToggleBaseGeralWrapper">
                    <ToggleBase
                      visaoAtual={visaoAtual}
                      onChange={handleToggle}
                      dadosToggle={dadosToggle}
                    />
                    <div className="BacklogAcessoBotãoExportBaseWrapper">
                      <BotaoAcaoBase
                        iconeBotao={
                          <FileDownloadOutlinedIcon className="IconeBotãoAção" />
                        }
                        textoTooltip={
                          "Baixar Dados Gerais dos TAs do Backlog - " +
                          tituloGeralBacklog[tipoGeral]
                        }
                        position={{
                          top: "-45px",
                          right: "-45px",
                        }}
                        onButtonClick={handleClickDownloadGeral}
                      />
                    </div>
                    <h4 className="BacklogAcessoSubTitulo">
                      {visaoAtual === "0"
                        ? "Acompanhamento Geral por Grupos"
                        : visaoAtual === "1"
                          ? "Dados Gerais do Tempo Decorrido de Prioridades"
                          : "Monitoramento de Pré-Baixas Recusadas"}
                    </h4>
                  </div>
                  {visaoAtual === "0" ? (
                    <BacklogAcessoTabelaGeral
                      linhasTabela={linhasTabela}
                      totaisTabela={totaisTabela}
                      exibirAltoValor={tipoGeral === "totalGeral"}
                      exibirSemRaizAltoValor={tipoGeral === "altoValor"}
                    />
                  ) : visaoAtual === "1" ? (
                    <div className="BacklogAcessoGraficosWrapper">
                      <ConteinerGraficos dadosCardAtivo={dadosGeraisGrafico} />
                    </div>
                  ) : visaoAtual === "2" ? (
                    <BacklogAcessoTabelaPréBaixa
                      linhasTabela={linhasTabelaPréBaixa}
                      totaisTabela={totaisTabelaPréBaixa}
                      nomeCardAtivo={nomeCardAtivo}
                      dadosDownload={dadosBasePréBaixa}
                    />
                  ) : visaoAtual === "4" ? (
                    <div className="BacklogAcessoGraficosWrapper">
                      <GraficoEvolutivaBacklog titulo={tituloEvolutiva} />
                    </div>
                  ) : visaoAtual === "5" ? (
                    <GraficoEntrantesGeralBacklog
                      tipoGeral={tipoGeral}
                      dadosBacklog={dadosFiltradosTotaisGerais}
                      entrantesBacklog={dadosFiltradosEntrantesGerais}
                      saidasBacklog={dadosFiltradosSaidasGerais}
                    />
                  ) : null}
                </div>
              ) : (
                // Fim da Visão de Cards Gerais (Total Geral, Com e Sem Raiz) Acima
                // ----------------------------------------------------------------
                // Início da Visão de Cards Gerais (Cards de Áreas por Grupo) Abaixo
                <>
                  <div className="BacklogAcessoContentHeader">
                    <h3 className="BacklogAcessoTitulo">
                      {nomeCardAtivo === "Total com Raiz"
                        ? "Visão Geral do Backlog - TAs com Raiz"
                        : nomeCardAtivo}
                    </h3>
                    {/* {classificaçõesValidas.has(nomeCardAtivo) ? (
                      <ConteinerClassificações
                        nomeCardAtivo={nomeCardAtivo}
                        dadosClassificaçõesValidas={dadosClassificaçõesValidas}
                      />
                    ) : null} */}
                    <h4 className="BacklogAcessoSubTitulo">
                      {nomeCardAtivo === "Total com Raiz"
                        ? "Total por Área Responsável e Prioridade"
                        : "Selecione uma Visão"}
                    </h4>
                  </div>
                  <div className="VisãoBacklogAcessoToggleBaseBotãoWrapper">
                    <ToggleBase
                      visaoAtual={visaoAtual}
                      onChange={handleToggle}
                      dadosToggle={dadosToggle}
                    />
                    <div className="BacklogAcessoBotãoExportBaseWrapper">
                      <BotaoAcaoBase
                        iconeBotao={
                          <FileDownloadOutlinedIcon className="IconeBotãoAção" />
                        }
                        textoTooltip={`Baixar Dados dos TAs do Backlog - ${nomeCardAtivo}`}
                        position={{
                          top: "-45px",
                          right:
                            nomeCardAtivo === "Clientes" ? "430px" : "185px",
                        }}
                        onButtonClick={handleClickDownloadArea}
                      />
                    </div>
                    <h4 className="BacklogAcessoSubTitulo">
                      {visaoAtual === "0"
                        ? nomeCardAtivo === "Total com Raiz"
                          ? "Acompanhamento Geral por Grupos"
                          : "Acompanhamento por Grupos"
                        : visaoAtual === "1"
                          ? "Dados do Tempo Decorrido de Prioridades"
                          : visaoAtual === "2"
                            ? "Monitoramento de Pré-Baixas Recusadas"
                            : visaoAtual === "4"
                              ? `Acompanhamento de Volumetria Backlog - ${nomeCardAtivo}`
                              : `Acompanhamento de Evolutiva Backlog - ${nomeCardAtivo}`}
                    </h4>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="BacklogAcessoTabelaGeralOutterWrapper">
                      {visaoAtual === "0" && nomeCardAtivo === "Clientes" ? (
                        <BacklogAcessoTabelasClientes
                          dadosCardAtivo={dadosCardAtivo}
                        />
                      ) : visaoAtual === "1" && nomeCardAtivo === "Clientes" ? (
                        <div className="BacklogAcessoGraficosWrapper">
                          <ConteinerGraficosClientes
                            dadosCardAtivo={dadosCardAtivo}
                          />
                        </div>
                      ) : visaoAtual === "2" && nomeCardAtivo === "Clientes" ? (
                        <div className="BacklogAcessoGraficosWrapper">
                          <BacklogAcessoTabelas
                            nomeCardAtivo={nomeCardAtivo}
                            dadosCardAtivo={dadosCardAtivo}
                          />
                        </div>
                      ) : visaoAtual === "4" ? (
                        <div className="BacklogAcessoGraficosWrapper">
                          <GraficoEvolutivaBacklog titulo={tituloEvolutiva} />
                        </div>
                      ) : visaoAtual === "5" ? (
                        <div className="BacklogAcessoGraficosWrapper">
                          {/* <GraficoEntrantesBacklog
                            dadosBacklog={dadosGeraisFiltrados}
                            entrantesBacklog={dadosEntrantesFiltrados}
                            saidasBacklog={dadosSaidasFiltrados}
                          /> */}
                          <GraficoEntrantesBacklogNovo
                            dadosBacklog={dadosGeraisFiltrados}
                            entrantesBacklog={dadosEntrantesFiltrados}
                            saidasBacklog={dadosSaidasFiltrados}
                          />
                        </div>
                      ) : visaoAtual === "0" ? (
                        <BacklogAcessoTabelas
                          nomeCardAtivo={nomeCardAtivo}
                          dadosCardAtivo={dadosCardAtivo}
                        />
                      ) : visaoAtual === "1" ? (
                        <div className="BacklogAcessoGraficosWrapper">
                          <ConteinerGraficos dadosCardAtivo={dadosCardAtivo} />
                        </div>
                      ) : (
                        <BacklogAcessoTabelas
                          isPréBaixa={true}
                          nomeCardAtivo={nomeCardAtivo}
                          dadosCardAtivo={dadosCardAtivoPréBaixa}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

