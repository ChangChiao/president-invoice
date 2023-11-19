import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'invoice-loading',
  standalone: true,
  imports: [CommonModule],
  template: `<p>loading works!</p>`,
  styleUrls: ['./loading-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {}
