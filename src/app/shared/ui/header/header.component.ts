import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'invoice-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],
  template: `
    <header class="header" [ngClass]="{ active: isOpenMenu }">
      <a class="logo-link global-section-title-sm" routerLink="/overview">
        <img
          class="logo-img"
          src="assets/svg/{{ isOpenMenu ? 'NAV LOGO-B' : 'NAV LOGO' }}.svg"
          alt="logo"
        />
      </a>
      <ul class="menu">
        <li>
          <a class="global-section-title-sm" routerLink="/chart">開票地圖</a>
        </li>
        <li>
          <a class="global-section-title-sm" routerLink="/politics"
            >候選人政見</a
          >
        </li>
      </ul>
      <div
        class="hamburger"
        [ngClass]="{ active: isOpenMenu }"
        (click)="handleClickMenu()"
      >
        <span></span>
      </div>
    </header>
    @if (isOpenMenu) {
    <invoice-menu @fadeAnimation></invoice-menu>
    }
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('1s ease-out', style({ height: 100, opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: 100, opacity: 1 }),
        animate('1s ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class HeaderComponent {
  isOpenMenu = false;

  handleClickMenu() {
    this.isOpenMenu = !this.isOpenMenu;
  }
}
