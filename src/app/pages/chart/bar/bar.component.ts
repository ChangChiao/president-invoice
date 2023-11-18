import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
} from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartData } from 'src/app/models';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="chart">
      <apx-chart
        [series]="chartOptions.series!"
        [chart]="chartOptions.chart!"
        [dataLabels]="chartOptions.dataLabels!"
        [plotOptions]="chartOptions.plotOptions!"
        [yaxis]="chartOptions.yaxis!"
        [legend]="chartOptions.legend!"
        [fill]="chartOptions.fill!"
        [stroke]="chartOptions.stroke!"
        [tooltip]="chartOptions.tooltip!"
        [xaxis]="chartOptions.xaxis!"
      ></apx-chart>
    </div>
  `,
  styleUrls: ['./bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent implements OnChanges, AfterViewInit {
  @Input() data!: ChartData;
  @Input() filterOject!: { type: string; id: string };

  @ViewChild('chart') chart!: ChartComponent;
  chartOptions!: Partial<ChartOptions>;

  ngAfterViewInit() {
    this.drawChart();
    window.addEventListener('resize', () => {
      console.log('resize');
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'].currentValue) {
      this.drawChart();
    }
  }

  getKeys() {
    const element = this.data[0];
    if ('villageName' in element) {
      return 'villageName';
    }
    if ('townName' in element) {
      return 'townName';
    }
    return 'countryName';
  }

  drawChart() {
    const key = this.getKeys() as keyof typeof this.data[0];
    this.chartOptions = {
      series: [
        {
          name: '大綠',
          data: this.data.map((d) => d.ddp),
        },
        {
          name: '中藍',
          data: this.data.map((d) => d.kmt),
        },
        {
          name: '小橘',
          data: this.data.map((d) => d.pfp),
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        width: this.data.length * 80,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        range: 7,
        categories: this.data.map((d) => d[key]),
      },
      yaxis: {
        showAlways: true,
        tickAmount: 5,
        min: 0,
        max: 100,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + '%';
          },
        },
      },
    };
  }
}
