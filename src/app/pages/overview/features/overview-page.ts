import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { tap } from 'rxjs';
import { AppComponentStore } from '../../../shared/domain/store';
import { BuildingComponent } from '../ui/building/building.component';
import { wait } from './../../../shared/domain/utils/wait';

@Component({
  selector: 'invoice-overview',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, BuildingComponent],
  template: `
    <div class="overview-container">
      <invoice-building></invoice-building>
      <div class="candidate-group">
        <div class="candidate candidate-kmt" (click)="redirect('kmt')">
          <img
            class="portrait"
            src="assets/svg/kmt-portrait.svg"
            alt="candidate"
          />
          <img class="more" src="assets/svg/kmt_btn.svg" alt="btn" />
        </div>
        <div class="candidate candidate-ddp" (click)="redirect('ddp')">
          <img class="more" src="assets/svg/ddp_btn.svg" alt="btn" />
          <img
            class="portrait"
            src="assets/svg/ddp-portrait.svg"
            alt="candidate"
          />
        </div>
        <div class="candidate candidate-pfp" (click)="redirect('pfp')">
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
  #store = inject(AppComponentStore);
  #initialLoad = this.#store.initialLoad$;
  breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.#initialLoad
      .pipe(
        takeUntilDestroyed(),
        tap(async (value) => {
          if (!value) {
            await this.handleLoading();
          }
        })
      )
      .subscribe();
  }

  async handleLoading() {
    this.#store.setLoading(true);
    await wait(1700);
    this.#store.setLoading(false);
    this.#store.setInitialLoad(true);
  }

  redirect(type: string) {
    this.#router.navigate(['/politics'], { queryParams: { id: type } });
  }
}
