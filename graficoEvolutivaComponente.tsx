import Highcharts from "highcharts";
import { useMemo } from "react";
import HighchartsReact from "highcharts-react-official";
import LoaderBar from "../../../components/Loading/barLoader";

export default function GraficoEvolutivaComponente(props: any) {
  const coresPadrao = [
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

  const toNumberSafe = (val: string): number => {
    if (!val) return 0;
    let s = String(val).trim();
    if (s === "" || s.toLowerCase() === "null" || s.toLowerCase() === "nan")
      return 0;

    if (/^\d{1,3}(\.\d{3})*(,\d+)?$/.test(s)) {
      s = s.replace(/\./g, "").replace(",", ".");
    }

    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  };

  const toUTCTimestamp = (ymd: string): number | null => {
    if (!ymd) return null;
    const parts = ymd.split("-");
    if (parts.length !== 3) return null;
    const [yStr, mStr, dStr] = parts;
    const y = Number(yStr);
    const m = Number(mStr);
    const d = Number(dStr);
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d))
      return null;
    return Date.UTC(y, m - 1, d, 0, 0, 0, 0);
  };

  const dados = useMemo(
    () =>
      (props.dadosGraficoFormatos || []).map((d: any) => ({
        EIXO_X: (d.EIXO_X ?? "").toString().trim(),
        SUB_NOME_COLUNA: (d.SUB_NOME_COLUNA ?? "").toString().trim(),
        QTD_ITENS_STR: (d.QTD_ITENS ?? "").toString(),
        TITULO_MEDICAO: (d.TITULO_MEDICAO ?? "").toString(),
      })),
    [props.dadosGraficoFormatos],
  );

  const familias = useMemo(
    () => [...new Set(dados.map((d: any) => d.SUB_NOME_COLUNA))],
    [dados],
  );

  const series = useMemo(
    () =>
      familias.map((fam: string, i: number) => {
        const acc = new Map<number, number>();

        for (const d of dados) {
          if (d.SUB_NOME_COLUNA !== fam) continue;
          const ts = toUTCTimestamp(d.EIXO_X);
          if (ts == null) continue;

          const val = toNumberSafe(d.QTD_ITENS_STR);
          acc.set(ts, (acc.get(ts) || 0) + val);
        }

        const pontos: [number, number][] = Array.from(acc.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([ts, y]) => [ts, y]);

        return {
          name: fam,
          type: "spline" as const,
          color: coresPadrao[i % coresPadrao.length],
          lineWidth: 3,
          marker: {
            enabled: true,
            radius: 3,
            lineWidth: 1,
          },
          data: pontos,
          connectNulls: true,
        };
      }),
    [familias, dados],
  );

  const TITULO_MEDICAO = dados[0]?.TITULO_MEDICAO ?? "Total";

  const options: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "spline",
        height: props.tamanhoGraficoHeight ?? 400,
        width: props.tamanhoGraficoWidth ?? 1000,
        backgroundColor: "white",
      },

      credits: { enabled: false },
      title: { text: props.TituloPrincipal || "" },

      xAxis: {
        type: "datetime",
        dateTimeLabelFormats: {
          day: "%d/%m",
          week: "%d/%m",
          month: "%m/%Y",
          year: "%Y",
        },
        labels: { rotation: 0 },
        lineWidth: 2,
        lineColor: "#360E6A",
      },

      yAxis: {
        title: { text: TITULO_MEDICAO },
        gridLineColor: "#B693ED",
        min: 0,
        max: props.maxEixoY ?? null,
      },

      tooltip: {
        shared: true,
        padding: 6,
        useHTML: true,
        hideDelay: 250,
        backgroundColor: "#10002B",
        borderRadius: 0,
        borderColor: "rgba(128, 128, 128, 0.324)",
        distance: 30,
        outside: false,
        style: { color: "rgb(160, 111, 239)" },
        formatter: function () {
          const pts = (this as any).points || [(this as any).point];
          const x = (this as any).x as number | undefined;

          const total = pts.reduce((s: number, p: any) => s + (p?.y || 0), 0);

          const linhas = pts
            .map(
              (p: any) => `
              <tr class="tooltipLinha" style="background-color:#10002B">
                <td><b>Volumetria</b></td>
                <td><b>Total</b></td>
              </tr>
              <tr class="tooltipLinha" style="background-color:${p.series.color}">
                <td><b>Evolutiva do Período</b></td>
                <td><b>${p.y}</b> </td>
              </tr>`,
            )
            .join("");

          const dataFmt =
            typeof x === "number"
              ? Highcharts.dateFormat("%d/%m/%Y", x)
              : String((this as any).key ?? "");

          return `
            <div class="tooltipConteiner">
              <table class="tooltipTable">
                <thead class="tooltipTopo">
                  <tr class="tooltipMes"><th colspan="2">Dia - ${dataFmt}</th></tr>
                </thead>
                <tbody class="tooltipCorpo">
                  ${linhas}
                </tbody>
              </table>
            </div>
          `;
        },
        positioner: function (
          labelWidth: number,
          labelHeight: number,
          point: any,
        ) {
          const chart = this.chart;
          let plotX = point.plotX;
          let x = plotX + chart.plotLeft;

          const isRightHalf = plotX > chart.plotWidth / 2;
          x = isRightHalf ? x - labelWidth - 40 : x + 40;

          if (x + labelWidth > chart.chartWidth) {
            x = chart.chartWidth - labelWidth - 10;
          }

          if (x < 0) {
            x = 10;
          }

          let y = point.plotY - labelHeight - 30;

          if (y < 0) {
            y = point.plotY + 30;
          }

          if (y + labelHeight > chart.plotHeight) {
            y = chart.plotHeight - labelHeight - 10;
          }

          return { x, y };
        },
        shadow: {
          color: "rgb(54, 22, 106)",
          width: 10,
          opacity: 1,
          offsetX: 0,
          offsetY: 0,
        },
      },
      legend: { enabled: false },
      plotOptions: {
        spline: {
          dataLabels: {
            enabled: true,
            style: { fontSize: "10px" },
          },
          shadow: {
            color: "rgb(54, 22, 106)",
            width: 5,
            opacity: 1,
            offsetX: 0,
            offsetY: 0,
          },
        },
        series: {
          dataGrouping: { enabled: false } as any,
        },
      },
      series,
    }),
    [
      series,
      TITULO_MEDICAO,
      props.tamanhoGraficoHeight,
      props.tamanhoGraficoWidth,
      props.TituloPrincipal,
      props.maxEixoY,
    ],
  );

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}
