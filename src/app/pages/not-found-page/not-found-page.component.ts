import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'invoice-not-found-page',
  standalone: true,
  imports: [CommonModule],
  template: `<p>抱歉，頁面並不存在</p>`,
  styleUrls: ['./not-found-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {}
