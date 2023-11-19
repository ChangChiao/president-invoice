import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message/message.component';

@Component({
  selector: 'invoice-loading',
  standalone: true,
  imports: [CommonModule, MessageComponent],
  template: `
  <div>
    <invoice-message class="global-section-title-lg" [isDark]="true" message="hello" />
    <invoice-message class="global-section-title-lg" [isLeft]="true" message="hiii" />
  </div>
  `,
  styleUrls: ['./loading-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {}
