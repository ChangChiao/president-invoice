import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { AppComponentStore } from '../shared/domain/store/app.state';
import { FooterComponent } from '../shared/ui/footer/footer.component';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { LoadingComponent } from '../shared/ui/loading/loading';
import { SpinnerComponent } from '../shared/ui/spinner/spinner.component';

@Component({
  selector: 'invoice-shell',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    MatToolbarModule,
    RouterOutlet,
    SpinnerComponent,
    HeaderComponent,
    FooterComponent,
    LoadingComponent,
  ],
  template: `
    <ng-container>
      <invoice-header></invoice-header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <invoice-footer></invoice-footer>
      @if (loading()) {
      <invoice-loading [@fadeInOut]></invoice-loading>
      }
    </ng-container>
  `,
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':leave', animate(300, style({ opacity: 0 }))),
    ]),
  ],
})
export class ShellComponent {
  #store = inject(AppComponentStore);
  isLoading$ = this.#store.loading$;
  loading = signal(false);

  constructor() {
    this.isLoading$.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.loading.set(value);
    });
  }
}
