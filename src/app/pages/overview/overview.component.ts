import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'invoice-app-overview',
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
      <mat-icon class="green" fontIcon="signal_cellular_alt"></mat-icon>
      <mat-icon fontIcon="moon"></mat-icon>
      <a [routerLink]="['/detail']" [queryParams]="{ id: 1 }">
        link to detail component
      </a>
      <a [routerLink]="['/rwd']"> rwd </a>
      <h1 class="title">overview works!</h1>
      <p class="desc">lorem12</p>
    </div>
  `,
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {}
