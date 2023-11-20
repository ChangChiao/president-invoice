import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'invoice-bar-with-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bar-with-avatar global-body-lg">
      <img
        [style.border-color]="borderColor"
        class="avatar"
        [src]="avatar"
        alt="avatar"
      />
      <div class="rate">{{ name }}得票率</div>
      <div class="percentage">{{ winRate }} %</div>
    </div>
  `,
  styleUrls: ['./bar-with-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarWithAvatarComponent {
  @Input() name!: string;
  @Input() avatar!: string;
  @Input() winRate!: number;
  @Input() borderColor!: string;
}
