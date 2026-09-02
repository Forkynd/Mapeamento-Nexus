import { useEffect, useState, useMemo } from "react";
import ToggleBase from "../../../components/ToggleBase/toggleBase.tsx";
import { SelectChangeEvent } from "@mui/material";
import FilterBaseDinamico from "../../../components/FilterBase/filterBaseDinamico.tsx";
import FilterBaseDinamicoMultiplos from "../../../components/FilterBase/filterBaseDinamicoMultiplos.tsx";
import BotaoAcaoBase from "../../../components/ButtonBase/botaoAcaoBase.tsx";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import GraficoEntrantesGeralIndividual from "./graficoEntrantesGeralIndividual.tsx";

const coresPadrão: string[] = [
  "#3c0075",
  "#5a00b2",
  "#7e00eb",
  "#a02cff",
  "#c57dff",
  "#e0a9ff",
  "#e6c5ff",
  "#c8b6ff",
  "#b8c0ff",
  "#bbd0ff",
  "#c3f4ff",
  "#a2efff",
  "#80eaff",
  "#2ddbff",
  "#00b3d8",
  "#0095c7",
  "#0076b6",
  "#003d8b",
  "#000161",
  "#000814",
];

export default function GraficoEntrantesGeralBacklog(props) {
  const nomeDosDados =
    props.tipoGeral === "totalGeral"
      ? "Total Geral"
      : props.tipoGeral === "comRaiz"
        ? "Total com Raiz"
        : props.tipoGeral === "semRaiz"
          ? "Total sem Raiz"
          : props.tipoGeral === "raizFechado"
            ? "Raiz Fechado"
            : "Total Geral";

  const [anoAtivo, setAnoAtivo] = useState("");
  const [anoAtivoDisponiveis, setAnoAtivoDisponiveis] = useState<string[]>([]);

  const handleChangeAnoAtivo = (event) => {
    setAnoAtivo(event.target.value);
  };

  const anosList = useMemo(() => {
    if (!props.dadosBacklog?.length) return [];
    return [
      ...new Set(
        props.dadosBacklog
          .map((item) => item?.ANO)
          .filter((ano) => ano !== null && ano !== undefined),
      ),
    ]
      .map(String)
      .sort()
      .reverse();
  }, [props.dadosBacklog]);

  useEffect(() => {
    setAnoAtivoDisponiveis(anosList);
  }, [anosList]);

  useEffect(() => {
    if (!anosList.length) {
      if (anoAtivo !== "") setAnoAtivo("");
      return;
    }
    const proximoAno = anosList[0];
    if (anoAtivo !== proximoAno) setAnoAtivo(proximoAno);
  }, [anosList, anoAtivo]);

  const anoAtivoDisponiveisFinal = useMemo(
    () =>
      anoAtivoDisponiveis.map((item) => ({
        valor: `${item}`,
        titulo: `${item}`,
      })),
    [anoAtivoDisponiveis],
  );

  const [tipoBilhete, setTipoBilhete] = useState<string[]>(["Todos"]);

  const tiposDeBilheteDisponiveis = [
    ...new Set(props.entrantesBacklog.map((dado) => dado.TIPO_BILHETE)),
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

  function filtrarPorBilhete(lista: any[], tipos: string[]) {
    if (!Array.isArray(tipos) || tipos.includes("Todos")) return lista;
    return lista.filter((item) => tipos.includes(item?.TIPO_BILHETE));
  }

  const dadosBacklogFiltrados = filtrarPorBilhete(
    props.dadosBacklog,
    tipoBilhete,
  );
  const entrantesBacklogFiltrados = filtrarPorBilhete(
    props.entrantesBacklog,
    tipoBilhete,
  );
  const saidasBacklogFiltrados = filtrarPorBilhete(
    props.saidasBacklog,
    tipoBilhete,
  );

  const variavelFiltro = [
    {
      dadosFiltro: "ano",
      valoresFiltro: anoAtivo,
      valoresFiltroDisponiveis: anoAtivoDisponiveisFinal,
      onChange: handleChangeAnoAtivo,
    },
  ];

  const variavelFiltroMultiplo = [
    {
      dadosFiltro: "tipoBilhete",
      valoresFiltro: tipoBilhete,
      valoresFiltroDisponiveis: tiposDeBilheteDisponiveisFinal,
      onChange: handleChangeBilhete,
      valorOpcaoGeral: "Todos",
    },
  ];

  const [periodoAtual, setPeriodoAtual] = useState("0");
  const handleToggle = (event) => setPeriodoAtual(event.target.value);

  const dadosToggle = [
    { valor: "0", titulo: "Diário" },
    { valor: "1", titulo: "Semanal" },
    { valor: "2", titulo: "Mensal" },
  ];

  function formatarMesLabel(key: string) {
    const nomesMeses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    const [ano, mes] = key.split("-");
    return nomesMeses[Number(mes) - 1] ?? key;
  }

  function agruparPorPeriodo(lista: any[]) {
    const arr = Array.isArray(lista) ? lista : [];
    const dias = new Map<string, number>();
    const semanas = new Map<string, number>();
    const meses = new Map<string, number>();

    for (const item of arr) {
      if (!item) continue;
      const total = Number(item.TOTAL) || 0;

      if (item.VISAO === "DIARIO" && item.DATA) {
        dias.set(item.DATA, (dias.get(item.DATA) ?? 0) + total);
      }
      if (item.VISAO === "SEMANAL" && item.SEMANA) {
        semanas.set(item.SEMANA, (semanas.get(item.SEMANA) ?? 0) + total);
      }
      if (
        (item.VISAO === "ANO_MES" || item.VISAO === "MENSAL") &&
        item.ANO &&
        item.MES
      ) {
        const keyMes = `${item.ANO}-${String(item.MES).padStart(2, "0")}`;
        meses.set(keyMes, (meses.get(keyMes) ?? 0) + total);
      }
    }

    return { dias, semanas, meses };
  }

  const filtrarPorAnoSeNecessario = (lista: any[]) => {
    if (!Array.isArray(lista)) return [];
    if (periodoAtual === "0" || !anoAtivo) return lista;
    return lista.filter((item) => String(item.ANO) === String(anoAtivo));
  };

  const dadosBacklogPréFiltrados = filtrarPorAnoSeNecessario(
    dadosBacklogFiltrados,
  );
  const entrantesBacklogPréFiltrados = filtrarPorAnoSeNecessario(
    entrantesBacklogFiltrados || [],
  );
  const saidasBacklogPréFiltrados = filtrarPorAnoSeNecessario(
    saidasBacklogFiltrados || [],
  );

  const {
    diarioBacklog,
    semanalBacklog,
    mensalBacklog,
    diarioEntrantes,
    semanalEntrantes,
    mensalEntrantes,
    diarioSaidas,
    semanalSaidas,
    mensalSaidas,
    categoriasDias,
    categoriasSemanas,
    categoriasMeses,
  } = useMemo(() => {
    const backlog = agruparPorPeriodo(dadosBacklogPréFiltrados);
    const entrantes = agruparPorPeriodo(entrantesBacklogPréFiltrados);
    const saidas = agruparPorPeriodo(saidasBacklogPréFiltrados);

    const categoriasDias = Array.from(
      new Set([
        ...backlog.dias.keys(),
        ...entrantes.dias.keys(),
        ...saidas.dias.keys(),
      ]),
    ).sort();

    const categoriasSemanas = Array.from(
      new Set([
        ...backlog.semanas.keys(),
        ...entrantes.semanas.keys(),
        ...saidas.semanas.keys(),
      ]),
    ).sort();

    const categoriasMeses = Array.from(
      new Set([
        ...backlog.meses.keys(),
        ...entrantes.meses.keys(),
        ...saidas.meses.keys(),
      ]),
    ).sort();

    const mapearArray = (map: Map<string, number>, cat: string[]) =>
      cat.map((k) => map.get(k) ?? 0);

    return {
      diarioBacklog: mapearArray(backlog.dias, categoriasDias),
      semanalBacklog: mapearArray(backlog.semanas, categoriasSemanas),
      mensalBacklog: mapearArray(backlog.meses, categoriasMeses),

      diarioEntrantes: mapearArray(entrantes.dias, categoriasDias),
      semanalEntrantes: mapearArray(entrantes.semanas, categoriasSemanas),
      mensalEntrantes: mapearArray(entrantes.meses, categoriasMeses),

      diarioSaidas: mapearArray(saidas.dias, categoriasDias),
      semanalSaidas: mapearArray(saidas.semanas, categoriasSemanas),
      mensalSaidas: mapearArray(saidas.meses, categoriasMeses),

      categoriasDias,
      categoriasSemanas,
      categoriasMeses,
    };
  }, [
    dadosBacklogPréFiltrados,
    entrantesBacklogPréFiltrados,
    saidasBacklogPréFiltrados,
  ]);

  const dadosGrafico = useMemo(() => {
    const periodo = periodoAtual;

    let categories =
      periodo === "0"
        ? categoriasDias
        : periodo === "1"
          ? categoriasSemanas
          : categoriasMeses;

    if (periodo === "2") {
      categories = categories.map(formatarMesLabel);
    }

    let backlog =
      periodo === "0"
        ? diarioBacklog
        : periodo === "1"
          ? semanalBacklog
          : mensalBacklog;

    let entrantes =
      periodo === "0"
        ? diarioEntrantes
        : periodo === "1"
          ? semanalEntrantes
          : mensalEntrantes;

    let saidas =
      periodo === "0"
        ? diarioSaidas
        : periodo === "1"
          ? semanalSaidas
          : mensalSaidas;

    if (periodo === "0") {
      const total = categories.length;
      const inicio = Math.max(0, total - 30);
      categories = categories.slice(inicio);
      backlog = backlog.slice(inicio);
      entrantes = entrantes.slice(inicio);
      saidas = saidas.slice(inicio);
    }

    return {
      categories,
      series: [
        { name: "Entrantes", data: entrantes, color: coresPadrão[7] },
        { name: "Saídas", data: saidas, color: coresPadrão[4] },
        { name: "Backlog do Dia", data: backlog, color: coresPadrão[1] },
      ],
    };
  }, [
    periodoAtual,
    categoriasDias,
    categoriasSemanas,
    categoriasMeses,
    diarioBacklog,
    semanalBacklog,
    mensalBacklog,
    diarioEntrantes,
    semanalEntrantes,
    mensalEntrantes,
    diarioSaidas,
    semanalSaidas,
    mensalSaidas,
  ]);

  // Lógica para Desabilitar Filtros dos Dados dos Graficos - Backlog Acesso Entrantes

  const botãoDesabilitarFiltros =
    anoAtivo === anosList[0] && tipoBilhete.includes("Todos");

  const handleRemoverFiltros = () => {
    setAnoAtivo(anosList[0]);
    setTipoBilhete(["Todos"]);
  };

  return (
    <div className="VisãoBacklogAcessoGraficoEntrantesBacklogComponenteWrapper">
      <p className="VisãoBacklogAcessoGraficoEntrantesParagrafoInfo">
        Os dados do Gráfico Diário{" "}
        <b>não são alterados por mudanças no Filtro de Ano</b>.
      </p>
      <div className="VisãoBacklogAcessoFilterBaseDinamicoAnoInnerWrapper">
        <div className="VisãoBacklogAcessoFilterBaseDinamicoAnoAlinhamento">
          <FilterBaseDinamico
            variavelFiltros={variavelFiltro}
            valorWidthBotao="330px"
          />
          <FilterBaseDinamicoMultiplos
            variavelFiltros={variavelFiltroMultiplo}
            valorWidthBotao={"330px"}
          />
        </div>
        <BotaoAcaoBase
          iconeBotao={<FilterAltOffOutlinedIcon className="IconeBotãoAção" />}
          isDisabled={botãoDesabilitarFiltros}
          textoTooltip={
            botãoDesabilitarFiltros ? "" : "Remover Filtros da Página"
          }
          onButtonClick={handleRemoverFiltros}
          position={{
            top: "-60px",
            left: "340px",
          }}
        />
      </div>
      <ToggleBase
        visaoAtual={periodoAtual}
        onChange={handleToggle}
        dadosToggle={dadosToggle}
      />
      <div className="VisãoBacklogAcessoGraficoEntrantesIndividualConteiner">
        <GraficoEntrantesGeralIndividual
          seriesGrafico={dadosGrafico.series}
          categoriesGrafico={dadosGrafico.categories}
        />
      </div>
    </div>
  );
}
