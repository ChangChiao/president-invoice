import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { AppComponentStore } from '../../../shared/domain/store';
import { BarComponent } from '../ui/bar/bar.component';
import { ChartInfoComponent } from '../ui/chart-info/chart-info.component';
import { MapComponent } from '../ui/map/map.component';
import { SearchComponent } from '../ui/search/search.component';

@Component({
  selector: 'invoice-chart',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    BarComponent,
    ChartInfoComponent,
    MapComponent,
    SearchComponent,
  ],
  template: `
    <div class="chart-container" *ngrxLet="vm$ as vm">
      <invoice-chart-info
        [voteData]="vm.voteData"
        [overViewType]="vm.overViewType"
        [selectedAreaObj]="vm.selectedAreaObj"
      ></invoice-chart-info>
      <div class="map-container">
        <invoice-search
          #searchRef
          [voteData]="vm.voteData"
          [selectedAreaObj]="vm.selectedAreaObj"
        ></invoice-search>
        <invoice-map
          (resetSelect)="resetSelect()"
          [selectedAreaObj]="vm.selectedAreaObj"
          [mapData]="vm.mapData"
        ></invoice-map>
      </div>
    </div>
  `,
  styleUrls: ['./chart-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  @ViewChild('searchRef') searchComponent!: SearchComponent;
  #store = inject(AppComponentStore);

  vm$ = this.#store.vm$;

  resetSelect() {
    this.searchComponent.resetSearch();
  }
}
