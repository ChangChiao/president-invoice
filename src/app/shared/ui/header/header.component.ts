import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

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
    <invoice-menu></invoice-menu>
    }
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isOpenMenu = false;

  handleClickMenu() {
    this.isOpenMenu = !this.isOpenMenu;
  }
}
