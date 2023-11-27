import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'invoice-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img
      [style.border-color]="borderColor"
      [style.width.px]="size"
      [style.height.px]="size"
      [src]="avatar"
      class="avatar"
      alt="avatar"
    />
  `,
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @Input() borderColor!: string;
  @Input() avatar!: string;
  @Input() size: number = 50;
}
