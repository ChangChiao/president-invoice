import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message/message.component';

@Component({
  selector: 'invoice-loading',
  standalone: true,
  imports: [CommonModule, MessageComponent],
  template: `
  <div class="slogan-container">
    @for (message of messageList; track message.id) {
      <invoice-message [id]="message.id" class="global-section-title-lg" [isLeft]="!!message.isLeft" [isDark]="!!message.isDark" [message]="message.content" />
    } @empty {
      Empty list of message
    }
  </div>
  `,
  styleUrls: ['./loading-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  messageList = [
    {
      id: 'left-top',
      content: '凍蒜!凍蒜!',
    },
    {
      id: 'left-center',
      content: '點亮台灣',
      isDark: true,
    },
    {
      id: 'left-bottom',
      content: 'Taiwan No.1',
      isLeft: true,
    },
    {
      id: 'right-top',
      content: '逮灣發大財',
      isDark: true,
      isLeft: true,
    },
    {
      id: 'right-center',
      content: '2020台灣要贏',
    },
    {
      id: 'right-bottom',
      content: '結束藍綠對峙',
      isDark: true,
    },
  ];
}
