import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'invoice-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <a class="logo-link global-section-title-sm" routerLink="/overview">
        <img class="logo-img" src="assets/svg/NAV LOGO.svg" alt="logo" />
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
      <div class="hamburger">
        <div class="hamburger-line"></div>
        <div class="hamburger-line"></div>
        <div class="hamburger-line"></div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
