import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'invoice-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="message light" [ngClass]="{ dark: isDark, left: isLeft }">
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
  @Input() isLeft: boolean = false;
  @Input() message!: string;
}
