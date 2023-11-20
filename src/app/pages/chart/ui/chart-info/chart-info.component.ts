import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData } from '../../../../shared/domain/models';

@Component({
  selector: 'invoice-chart-info',
  standalone: true,
  imports: [CommonModule],
  template: ` <div class="chart-info">
    <div class="chart-info-title global-section-title-md">全台</div>
    <div class="chart-info-avatar"></div>
  </div>`,
  styleUrls: ['./chart-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartInfoComponent {
  @Input() data!: ChartData;
}
