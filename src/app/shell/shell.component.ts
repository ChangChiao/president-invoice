import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { LetDirective } from '@ngrx/component';
import { AppComponentStore } from '../store/app.state';
import { FooterComponent } from '../components/footer/footer.component';
import { HeaderComponent } from '../components/header/header.component';

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
  ],
  template: `
    <ng-container *ngrxLet="isLoading$ as isLoading">
      <invoice-header></invoice-header>
      <router-outlet></router-outlet>
      <invoice-footer></invoice-footer>
      <app-spinner *ngIf="isLoading"></app-spinner>
    </ng-container>
  `,
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  #store = inject(AppComponentStore);
  isLoading$ = this.#store.loading$;
}
