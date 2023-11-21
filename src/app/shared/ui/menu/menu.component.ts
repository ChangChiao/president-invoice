import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'invoice-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="menu">
      <nav class="menu-list">
        <ul>
          @for (item of menu; track item.url) {
          <li class="global-section-title-lg">
            <a [title]="item.title" [href]="item.url">{{ item.title }}</a>
          </li>
          }
        </ul>
      </nav>
      <img class="building" src="assets/img/building.png" />
    </div>
  `,
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  menu = [
    { title: '首頁', url: '/overview' },
    { title: '開票地圖', url: '/chart' },
    { title: '候選人政見', url: '/politics' },
  ];
}
