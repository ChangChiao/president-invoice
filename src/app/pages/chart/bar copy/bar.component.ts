import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { ChartData } from '../../../models';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div #chartBox class="chart-container-box">
        <canvas id="canvas">{{ chart }}</canvas>
      </div>
    </div>
  `,
  styleUrls: ['./bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent implements AfterViewInit {
  chart!: Chart;
  @Input() data!: ChartData;
  @Input() filterOject!: { type: string; id: string };

  @ViewChild('chartBox', { static: true })
  chartBox!: ElementRef;

  ngAfterViewInit() {
    this.drawChart();
    this.setChartBoxWidth();
    window.addEventListener('resize', () => {
      console.log('resize');
      this.chart.resize();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'].currentValue) {
      this.drawChart();
    }
  }

  setChartBoxWidth() {
    const count = this.chart.data.labels?.length ?? 5;
    this.chartBox.nativeElement.style.width = `${count * 80}px`;
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
    if (this.chart instanceof Chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.data.map((d) => d[key]),
        datasets: [
          {
            label: '大綠',
            data: this.data.map((d) => d.ddp),
            backgroundColor: 'green',
          },
          {
            label: '中藍',
            data: this.data.map((d) => d.kmt),
            backgroundColor: 'blue',
          },
          {
            label: '小橘',
            data: this.data.map((d) => d.pfp),
            backgroundColor: 'orange',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        aspectRatio: 2.5,
        scales: {
          y: {
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              stepSize: 20,
            },
          },
        },
        layout: {
          // padding: 20,
        },
        // scales: {
        //   r: {
        //     max: 5,
        //     min: 0,
        //     ticks: {
        //         stepSize: 0.5
        //     }
        // },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            callbacks: {},
          },
        },
      },
    });
  }
}
