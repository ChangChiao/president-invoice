import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'invoice-footer',
  imports: [],
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
