import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'invoice-building',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="building">
      <div class="building-mask"></div>
      <img class="building-img" src="assets/img/building.png" alt="building" />
    </div>
  `,
  styleUrls: ['./building.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingComponent {}
