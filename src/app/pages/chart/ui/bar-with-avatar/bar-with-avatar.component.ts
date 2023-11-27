import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'invoice-bar-with-avatar',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  template: `
    <div class="bar-with-avatar global-body-lg">
      <invoice-avatar
        [avatar]="avatar"
        [borderColor]="borderColor"
      ></invoice-avatar>
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
