import { useMemo } from "react";
import GraficoBacklogAcesso from "./graficoBacklogAcesso";

const coresPrioridades = ["#3c0075", "#7e00eb", "#c57dff", "#e6c5ff"];

type DadoCardAtivo = {
  SLA_FAIXA_TEMPO_FILA_ATUAL?: string;
  PRIORIDADE?: string | number;
};

type Serie = { name: string; data: number[]; color: string };

export default function ConteinerGraficos({
  dadosCardAtivo,
}: {
  dadosCardAtivo: DadoCardAtivo[] | DadoCardAtivo;
}) {
  const dadosFonte = useMemo(() => {
    if (Array.isArray(dadosCardAtivo)) return dadosCardAtivo;
    return dadosCardAtivo ? [dadosCardAtivo] : [];
  }, [dadosCardAtivo]);

  const { categorias, series } = useMemo(() => {
    const mapaFaixas = new Map<string, Record<number, number>>();

    for (const item of dadosFonte) {
      const faixa = item.SLA_FAIXA_TEMPO_FILA_ATUAL || "";
      const prioridade = Number(item.PRIORIDADE) || 0;
      if (!faixa || ![1, 2, 3, 4].includes(prioridade)) continue;

      if (!mapaFaixas.has(faixa)) {
        mapaFaixas.set(faixa, { 1: 0, 2: 0, 3: 0, 4: 0 });
      }
      mapaFaixas.get(faixa)![prioridade] += 1;
    }

    const categoriasOrdenadas = Array.from(mapaFaixas.keys()).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, "")) || 0;
      const numB = parseInt(b.replace(/\D/g, "")) || 0;
      return numB - numA;
    });

    const seriesFinal: Serie[] = [1, 2, 3, 4].map((p, idx) => ({
      name: `P${p}`,
      data: categoriasOrdenadas.map((faixa) => mapaFaixas.get(faixa)![p] || 0),
      color: coresPrioridades[idx],
    }));

    return { categorias: categoriasOrdenadas, series: seriesFinal };
  }, [dadosFonte]);

  return (
    <div className="VisãoBacklogAcessoConteinerGraficoEvolução">
      <GraficoBacklogAcesso
        categoriasGraficoMeses={categorias}
        seriesGrafico={series}
        nomePeriodoGraficos="Faixa de Tempo"
      />
    </div>
  );
}
