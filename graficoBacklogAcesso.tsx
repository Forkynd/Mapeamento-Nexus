import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function GraficoBacklogAcesso(props) {
  const seriesFiltradas = props.seriesGrafico
    .filter((serie) => {
      const total = (serie.data || []).reduce(
        (acc, val) => acc + (Number(val) || 0),
        0,
      );
      return total > 0;
    })
    .map((s) => ({ type: "column", ...s })) as Highcharts.SeriesColumnOptions[];

  const optionGeralBacklogAcesso = {
    chart: {
      height: 400,
      width: 1100,
      type: "bar",
      plotBorderColor: "rgb(182, 147, 237)",
      backgroundColor: "white",
      style: {
        fontFamily: "Helvetica, Arial, sans-serif !important",
      },
    },
    title: { text: undefined },
    subtitle: {
      text: undefined,
    },
    credits: { enabled: false },
    tooltip: {
      shared: true,
      padding: 2,
      useHTML: true,
      hideDelay: 250,

      headerFormat:
        '<div class="tooltipConteiner">' +
        '<table class="tooltipTable">' +
        '<thead class="tooltipTopo"><tr class="tooltipMes"><th colspan="2">Faixa de Tempo Referente - {point.key}</th></tr>' +
        "<tr><th colspan='2'>Total de Casos do SLA -" +
        " {point.total}</tr></th>" +
        '<th class="tooltipColunaTipo"><tr><td>Prioridade</td>' +
        "<td>Número de Casos</td></th></thead>",
      pointFormat:
        "<tbody class=tooltipCorpo>" +
        '<tr class=tooltipLinha style="backgroundColor:{series.color}"><td><b>{series.name}</b></td>' +
        "<td><b>{point.y}</b> ({point.percentage:.2f}%)</td></tr>" +
        "</td></tr>",
      footerFormat: "</table></tbody></div>",

      backgroundColor: "#10002B",
      borderRadius: 0,
      borderColor: "rgba(128, 128, 128, 0.324)",
      distance: 40,
      outside: false,
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

      style: {
        color: "rgb(160, 111, 239)",
      },
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      title: {
        text: "Faixa de Tempo (SLA)",
      },
      lineWidth: 3,
      lineColor: "rgb(54, 22, 106)",
      tickInterval: 1,
      categories: props.categoriasGraficoMeses || [],
      crosshair: true,
    },
    yAxis: {
      title: { text: "Quantidade" },
      stackLabels: {
        enabled: true,
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
      lineWidth: 3,
      lineColor: "rgb(54, 22, 106)",
      gridLineWidth: 1,
      gridLineColor: "rgb(182, 147, 237)",
      gridLineDashStyle: "solid",
    },
    plotOptions: {
      series: {
        states: {
          hover: {
            halo: false,
          },
        },
      },
      column: {
        shadow: {
          color: "rgb(54, 22, 106)",
          width: 5,
          opacity: 1,
          offsetX: 0,
          offsetY: 0,
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "12px",
            fontWeight: "bold",
          },
        },
        stacking: "normal",
        enableMouseTracking: true,
      },
    },
    series: seriesFiltradas,
  };

  return (
    <div className="VisãoPURAlarmeEspecíficoGraficoIndividualWrapper">
      <HighchartsReact
        highcharts={Highcharts}
        options={optionGeralBacklogAcesso}
      />
    </div>
  );
}
