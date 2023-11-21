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
          <li class="global-section-title-md">
            <a [alt]="item.title" [href]="item.url"></a>
          </li>
          }
        </ul>
      </nav>
    </div>
  `,
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  menu = [
    { title: '首頁', url: '/overview' },
    { title: '開票地圖', url: '/chart' },
  ];
}
