import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  NgZone,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from '../ui/message/message.component';
import { gsap, Power1 } from 'gsap';
import { Router } from '@angular/router';

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
    } @empty {
      Empty list of message
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.#router.navigate(['/overview']);
    }, 2000);
    this.#zone.runOutsideAngular(() => {
      gsap.fromTo(
        '#left-top',
        {
          scale: 0.6,
          x: 0,
          y: 0,
          rotateZ: 0,
        },
        {
          rotateZ: 8,
          scale: 1.2,
          x: '-50%',
          y: '-100%',
          repeat: 1,
          // delay: 1,
          yoyo: true,
          duration: 1,
          ease: Power1.easeInOut,
        }
      );
      gsap.fromTo(
        '#left-center',
        {
          scale: 0.7,
          x: 0,
          y: 0,
          rotateZ: 0,
        },
        {
          scale: 1.1,
          rotateZ: 2,
          x: '-80%',
          y: '20%',
          // delay: 1,
          repeat: 1,
          yoyo: true,
          duration: 1,
          ease: Power1.easeInOut,
        }
      );
      gsap.fromTo(
        '#left-bottom',
        {
          scale: 0.7,
          x: 0,
          y: 0,
          rotateZ: 0,
        },
        {
          scale: 1.2,
          x: '-80%',
          y: '120%',
          rotateZ: -10,
          // delay: 1,
          repeat: 1,
          yoyo: true,
          duration: 1,
          ease: Power1.easeInOut,
        }
      );
      gsap.fromTo(
        '#right-top',
        {
          scale: 0.6,
          x: 0,
          y: 0,
          rotateZ: 0,
        },
        {
          rotateZ: -5,
          scale: 1.2,
          x: '90%',
          y: '-100%',
          // delay: 1,
          repeat: 1,
          yoyo: true,
          duration: 1,
          ease: Power1.easeInOut,
        }
      );
      gsap.fromTo(
        '#right-center',
        {
          scale: 0.5,
          x: 0,
          y: 0,
          rotateZ: 0,
        },
        {
          scale: 1.1,
          rotateZ: -10,
          x: '90%',
          y: '10%',
          // delay: 1,
          repeat: 1,
          yoyo: true,
          duration: 1,
          ease: Power1.easeInOut,
        }
      );
      gsap.fromTo(
        '#right-bottom',
        {
          scale: 0.7,
          rotateZ: 0,
          x: 0,
          y: 0,
        },
        {
          scale: 1.2,
          rotateZ: 10,
          x: '90%',
          y: '100%',
          // delay: 1,
          repeat: 1,
          yoyo: true,
          duration: 1,
          ease: Power1.easeInOut,
        }
      );

      gsap.fromTo(
        '.slogan-img',
        {
          rotateZ: 0,
        },
        {
          rotateZ: 90,
          // delay: 1,
          yoyo: true,
          repeat: 1,
          duration: 1,
          ease: Power1.easeInOut,
        }
      );
    });
  }
}
