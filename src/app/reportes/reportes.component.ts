import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { StylesService } from '../services/styles.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Envioservice } from '../services/envios.service';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexNoData,
  ApexGrid,
  ApexDataLabels,
  ApexLegend,
  ApexFill,
  ApexTheme,
  ApexTooltip
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  noData: ApexNoData;
};

export type ChartOptionsMultiAxis = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  colors: string[];
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  noData: ApexNoData;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  yaxis: ApexYAxis[];
  tooltip: ApexTooltip;
  legend: ApexLegend;
  theme: ApexTheme;
};

export type RadialBarOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  noData: ApexNoData;
  colors: string[];
  fill: ApexFill;
  labels: string[];
  title: ApexTitleSubtitle;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  theme: ApexTheme;
  plotOptions: ApexPlotOptions;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  noData: ApexNoData;
};

declare var bootstrap: any;

@Component({
  selector: 'app-reportes',
  imports: [CommonModule, FormsModule, NgApexchartsModule, NgxDatatableModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent implements OnInit {
  public entregasVsRetrasos: ChartOptions;
  public tiempoTransitoPromedio: ChartOptions;
  public progresoEntregas: RadialBarOptions;
  public enviosPorServicio: PieChartOptions;

  public totalIngresos: ChartOptions;
  public ingresosPorServicioLine: ChartOptionsMultiAxis;
  public ingresosPorServicioPie: PieChartOptions;

  enviosActive:boolean = true;
  finanzasActive:boolean = false;
  resumenActive:boolean = false;

  loading: boolean = false;

  filtroStatus:any[] = [
    {name: 'Envíos', value: 'envios', active:true},
    {name: 'Finanzas', value: 'finanzas', active:false},
    {name: 'Resumen', value: 'resumen', active:false}
  ];

  rows = [
    { servicio: 'Servicio 1', pedidos_totales: 100, ingreso_total: 1000, peso_promedio: 10 },
    { servicio: 'Servicio 2', pedidos_totales: 200, ingreso_total: 2000, peso_promedio: 20 },
    { servicio: 'Servicio 3', pedidos_totales: 300, ingreso_total: 3000, peso_promedio: 30 },
    { servicio: 'Servicio 4', pedidos_totales: 400, ingreso_total: 4000, peso_promedio: 40 }
  ];
  
  columns = [
    { name: 'Servicio', prop: 'servicio', minWidth: 200, flexGrow: 2 }, 
    { name: 'Pedidos Totales', prop: 'pedidos_totales', minWidth:200, flexGrow: 1 },
    { name: 'Ingreso Total', prop: 'ingreso_total', minWidth:200, flexGrow: 1 }, 
    { name: 'Peso Promedio', prop: 'peso_promedio', resizeable: true, minWidth:200, flexGrow: 1 }
  ];

  constructor(private alertService: AlertService, private stylesService: StylesService, private enviosService: Envioservice) {
    this.entregasVsRetrasos = this.setEntregasVsRetrasosChart();
    this.tiempoTransitoPromedio = this.setTiempoTransitoPromedioChart();
    this.progresoEntregas = this.setProgresoEntregasChart();
    this.enviosPorServicio = this.setEnviosPorServicioChart();

    this.totalIngresos = this.setTotalIngresosChart();
    this.ingresosPorServicioLine = this.setIngresosPorServicioLineChart();
    this.ingresosPorServicioPie = this.setIngresoPorServicioPieChart();
  }
  
  ngOnInit(): void {
    
  }

  setEntregasVsRetrasosChart(): ChartOptions {
    let entregasVsRetrasos:ChartOptions = {
      series: [
        {
          name: "Entregadas",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 100],
          color: this.stylesService.getPrimaryBackground()
        },
        {
          name: "Retrasadas",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 100],
          color: this.stylesService.getSecondaryBackground()
        }
      ],
      chart: {
        height: '100%',
        width: '100%',
        type: "bar",
        toolbar: { show: false },
      },
      title: {
        text: "Entregas a tiempo Vs. Retrasadas",
        align: "left",
        offsetX: 0,
        offsetY: 0,
        margin: 20,
        style: {
          color: this.stylesService.getGray(),
          fontWeight: "700",
          fontSize: "1rem"
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          borderRadiusApplication: "end",
          columnWidth: "100%"
        }
      },
      stroke: {
        width: 4,                      // crea 4px de hueco entre barras
        colors: ['transparent']        // el hueco es “invisible” (transparent) :contentReference[oaicite:0]{index=0}
      },
      noData: {
        text: 'No hay datos disponibles',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: this.stylesService.getGray(),
          fontSize: '1.1rem',
        }
      },
      xaxis: {
        categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep"]
      }
    };

    return entregasVsRetrasos;
  }

  setTiempoTransitoPromedioChart(): ChartOptions {
    let tiempoTransitoPromedio:ChartOptions = {
      series: [
        {
          name: "Tiempo de tránsito",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 100],
          color: this.stylesService.getSecondaryBackground()
        }
      ],
      chart: {
        height: '100%',
        width: '100%',
        type: "line",
        toolbar: { show: false },
      },
      title: {
        text: "Tiempo de tránsito promedio",
        align: "left",
        offsetX: 0,
        offsetY: 0,
        margin: 20,
        style: {
          color: this.stylesService.getGray(),
          fontWeight: "700",
          fontSize: "1rem"
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          borderRadiusApplication: "end",
          columnWidth: "100%"
        }
      },
      stroke: {
        width: 4,                      // crea 4px de hueco entre barras
        colors: ['transparent']        // el hueco es “invisible” (transparent) :contentReference[oaicite:0]{index=0}
      },
      noData: {
        text: 'No hay datos disponibles',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: this.stylesService.getGray(),
          fontSize: '1.1rem',
        }
      },
      xaxis: {
        categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep"]
      }
    };

    return tiempoTransitoPromedio;
  }

  setProgresoEntregasChart(): RadialBarOptions {
    let progresoEntregasChart:RadialBarOptions = {
      series: [67],
      chart: {
        height: '100%',
        width: '100%',
        type: "radialBar",
        toolbar: { show: false },
      },
      colors: [this.stylesService.getSecondaryBackground()],
      title: {
        text: "Porcentaje de entregas",
        align: "left",
        offsetX: 0,
        offsetY: 0,
        margin: 20,
        style: {
          color: this.stylesService.getGray(),
          fontWeight: "700",
          fontSize: "1rem"
        }
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
            background: this.stylesService.getPrimaryBackground()
          },
          track: {
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              blur: 4,
              opacity: 0.15
            }
          },
          dataLabels: {
            name: {
              offsetY: -25,
              color: this.stylesService.getWhite(),
              fontSize: "1rem"
            },
            value: {
              color: this.stylesService.getWhite(),
              fontSize: "3rem",
              show: true
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: [this.stylesService.getGreen()],
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: "round"
      },
      noData: {
        text: 'No hay datos disponibles',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: this.stylesService.getGray(),
          fontSize: '1.1rem',
        }
      },
      labels: ["Entregados"]
    };

    return progresoEntregasChart;
  }

  setEnviosPorServicioChart(): PieChartOptions {
    let envioPorServicioChart:PieChartOptions = {
      series: [44, 55, 13, 33],
      chart: {
        height: '100%',
        width: '100%',
        type: "pie",
        toolbar: { show: false },
      },
      labels: [
        'Servicio 1',
        'Servicio 2',
        'Servicio 3',
        'Servicio 4'
      ],
      title: {
        text: "Envíos por servicio",
        align: "left",
        offsetX: 0,
        offsetY: 0,
        margin: 20,
        style: {
          color: this.stylesService.getGray(),
          fontWeight: "700",
          fontSize: "1rem"
        }
      },
      theme: {
        monochrome: {
          enabled: true,
          color: this.stylesService.getPrimaryBackground(),
          shadeTo: "light",
          shadeIntensity: 0.65
        }
      },
      plotOptions: {
        pie: {
          expandOnClick: true,
          dataLabels: {
            offset: -5,
            minAngleToShowLabel: 10
          }
        }
      },
      grid: {
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      dataLabels: {
        
      },
      legend: {
        show: true
      },
      noData: {
        text: 'No hay datos disponibles',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: this.stylesService.getGray(),
          fontSize: '1.1rem',
        }
      },
    };

    return envioPorServicioChart;
  }

  setTotalIngresosChart(): ChartOptions {
    let totalIngresosChart:ChartOptions = {
      series: [
        {
          name: "Ingresos totales",
          data: [10, 41, 35, 51, 49, 62, 69],
          color: this.stylesService.getSecondaryBackground()
        }
      ],
      chart: {
        height: '100%',
        width: '100%',
        type: "line",
        toolbar: { show: false },
      },
      title: {
        text: "Ingresos totales",
        align: "left",
        offsetX: 0,
        offsetY: 0,
        margin: 20,
        style: {
          color: this.stylesService.getGray(),
          fontWeight: "700",
          fontSize: "1rem"
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          borderRadiusApplication: "end",
          columnWidth: "100%"
        }
      },
      stroke: {
        width: 4,                      // crea 4px de hueco entre barras
        colors: ['transparent']        // el hueco es “invisible” (transparent) :contentReference[oaicite:0]{index=0}
      },
      noData: {
        text: 'No hay datos disponibles',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: this.stylesService.getGray(),
          fontSize: '1.1rem',
        }
      },
      xaxis: {
        categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep"]
      }
    };

    return totalIngresosChart;
  }

  setIngresosPorServicioLineChart(): ChartOptionsMultiAxis {
    let ingresosPorServicioChart:ChartOptionsMultiAxis = {
      chart: {
        stacked: false,
        height: '100%',
        width: '100%',
        type: "line",
        toolbar: { show: false },
      },
      dataLabels: {
        enabled: false
      },
      colors: [
        this.stylesService.getPrimaryBackground(), 
        this.stylesService.getSecondaryBackground(), 
        this.stylesService.getContrast(), 
        this.stylesService.getGreen(),
        this.stylesService.getGray(),
        this.stylesService.getShineWord(),
        this.stylesService.getMaleWord(),
      ],
      series: [
        {
          name: "Series A",
          data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
        },
        {
          name: "Series B",
          data: [20, 29, 0, 36, 44, 45, 50, 58]
        },
        {
          name: "Series C",
          data: [2, 4, 6, 8, 10, 12, 14, 16]
        },
        {
          name: "Series D",
          data: [3, 6, 9, 12, 15, 18, 21, 24]
        }
      ],
      stroke: {
        width: [4, 4, 4, 4]
      },
      plotOptions: {
        bar: {
          columnWidth: "20%"
        }
      },
      xaxis: {
        categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
      },
      yaxis: [
      ],
      tooltip: {
        shared: false,
        intersect: true,
        x: {
          show: false
        }
      },
      legend: {
        horizontalAlign: "left",
        offsetX: 40
      },
      title: {
        text: "Ingresos por servicio",
        align: "left",
        offsetX: 0,
        offsetY: 0,
        margin: 20,
        style: {
          color: this.stylesService.getGray(),
          fontWeight: "700",
          fontSize: "1rem"
        }
      },
      noData: {
        text: 'No hay datos disponibles',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: this.stylesService.getGray(),
          fontSize: '1.1rem',
        }
      },
      theme: {
        monochrome: {
          enabled: false,
          color: this.stylesService.getPrimaryBackground(),
          shadeTo: "light",
          shadeIntensity: 0.65
        }
      },
    };

    return ingresosPorServicioChart;
  }

  setIngresoPorServicioPieChart(): PieChartOptions {
    let ingresoPorServicioPieChart:PieChartOptions = {
      series: [44, 55, 13, 33],
      chart: {
        height: '100%',
        width: '100%',
        type: "pie",
        toolbar: { show: false },
      },
      labels: [
        'Servicio 1',
        'Servicio 2',
        'Servicio 3',
        'Servicio 4'
      ],
      title: {
        text: "Aporte por servicio",
        align: "left",
        offsetX: 0,
        offsetY: 0,
        margin: 20,
        style: {
          color: this.stylesService.getGray(),
          fontWeight: "700",
          fontSize: "1rem"
        }
      },
      theme: {
        monochrome: {
          enabled: true,
          color: this.stylesService.getPrimaryBackground(),
          shadeTo: "light",
          shadeIntensity: 0.65
        }
      },
      plotOptions: {
        pie: {
          expandOnClick: true,
          dataLabels: {
            offset: -5,
            minAngleToShowLabel: 10
          }
        }
      },
      grid: {
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      dataLabels: {
        
      },
      legend: {
        show: true
      },
      noData: {
        text: 'No hay datos disponibles',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: this.stylesService.getGray(),
          fontSize: '1.1rem',
        }
      },
    };

    return ingresoPorServicioPieChart;
  }

  handleFiltroReporte(event: Event): void {
    this.loading = true;

    const ele = event.target as HTMLButtonElement;
    const value = ele.value ?? 'envios';

    this.filtroStatus.forEach((item) => {
      item.active = item.value === value;

      if(item.active) {
        this.enviosActive = item.value === 'envios';
        this.finanzasActive = item.value === 'finanzas';
        this.resumenActive = item.value === 'resumen';
      }
    });

    this.loading = false;
  }

  exportAsCSV(): void {
    this.loading = true;

    try {
      this.enviosService.exportAsCsv().subscribe({
        next: (data) => {
          const blob = data;
          const url = window.URL.createObjectURL(blob);
          const a   = document.createElement('a');
          a.href      = url;
          a.download  = 'envios.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.loading = false;    
        },
        error: (error) => {
          this.alertService.showError('Error al exportar el archivo CSV.');
          this.loading = false;
          console.log(error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } catch (error) {
      this.alertService.showError('Error al exportar el archivo CSV.');
    }
  }

  exportAsXlsx(): void {
    this.loading = true;

    try {
      this.enviosService.exportAsXlsx().subscribe({
        next: (data) => {
          const blob = data;
          const url = window.URL.createObjectURL(blob);
          const a   = document.createElement('a');
          a.href      = url;
          a.download  = 'envios.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.loading = false;    
        },
        error: (error) => {
          this.alertService.showError('Error al exportar el archivo XLSX.');
          this.loading = false;
          console.log(error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } catch (error) {
      this.alertService.showError('Error al exportar el archivo XLSX.');
    }
  }
}
