import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { LetDirective } from '@ngrx/component';
import { tap } from 'rxjs';
import {
  AreaType,
  CountyProperties,
  Dropdown,
  DropdownEmitData,
  TownProperties,
  VillageProperties,
} from '../../../../shared/domain/models';
import { AppComponentStore } from '../../../../shared/domain/store';

@Component({
  selector: 'invoice-search',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
  template: `
    <div class="search-bar" *ngrxLet="vm$ as vm">
      <span class="search-title global-body-md">搜尋鄰里</span>
      <form [formGroup]="form">
        <mat-form-field
          class="search-field"
          floatLabel="always"
          hideRequiredMarker="true"
          class=""
        >
          <mat-label> 縣/市 </mat-label>
          <mat-select formControlName="county">
            <mat-option *ngFor="let area of countyDropdown()" [value]="area.id">
              {{ area.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field floatLabel="always" hideRequiredMarker="true" class="">
          <mat-label> 鎮/區 </mat-label>
          <mat-select formControlName="town">
            <mat-option *ngFor="let area of townDropdown()" [value]="area.id">
              {{ area.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <!-- <button
          class="icon-btn"
          [disabled]="form.invalid"
          (click)="sendSelectedData()"
        >
          <mat-icon svgIcon="search" class="search-icon"></mat-icon>
        </button> -->
        <button
          [disabled]="!isUsing"
          class="global-body-md overview-btn"
          (click)="resetSearch()"
        >
          回全國
        </button>
      </form>
    </div>
  `,
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  @Output() sendOption: EventEmitter<DropdownEmitData> = new EventEmitter();
  #store = inject(AppComponentStore);
  fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    county: [''],
    town: [''],
  });
  countyDropdown: WritableSignal<Dropdown[] | []> = signal([]);
  townList: WritableSignal<Dropdown[] | []> = signal([]);

  townDropdown: WritableSignal<Dropdown[] | []> = signal([]);

  vm$ = this.#store.voteData$.pipe(
    tap(({ county, town }) => {
      this.countyDropdown.set(this.createcountyList(county));
      this.townList.set(this.createTownList(town));
    })
  );

  get countyFormControl() {
    return this.form.get('county');
  }

  get townFormControl() {
    return this.form.get('town');
  }

  get isUsing() {
    return this.countyFormControl?.value || this.townFormControl?.value;
  }

  setSelectedOption(key: AreaType, value: string | null) {
    this.#store.setSelectedOption({ key, value });
  }

  resetSearch() {
    this.form.reset();
    this.sendOption.emit({ key: 'county', id: null });
    this.sendOption.emit({ key: 'town', id: null });
    this.setSelectedOption('county', null);
    this.setSelectedOption('town', null);
  }

  constructor() {
    this.countyFormControl?.valueChanges.subscribe((value) => {
      if (!value) return;
      this.sendSelectedOption('county', value);
      const filterArray = this.townList().filter((item) =>
        item.id.includes(value)
      );
      this.townDropdown.set(filterArray);
      this.townFormControl?.setValue(null);
    });
    this.townFormControl?.valueChanges.subscribe((value) => {
      this.sendSelectedOption('town', value);
    });
  }

  createcountyList(county: CountyProperties[] | null) {
    if (!county) return [];
    return county.map((item) => ({
      id: item.countyId,
      name: item.countyName,
    }));
  }

  createTownList(town: TownProperties[] | null) {
    if (!town) return [];
    return town.map((item) => ({
      id: item.townId,
      name: item.townName,
    }));
  }

  createVillageList(village: VillageProperties[] | null) {
    if (!village) return [];
    return village.map((item) => ({
      id: item.villageId,
      name: item.villageName,
    }));
  }

  sendSelectedOption(key: AreaType, value: string) {
    this.sendOption.emit({ key, id: value });
    this.setSelectedOption(key, value);
  }
}
