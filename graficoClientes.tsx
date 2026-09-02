import { useMemo } from "react";
import GraficoBacklogAcesso from "./ConteinerGraficos/graficoBacklogAcesso";

const coresPrioridades = ["#3c0075", "#7e00eb", "#c57dff", "#e6c5ff"];

type DadoCardAtivo = {
  TEMPO_DECORRIDO_ATIVO?: string;
  PRIORIDADE?: string | number;
  [key: string]: any;
};

type Serie = { name: string; data: number[]; color: string };

function converterTempoParaDias(tempoStr: string): number {
  if (!tempoStr) return 0;

  const diasMatch = tempoStr.match(/(\d+)\s+days?/i);
  const horasMatch = tempoStr.match(/(\d{2}):(\d{2}):(\d{2})/);

  const dias = diasMatch ? Number(diasMatch[1]) : 0;

  let horas = 0;
  if (horasMatch) {
    horas =
      Number(horasMatch[1]) +
      Number(horasMatch[2]) / 60 +
      Number(horasMatch[3]) / 3600;
  }

  return dias + horas / 24;
}

function classificarFaixaDeTempo(dias: number): string {
  if (dias >= 120) return ">=120d";
  if (dias >= 90) return ">=90d";
  if (dias >= 60) return ">=60d";
  if (dias >= 30) return ">=30d";
  if (dias >= 3) return ">=3d";
  if (dias >= 1) return ">=24h"; // 1 dia
  return "<24h";
}

function derivarPrioridade(item: Record<string, any>): 1 | 2 | 3 | 4 {
  const p = item?.PRIORIDADE;
  const num = Number(p);
  if ([1, 2, 3, 4].includes(num)) return num as 1 | 2 | 3 | 4;

  const candidatosTextuais = [
    item?.PRIORIDADE,
    item?.PRIORIDADE_TX,
    item?.SEVERIDADE,
    item?.CRITICIDADE,
    item?.NIVEL,
    item?.NIVEL_PRIORIDADE,
  ]
    .filter(Boolean)
    .map((x: any) => String(x).trim().toUpperCase());

  for (const txt of candidatosTextuais) {
    if (/^P?\s*1$/.test(txt)) return 1;
    if (/^P?\s*2$/.test(txt)) return 2;
    if (/^P?\s*3$/.test(txt)) return 3;
    if (/^P?\s*4$/.test(txt)) return 4;

    if (/(CRITIC[AO]|CRÍTIC[AO]|ALT[AO])/.test(txt)) return 1; // Crítica/Alta -> P1
    if (/(M[EÉ]DI[OA])/.test(txt)) return 2; // Média -> P2
    if (/(BAIX[OA])/.test(txt)) return 3; // Baixa -> P3
  }

  return 4;
}

export default function ConteinerGraficosClientes({
  dadosCardAtivo,
}: {
  dadosCardAtivo: DadoCardAtivo[] | DadoCardAtivo;
}) {
  const dadosFonte = useMemo(() => {
    if (Array.isArray(dadosCardAtivo)) return dadosCardAtivo;
    return dadosCardAtivo ? [dadosCardAtivo] : [];
  }, [dadosCardAtivo]);

  const dadosComFaixa = useMemo(() => {
    return dadosFonte.map((item) => {
      const dias = converterTempoParaDias(
        item.TEMPO_DECORRIDO_ATIVO || item.TEMPO_DECORRIDO || "",
      );
      const faixa = classificarFaixaDeTempo(dias);

      return {
        ...item,
        FAIXA_TEMPO_CLIENTE: faixa,
      };
    });
  }, [dadosFonte]);

  const { categorias, series } = useMemo(() => {
    const mapaFaixas = new Map<string, Record<number, number>>();

    for (const item of dadosComFaixa) {
      const faixa = (item as any).FAIXA_TEMPO_CLIENTE || "";
      const prioridade = derivarPrioridade(item);

      if (!faixa) continue;

      if (!mapaFaixas.has(faixa)) {
        mapaFaixas.set(faixa, { 1: 0, 2: 0, 3: 0, 4: 0 });
      }
      mapaFaixas.get(faixa)![prioridade] += 1;
    }

    const ordemFixa = [
      ">=120d",
      ">=90d",
      ">=60d",
      ">=30d",
      ">=3d",
      ">=24h",
      "<24h",
    ];

    const categoriasOrdenadas = Array.from(mapaFaixas.keys()).sort(
      (a, b) => ordemFixa.indexOf(a) - ordemFixa.indexOf(b),
    );

    const seriesFinal: Serie[] = [1, 2, 3, 4].map((p, idx) => ({
      name: `P${p}`,
      data: categoriasOrdenadas.map((faixa) => mapaFaixas.get(faixa)![p] || 0),
      color: coresPrioridades[idx],
    }));

    return { categorias: categoriasOrdenadas, series: seriesFinal };
  }, [dadosComFaixa]);

  return (
    <div className="VisãoPURSubContentGeralWrapper">
      <GraficoBacklogAcesso
        categoriasGraficoMeses={categorias}
        seriesGrafico={series}
        nomePeriodoGraficos="Faixa de Tempo"
      />
    </div>
  );
}
