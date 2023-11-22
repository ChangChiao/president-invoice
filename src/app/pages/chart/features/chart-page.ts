import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentStore } from '../../../shared/domain/store';
import { LetDirective } from '@ngrx/component';
import { BarComponent } from '../ui/bar/bar.component';
import { ChartInfoComponent } from '../ui/chart-info/chart-info.component';
import { MapComponent } from '../ui/map/map.component';

@Component({
  selector: 'invoice-chart',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    BarComponent,
    ChartInfoComponent,
    MapComponent,
  ],
  template: `
    <div class="chart-container" *ngrxLet="vm$ as vm">
      <invoice-chart-info
        [data]="vm.voteData"
        [overViewType]="vm.overViewType"
        [selectedOption]="vm.selectedOption"
      ></invoice-chart-info>
      <div>
        <invoice-map></invoice-map>
      </div>
    </div>
  `,
  styleUrls: ['./chart-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  #store = inject(AppComponentStore);

  vm$ = this.#store.vm$;
}
