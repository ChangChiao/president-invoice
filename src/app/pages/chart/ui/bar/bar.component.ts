import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { AreaPropertiesItem } from '../../../../shared/domain/models';

@Component({
  selector: 'invoice-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bar">
      <div [style.width.%]="ddfWidth" class="inner ddp"></div>
      <div [style.width.%]="kmtWidth" class="inner kmt"></div>
      <div [style.width.%]="pfpWidth" class="inner pfp"></div>
    </div>
  `,
  styleUrls: ['./bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent implements OnChanges {
  @Input() data!: AreaPropertiesItem;
  #cd = inject(ChangeDetectorRef);

  ddfWidth = 0;
  kmtWidth = 0;
  pfpWidth = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].currentValue) {
      this.calcPercentage(changes['data'].currentValue);
    }
  }

  calcPercentage(data: AreaPropertiesItem) {
    const { ddp, kmt, pfp } = data;
    const ddpWidth = (ddp / (ddp + kmt + pfp)) * 100;
    const kmtWidth = (kmt / (ddp + kmt + pfp)) * 100;
    const pfpWidth = (pfp / (ddp + kmt + pfp)) * 100;
    this.ddfWidth = Math.round(ddpWidth);
    this.kmtWidth = Math.round(kmtWidth);
    this.pfpWidth = Math.round(pfpWidth);
  }
}
