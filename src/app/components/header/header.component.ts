import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'invoice-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <a class="global-section-title-sm" routerLink="/overview">
        <img class="logo" src="assets/svg/NAV LOGO.svg" alt="logo" />
      </a>
      <ul class="menu">
        <li>
          <a class="global-section-title-sm" routerLink="/loading">開票地圖</a>
        </li>
      </ul>
    </header>
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
