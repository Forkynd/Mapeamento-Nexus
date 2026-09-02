import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function GraficoEntrantesGeralIndividual(props) {
  const seriesFiltradas = props.seriesGrafico.map((serie) => ({
    ...serie,
    data: serie.data.map((valor) => (valor === 0 ? null : valor)),
  }));

  const optionGeralBacklogAcesso = {
    chart: {
      height: 400,
      width: 1250,
      type: "column",
      plotBorderColor: "rgb(182, 147, 237)",
      backgroundColor: "white",
      zooming: {
        type: "x",
      },
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
        '<thead class="tooltipTopo"><tr class="tooltipMes"><th colspan="2">Período Referente - {point.key}</th></tr>' +
        // "<tr><th colspan='2'>Total do Período -" +
        // " {point.total}</tr></th>" +
        '<th class="tooltipColunaTipo"><tr><td>Tipo de Fila</td>' +
        "<td>Total da Fila</td></th></thead>",
      pointFormat:
        "<tbody class=tooltipCorpo>" +
        '<tr class=tooltipLinha style="backgroundColor:{series.color}"><td><b>{series.name}</b></td>' +
        "<td><b>{point.y}</b></td></tr>" +
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
      enabled: true,
      align: "center",
      verticalAlign: "top",
      layout: "horizontal",
      padding: 0,
      margin: 10,
    },
    xAxis: {
      title: {
        text: "Datas do Período",
      },
      lineWidth: 3,
      lineColor: "rgb(54, 22, 106)",
      tickInterval: 1,
      categories: props.categoriesGrafico,
      crosshair: true,
    },
    yAxis: {
      type: "linear",
      title: { text: "Volumetria Total" },
      stackLabels: {
        enabled: false,
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
          hover: { halo: false },
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
        stacking: "normal",
        minPointLength: 15,
        enableMouseTracking: true,
        dataLabels: {
          enabled: true,
          inside: true,
          style: {
            fontSize: "10px",
            fontWeight: "bold",
          },
          // formatter: function () {
          //   const point = this.point;
          //   const altura = point.shapeArgs?.height || 0;
          //   const ALTURA_MINIMA = 16;

          //   if (altura < ALTURA_MINIMA) {
          //     return null;
          //   }
          //   return this.y;
          // },
        },
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
