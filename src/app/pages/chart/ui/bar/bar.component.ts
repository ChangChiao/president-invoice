import { ChartData } from '../../../../shared/domain/models';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'invoice-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bar">
      <div [style.width]="ddfWidth" class="inner ddp"></div>
      <div [style.width]="kmtWidth" class="inner kmt"></div>
      <div [style.width]="pfpWidth" class="inner pfp"></div>
    </div>
  `,
  styleUrls: ['./bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent implements OnChanges {
  @Input() data!: ChartData;

  ddfWidth = 0;
  kmtWidth = 0;
  pfpWidth = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].currentValue) {
      const { ddp, kmt, pfp } = changes['data'].currentValue;
      const ddpWidth = (ddp / (ddp + kmt + pfp)) * 100;
      const kmtWidth = (kmt / (ddp + kmt + pfp)) * 100;
      const pfpWidth = (pfp / (ddp + kmt + pfp)) * 100;
      this.ddfWidth = ddpWidth;
      this.kmtWidth = kmtWidth;
      this.pfpWidth = pfpWidth;
      // bar.style.setProperty('--ddp-width', ddpWidth + '%');
      // bar.style.setProperty('--kmt-width', kmtWidth + '%');
      // bar.style.setProperty('--pfp-width', pfpWidth + '%');
    }
  }
}
