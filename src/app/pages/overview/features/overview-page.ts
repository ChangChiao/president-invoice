import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { webBreakpoint } from '../../../shared/domain/configs';
import { BuildingComponent } from '../ui/building/building.component';

@Component({
  selector: 'invoice-overview',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, BuildingComponent],
  template: `
    <div class="overview-container">
      <invoice-building></invoice-building>
      <div class="candidate-group">
        <div class="candidate candidate-kmt" (click)="redirect()">
          <img
            class="portrait"
            src="assets/svg/kmt-portrait.svg"
            alt="candidate"
          />
          <img class="more" src="assets/svg/kmt_btn.svg" alt="btn" />
        </div>
        <div class="candidate candidate-ddp" (click)="redirect()">
          <img class="more" src="assets/svg/ddp_btn.svg" alt="btn" />
          <img
            class="portrait"
            src="assets/svg/ddp-portrait.svg"
            alt="candidate"
          />
        </div>
        <div class="candidate candidate-pfp" (click)="redirect()">
          <img
            class="portrait"
            src="assets/svg/pfp-portrait.svg"
            alt="candidate"
          />
          <img class="more" src="assets/svg/pfp_btn.svg" alt="btn" />
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./overview-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  #router = inject(Router);
  breakpointObserver = inject(BreakpointObserver);
  isSmallScreen = signal(false);
  constructor() {
    this.breakpointObserver.observe([webBreakpoint]).subscribe((result) => {
      if (result.matches) {
        this.isSmallScreen.set(false);
      } else {
        this.isSmallScreen.set(true);
      }
    });
  }

  redirect() {
    this.#router.navigate(['/chart']);
  }
}
