import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { ChartData } from '../../../models';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <canvas id="canvas">{{ chart }}</canvas>
    </div>
  `,
  styleUrls: ['./bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent implements AfterViewInit {
  chart!: Chart;
  @Input() data!: ChartData;
  @Input() filterOject!: { type: string; id: string };

  ngAfterViewInit() {
    this.drawChart();
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

  getKeys() {
    if ('villageName' in this.data[0]) {
      return 'villageName';
    }
    if ('townName' in this.data[0]) {
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
            label: 'ddp',
            data: this.data.map((d) => d.ddp),
            backgroundColor: 'green',
          },
          {
            label: 'kmt',
            data: this.data.map((d) => d.kmt),
            backgroundColor: 'blue',
          },
          {
            label: 'pfp',
            data: this.data.map((d) => d.pfp),
            backgroundColor: 'orange',
          },
        ],
      },
      options: {
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
          // padding: 50,
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
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
          },
          legend: {
            labels: {
              font: {
                size: 14,
              },
            },
          },
        },
      },
    });
  }
}
