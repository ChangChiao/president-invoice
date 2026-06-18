import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'invoice-building',
  imports: [],
  template: `
    <div class="building">
      <div class="building-half-circle"></div>
      <div class="building-container">
        <div class="building-mask"></div>
        <img
          class="building-img"
          src="assets/img/building.png"
          alt="building"
        />
        <span> 誰能入主總統府？ </span>
      </div>
    </div>
  `,
  styleUrls: ['./building.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingComponent {}
