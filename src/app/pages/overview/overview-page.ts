import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { webBreakpoint } from '../../configs';

@Component({
  selector: 'invoice-overview',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  template: `
    <div>
      <mat-icon
        aria-hidden="false"
        aria-label="Example home icon"
        fontIcon="home"
        class="green"
      ></mat-icon>
      <mat-icon class="green" svgIcon="fog"></mat-icon>
      <mat-icon class="green" fontIcon="signal_cellular_alt"></mat-icon>
      <mat-icon fontIcon="moon"></mat-icon>
      <a [routerLink]="['/detail']" [queryParams]="{ id: 1 }">
        link to detail component
      </a>
      <a [routerLink]="['/rwd']"> rwd </a>
      <h1 class="title">overview works!</h1>
      <p class="desc">lorem12</p>
      @if(isSmallScreen()) {
      <p>small size</p>
      }
    </div>
  `,
  styleUrls: ['./overview-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  breakpointObserver = inject(BreakpointObserver);
  isSmallScreen = signal(false);
  constructor() {
    this.breakpointObserver.observe([webBreakpoint]).subscribe((result) => {
      if (result.matches) {
        console.log('大於 1024');
        this.isSmallScreen.set(false);
      } else {
        console.log('小於 1024');
        this.isSmallScreen.set(true);
      }
    });
  }
}
