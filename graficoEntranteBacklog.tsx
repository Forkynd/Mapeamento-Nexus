import { useEffect, useState, useMemo } from "react";
import ToggleBase from "../../../components/ToggleBase/toggleBase.tsx";
import { SelectChangeEvent } from "@mui/material";
import FilterBaseDinamico from "../../../components/FilterBase/filterBaseDinamico.tsx";
import FilterBaseDinamicoMultiplos from "../../../components/FilterBase/filterBaseDinamicoMultiplos.tsx";
import BotaoAcaoBase from "../../../components/ButtonBase/botaoAcaoBase.tsx";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import GraficoEntrantesIndividual from "./graficoEntrantesIndividual.tsx";

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
  // Lógica de Filtros (Ano e Tipo de Bilhete) dos Dados dos Gráficos

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
    if (anoAtivo !== proximoAno) {
      setAnoAtivo(proximoAno);
    }
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

  const handleToggle = (event) => {
    setPeriodoAtual(event.target.value);
  };

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
        const keyDia = item.DATA;
        dias.set(keyDia, (dias.get(keyDia) ?? 0) + total);
      }

      if (item.VISAO === "SEMANAL" && item.SEMANA) {
        const keySemana = item.SEMANA;
        semanas.set(keySemana, (semanas.get(keySemana) ?? 0) + total);
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

    if (periodoAtual === "0" || !anoAtivo) {
      return lista;
    }

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
    // Backlog
    diarioBacklogSemRaiz,
    semanalBacklogSemRaiz,
    mensalBacklogSemRaiz,

    // Entrantes
    diarioEntrantesSemRaiz,
    semanalEntrantesSemRaiz,
    mensalEntrantesSemRaiz,

    // Saídas
    diarioSaidasSemRaiz,
    semanalSaidasSemRaiz,
    mensalSaidasSemRaiz,

    categoriasDias,
    categoriasSemanas,
    categoriasMeses,
  } = useMemo(() => {
    const separarPorRaiz = (lista: any[]) => {
      const arr = Array.isArray(lista) ? lista : [];
      const semRaiz = arr.filter((item) => item?.COM_RAIZ === "NAO");
      return { semRaiz };
    };

    const { semRaiz: backlogSemRaizLista } = separarPorRaiz(
      dadosBacklogPréFiltrados,
    );

    const { semRaiz: entrantesSemRaizLista } = separarPorRaiz(
      entrantesBacklogPréFiltrados,
    );

    const { semRaiz: saidasSemRaizLista } = separarPorRaiz(
      saidasBacklogPréFiltrados,
    );

    const backlogSemRaiz = agruparPorPeriodo(backlogSemRaizLista);

    const entrantesSemRaiz = agruparPorPeriodo(entrantesSemRaizLista);

    const saidasSemRaiz = agruparPorPeriodo(saidasSemRaizLista);

    const categoriasDias = Array.from(
      new Set([
        ...backlogSemRaiz.dias.keys(),
        ...entrantesSemRaiz.dias.keys(),
        ...saidasSemRaiz.dias.keys(),
      ]),
    ).sort();

    const categoriasSemanas = Array.from(
      new Set([
        ...backlogSemRaiz.semanas.keys(),
        ...entrantesSemRaiz.semanas.keys(),
        ...saidasSemRaiz.semanas.keys(),
      ]),
    ).sort();

    const categoriasMeses = Array.from(
      new Set([
        ...backlogSemRaiz.meses.keys(),
        ...entrantesSemRaiz.meses.keys(),
        ...saidasSemRaiz.meses.keys(),
      ]),
    ).sort();

    const mapearArray = (map: Map<string, number>, cat: string[]) =>
      cat.map((k) => map.get(k) ?? 0);

    return {
      diarioBacklogSemRaiz: mapearArray(backlogSemRaiz.dias, categoriasDias),
      semanalBacklogSemRaiz: mapearArray(
        backlogSemRaiz.semanas,
        categoriasSemanas,
      ),
      mensalBacklogSemRaiz: mapearArray(backlogSemRaiz.meses, categoriasMeses),

      diarioEntrantesSemRaiz: mapearArray(
        entrantesSemRaiz.dias,
        categoriasDias,
      ),
      semanalEntrantesSemRaiz: mapearArray(
        entrantesSemRaiz.semanas,
        categoriasSemanas,
      ),
      mensalEntrantesSemRaiz: mapearArray(
        entrantesSemRaiz.meses,
        categoriasMeses,
      ),

      diarioSaidasSemRaiz: mapearArray(saidasSemRaiz.dias, categoriasDias),
      semanalSaidasSemRaiz: mapearArray(
        saidasSemRaiz.semanas,
        categoriasSemanas,
      ),
      mensalSaidasSemRaiz: mapearArray(saidasSemRaiz.meses, categoriasMeses),

      categoriasDias,
      categoriasSemanas,
      categoriasMeses,
    };
  }, [
    dadosBacklogPréFiltrados,
    entrantesBacklogPréFiltrados,
    saidasBacklogPréFiltrados,
  ]);

  const dadosGraficoBacklogSemRaiz = useMemo(() => {
    const periodo = periodoAtual;

    let categoriesGrafico =
      periodo === "0"
        ? categoriasDias
        : periodo === "1"
          ? categoriasSemanas
          : categoriasMeses;

    if (periodo === "2") {
      categoriesGrafico = categoriesGrafico.map(formatarMesLabel);
    }

    let backlogSemRaiz =
      periodo === "0"
        ? diarioBacklogSemRaiz
        : periodo === "1"
          ? semanalBacklogSemRaiz
          : mensalBacklogSemRaiz;

    let entrantesSemRaiz =
      periodo === "0"
        ? diarioEntrantesSemRaiz
        : periodo === "1"
          ? semanalEntrantesSemRaiz
          : mensalEntrantesSemRaiz;

    let saidasSemRaiz =
      periodo === "0"
        ? diarioSaidasSemRaiz
        : periodo === "1"
          ? semanalSaidasSemRaiz
          : mensalSaidasSemRaiz;

    if (periodo === "0") {
      const total = categoriesGrafico.length;
      const inicio = Math.max(0, total - 30);

      categoriesGrafico = categoriesGrafico.slice(inicio);
      backlogSemRaiz = backlogSemRaiz.slice(inicio);
      entrantesSemRaiz = entrantesSemRaiz.slice(inicio);
      saidasSemRaiz = saidasSemRaiz.slice(inicio);
    }

    return {
      categoriesGrafico,
      seriesGrafico: [
        {
          name: "Entrantes sem Raiz",
          data: entrantesSemRaiz,
          color: coresPadrão[7],
        },
        {
          name: "Saídas sem Raiz",
          data: saidasSemRaiz,
          color: coresPadrão[4],
        },
        {
          name: "Backlog do Dia",
          data: backlogSemRaiz,
          color: coresPadrão[1],
        },
      ],
    };
  }, [
    periodoAtual,
    categoriasDias,
    categoriasSemanas,
    categoriasMeses,

    diarioBacklogSemRaiz,
    semanalBacklogSemRaiz,
    mensalBacklogSemRaiz,

    diarioEntrantesSemRaiz,
    semanalEntrantesSemRaiz,
    mensalEntrantesSemRaiz,

    diarioSaidasSemRaiz,
    semanalSaidasSemRaiz,
    mensalSaidasSemRaiz,
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
      <p className="VisãoBacklogAcessoGraficoEntrantesParagrafoInfoAreas">
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
        <GraficoEntrantesIndividual
          seriesGrafico={dadosGraficoBacklogSemRaiz.seriesGrafico}
          categoriesGrafico={dadosGraficoBacklogSemRaiz.categoriesGrafico}
        />
      </div>
    </div>
  );
}
