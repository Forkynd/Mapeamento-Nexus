// src/pages/.../GraficoEvolutivaBacklog.tsx
import { useEffect, useMemo, useState } from "react";
import * as Service from "../../../service/coleta-service";
import GraficoEvolutivaComponente from "./graficoEvolutivaComponente";

type EvolutivaDTO = {
  QTD: number;
  GRUPO: string;
  DIA: string;
  AREA_RESPONSAVEL: string;
};

const norm = (s?: string) =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

export default function GraficoEvolutivaBacklog({
  titulo,
}: {
  titulo?: string;
}) {
  const [dadosGerais, setDadosGerais] = useState<EvolutivaDTO[]>([]);

  useEffect(() => {
    Service.getEvolutivaBacklog().then((response) => {
      setDadosGerais(response?.data);
    });
  }, []);

  const isTituloDeArea = useMemo(() => {
    if (!titulo) return false;
    const t = norm(titulo);
    if (t.startsWith("TOTAL") || t === "CLIENTES") return false;
    return true;
  }, [titulo]);

  const dadosFiltrados = useMemo(() => {
    const t = norm(titulo);

    if (t === norm("Total sem Raiz")) {
      return dadosGerais || [];
    }

    if (!isTituloDeArea) {
      return dadosGerais;
    }
    const alvo = norm(titulo);
    return (dadosGerais || []).filter((d) => norm(d.AREA_RESPONSAVEL) === alvo);
  }, [dadosGerais, isTituloDeArea, titulo]);

  const dadosOrdenados = useMemo(() => {
    const copy = [...(dadosFiltrados || [])];
    copy.sort(
      (a, b) =>
        new Date(a.DIA as string).getTime() -
        new Date(b.DIA as string).getTime(),
    );
    return copy;
  }, [dadosFiltrados]);

  const dadosGraficoFormatos = useMemo(() => {
    const mapa = new Map<string, number>();

    for (const item of dadosOrdenados || []) {
      const dia = item.DIA.split(" ")[0];

      const qtd = Number(item.QTD);

      mapa.set(dia, (mapa.get(dia) || 0) + qtd);
    }

    return [...mapa.entries()].map(([dia, total]) => ({
      EIXO_X: dia,
      SUB_NOME_COLUNA: "Total",
      QTD_ITENS: String(total),
      TITULO_MEDICAO: "Total",
      TITULO_TOOLTIP_MEDICAO: "Data",
      TITULO_LADO_Y: "Quantidade",
      TIPO_SERIE: "spline",
    }));
  }, [dadosOrdenados]);

  const maxEixoY = useMemo(() => {
    const valores = (dadosGraficoFormatos || []).map((d) =>
      Number(d.QTD_ITENS ?? 0),
    );
    const max = valores.length ? Math.max(...valores) : 0;
    if (max <= 0) return 1;
    return Math.ceil(max * 1.1);
  }, [dadosGraficoFormatos]);

  return (
    <>
      <div className="VisãoBacklogAcessoGraficoEvolutivaWrapper">
        <p className="VisãoBacklogAcessoGraficoEvolutivaInfoParagrafo">
          Dados de Evolução da Fila <b>Demonstrados de 15 em 15 dias</b>.
        </p>
        <GraficoEvolutivaComponente
          dadosGraficoFormatos={dadosGraficoFormatos}
          tamanhoGraficoWidth={1130}
          tamanhoGraficoHeight={400}
          fontSizeTooltip={"10px"}
          reversedStacks={false}
          maxEixoY={maxEixoY}
        />
      </div>
    </>
  );
}
