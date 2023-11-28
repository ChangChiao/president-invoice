import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  NgZone,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { gsapZoom } from '../../../shared/domain/utils';
import { MessageComponent } from '../ui/message/message.component';

@Component({
  selector: 'invoice-loading',
  standalone: true,
  imports: [CommonModule, MessageComponent],
  template: `
  <div class="slogan-container">
    <img class="slogan-img" src="assets/img/vote-img.png" alt="icon" />
    @for (message of messageList; track message.id) {
      <invoice-message 
        [id]="message.id" 
        class="global-section-title-lg" 
        [isLeft]="!!message.isLeft" 
        [isDark]="!!message.isDark" 
        [message]="message.content" 
      />
    } 
  </div>
  `,
  styleUrls: ['./loading-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent implements AfterViewInit {
  #zone = inject(NgZone);
  #router = inject(Router);
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

  async ngAfterViewInit() {
    this.#zone.runOutsideAngular(() => {
      this.handleAnimation();
    });
  }

  handleAnimation() {
    gsapZoom('.slogan-img', { rotateZ: 90 });
    gsapZoom('#left-top', { rotateZ: 8, scale: 1.2, x: '-50%', y: '-100%' });
    gsapZoom('#left-center', { rotateZ: 2, scale: 1.1, x: '-80%', y: '-100%' });
    gsapZoom('#left-bottom', {
      rotateZ: -4,
      scale: 1.1,
      x: '-80%',
      y: '-40%',
    });
    gsapZoom('#right-top', { rotateZ: -5, scale: 1.2, x: '90%', y: '-100%' });
    gsapZoom('#right-center', {
      rotateZ: -10,
      scale: 1.1,
      x: '90%',
      y: '10%',
    });
    gsapZoom('#right-bottom', {
      rotateZ: 10,
      scale: 1.2,
      x: '90%',
      y: '100%',
    });
  }
}
