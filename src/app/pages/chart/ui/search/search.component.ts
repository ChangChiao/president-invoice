import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  AreaType,
  CountyProperties,
  Dropdown,
  SelectedOptionState,
  TownProperties,
  VillageProperties,
  VoteState,
} from '../../../../shared/domain/models';
import { AppComponentStore } from '../../../../shared/domain/store';

@Component({
  selector: 'invoice-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
  template: `
    <div class="search-bar">
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
          <mat-label> 鄉/鎮 </mat-label>
          <mat-select formControlName="town">
            <mat-option *ngFor="let area of townDropdown()" [value]="area.id">
              {{ area.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
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
export class SearchComponent implements OnChanges {
  @Input() voteData!: VoteState;
  @Input() selectedAreaObj!: SelectedOptionState;
  #store = inject(AppComponentStore);
  fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    county: [''],
    town: [''],
  });
  countyDropdown: WritableSignal<Dropdown[] | []> = signal([]);
  townList: WritableSignal<Dropdown[] | []> = signal([]);

  townDropdown: WritableSignal<Dropdown[] | []> = signal([]);

  get countyFormControl() {
    return this.form.get('county');
  }

  get townFormControl() {
    return this.form.get('town');
  }

  get isUsing() {
    return this.countyFormControl?.value || this.townFormControl?.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const voteData = changes['voteData']?.currentValue;
    const selectedisFirstChange = changes['selectedAreaObj']?.isFirstChange();
    if (voteData) {
      const { county, town } = voteData;
      this.countyDropdown.set(this.createcountyList(county));
      this.townList.set(this.createTownList(town));
    }
    if (!selectedisFirstChange) {
      const selectedAreaNewObj = changes['selectedAreaObj']?.currentValue;
      const selectedAreaOldObj = changes['selectedAreaObj']?.previousValue;
      const { county: countyNew, town: townNew } = selectedAreaNewObj;
      const { county: countyOld, town: townOld } = selectedAreaOldObj;
      if (countyNew !== countyOld) {
        this.countyFormControl?.setValue(countyNew);
      }
      if (townNew !== townOld) {
        this.townFormControl?.setValue(townNew);
      }
    }
  }

  setSelectedOption(key: AreaType, value: string | null) {
    this.#store.setSelectedOption({ key, value });
  }

  resetSearch() {
    this.setSelectedOption('county', null);
    this.setSelectedOption('town', null);
  }

  constructor() {
    this.countyFormControl?.valueChanges.subscribe((value) => {
      const filterArray = this.townList().filter((item) =>
        item.id.includes(value)
      );

      this.townDropdown.set(filterArray);
      this.townFormControl?.setValue(null);
      if (value === this.selectedAreaObj.county) return;
      this.sendSelectedOption('county', value);
    });
    this.townFormControl?.valueChanges.subscribe((value) => {
      if (value === this.selectedAreaObj.town) return;
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
    this.setSelectedOption(key, value);
  }
}
