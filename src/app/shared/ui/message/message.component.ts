import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Direction } from '../../domain/models';

@Component({
  selector: 'invoice-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="message light" [class]="direction" [ngClass]="{ dark: isDark }">
      {{ message }}
      <div class="message-triangle">
        <div class="message-inner-triangle"></div>
      </div>
    </div>
  `,
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  @Input() isDark: boolean = false;
  @Input() direction: Direction = 'bottom-left';
  @Input() message!: string;
}
