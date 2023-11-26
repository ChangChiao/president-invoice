import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { AppComponentStore } from '../shared/domain/store/app.state';
import { FooterComponent } from '../shared/ui/footer/footer.component';
import { HeaderComponent } from '../shared/ui/header/header.component';
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
  ],
  template: `
    <ng-container *ngrxLet="isLoading$ as isLoading">
      <invoice-header></invoice-header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <invoice-footer></invoice-footer>
      <invoice-spinner *ngIf="isLoading"></invoice-spinner>
    </ng-container>
  `,
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  #store = inject(AppComponentStore);
  isLoading$ = this.#store.loading$;
}
