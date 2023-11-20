import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentStore } from '../../../shared/domain/store';
import { tap } from 'rxjs';
import { LetDirective } from '@ngrx/component';
import { VoteState } from '../../../shared/domain/models';
import { BarComponent } from '../ui/bar/bar.component';
import { ChartInfoComponent } from '../ui/chart-info/chart-info.component';

@Component({
  selector: 'invoice-chart',
  standalone: true,
  imports: [CommonModule, LetDirective, BarComponent, ChartInfoComponent],
  template: `
    <div class="chart-container" *ngrxLet="vm$ as vm">
      <invoice-chart-info
        [data]="vm.voteData"
        [overViewType]="vm.overViewType"
        [selectedOption]="vm.selectedOption"
      ></invoice-chart-info>
      <div>
        <map></map>
      </div>
    </div>
  `,
  styleUrls: ['./chart-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  #store = inject(AppComponentStore);
  filterOject = signal({
    type: 'taiwan',
    id: '',
  });
  fullData = signal({});
  vm$ = this.#store.vm$.pipe(
    tap(({ voteData }) => {
      if (!voteData.country) return;
      this.fullData.set(voteData);
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isEmptyObject(obj: Record<string, any>) {
    return Object.keys(obj).length === 0;
  }

  filterResult = computed(() => {
    if (this.isEmptyObject(this.fullData())) return [];
    const fullData = this.fullData() as VoteState;
    const filterOject = this.filterOject();
    if (this.filterOject().type === 'taiwan') return fullData.country;
    if (this.filterOject().type === 'country') {
      return fullData?.village?.filter(
        (item) => item.countyId === filterOject.id
      );
    }
    if (this.filterOject().type === 'town') {
      return fullData?.village?.filter(
        (item) => item.townId === filterOject.id
      );
    }
    return [];
  });
}
