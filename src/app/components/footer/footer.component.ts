import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'invoice-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer>
      <span class="email global-section-title-sm">{{
        '樹懶設計 shulian @ gmail.com'
      }}</span>
      <span class="global-body-md">© 2023 樹懶設計 shulian 版權所有</span>
    </footer>
  `,
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
