import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as echarts from 'echarts';
import type { BarSeriesOption } from 'echarts/charts';
import type { ComposeOption } from 'echarts/core';
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption,
} from 'echarts/components';

import { ChartData } from 'src/app/models';

type ECOption = ComposeOption<
  | BarSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>;

type ECharts = ReturnType<typeof echarts.init>;
type BarItem = (string | number)[];

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [CommonModule],
  template: `<div #chart class="chart"></div> `,
  styleUrls: ['./bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent implements OnChanges, AfterViewInit {
  @Input() data!: ChartData;
  @Input() filterOject!: { type: string; id: string };

  chartOptions!: ECOption;
  myChart!: ECharts;
  @ViewChild('chart', { static: true })
  chart!: ElementRef;

  ngAfterViewInit() {
    this.myChart = echarts.init(this.chart.nativeElement);
    this.drawChart();
    window.addEventListener('resize', () => {
      console.log('resize');
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'].currentValue) {
      this.myChart && this.drawChart();
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

  createData() {
    const key = this.getKeys() as keyof typeof this.data[0];
    const valueArr = this.data.reduce((prev: BarItem[], curr) => {
      const { ddp, kmt, pfp } = curr;
      return [...prev, [curr[key], ddp, kmt, pfp]];
    }, []);
    return valueArr;
  }

  drawChart() {
    const key = this.getKeys() as keyof typeof this.data[0];
    const barData = this.createData();
    this.chartOptions = {
      tooltip: {},
      dataset: {
        source: [['得票率', '小率', '小蘭', '小菊'], ...barData],
      },
      xAxis: { type: 'category' },
      // xAxis: { type: 'category', data: this.data.map((d) => d[key]) },
      yAxis: {},
      dataZoom: [{ type: 'slider', bottom: 20, height: 10, start: 0, end: 30 }],
      legend: {
        orient: 'horizontal',
        right: 'center',
        top: 'top',
      },
      series: [
        {
          type: 'bar',
          barGap: '20%',
          barCategoryGap: '40%',
          // data: this.data.map((d) => d.ddp),
          itemStyle: {
            borderWidth: 10,
            borderType: 'solid',
            color: 'green',
          },
        },
        {
          type: 'bar',
          barGap: '20%',
          barCategoryGap: '40%',
          // data: this.data.map((d) => d.kmt),
          itemStyle: {
            borderWidth: 10,
            borderType: 'solid',
            color: 'steelblue',
          },
        },
        {
          type: 'bar',
          barGap: '20%',
          barCategoryGap: '40%',
          // data: this.data.map((d) => d.pfp),
          itemStyle: {
            borderWidth: 10,
            borderType: 'solid',
            color: 'orange',
          },
        },
      ],
    };
    this.myChart.setOption(this.chartOptions);
  }
}
