import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { LetDirective } from '@ngrx/component';
import { AppComponentStore } from '../store/app.state';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    MatToolbarModule,
    RouterOutlet,
    SpinnerComponent,
  ],
  template: `
    <ng-container *ngrxLet="isLoading$ as isLoading">
      <mat-toolbar color="primary">
        <span>My Application</span>
      </mat-toolbar>
      <router-outlet></router-outlet>
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
