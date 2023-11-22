import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentStore } from '../../store/app.state';
import { tap } from 'rxjs';
import { LetDirective } from '@ngrx/component';
import { VoteState } from '../../shared/domain/models';
import { BarComponent } from './ui/bar/bar.component';

@Component({
  selector: 'invoice-chart',
  standalone: true,
  imports: [CommonModule, LetDirective, BarComponent],
  template: `
    <div *ngrxLet="vm$ as vm">
      <app-bar
        [filterOject]="filterOject()"
        [data]="filterResult() || []"
      ></app-bar>
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
  vm$ = this.#store.voteData$.pipe(
    tap((voteData) => {
      if (!voteData.county) return;
      this.fullData.set(voteData);
    })
  );

  isEmptyObject(obj: Record<string, any>) {
    return Object.keys(obj).length === 0;
  }

  filterResult = computed(() => {
    if (this.isEmptyObject(this.fullData())) return [];
    const fullData = this.fullData() as VoteState;
    const filterOject = this.filterOject();
    if (this.filterOject().type === 'taiwan') return fullData.county;
    if (this.filterOject().type === 'county') {
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
