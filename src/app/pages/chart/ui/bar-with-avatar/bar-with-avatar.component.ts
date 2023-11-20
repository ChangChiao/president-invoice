import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'invoice-bar-with-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `<p>bar-with-avatar works!</p>`,
  styleUrls: ['./bar-with-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarWithAvatarComponent {}
