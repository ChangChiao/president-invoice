import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { tap } from 'rxjs';
import {
  DropdownEmitData,
  CountryProperties,
  TownProperties,
  VillageProperties,
  Dropdown,
} from '../../../../shared/domain/models';
import { LetDirective } from '@ngrx/component';
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
  ],
  template: `
    <form [formGroup]="form" *ngrxLet="vm$ as vm">
      <mat-form-field floatLabel="always" hideRequiredMarker="true" class="">
        <mat-label> 縣/市 </mat-label>
        <mat-select formControlName="country">
          <mat-option *ngFor="let area of countryDropdown()" [value]="area.id">
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
      <mat-form-field floatLabel="always" hideRequiredMarker="true" class="">
        <mat-label> 村/里 </mat-label>
        <mat-select formControlName="village">
          <mat-option *ngFor="let area of villageDropdown()" [value]="area.id">
            {{ area.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </form>
  `,
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  @Output() selectData: EventEmitter<DropdownEmitData> = new EventEmitter();
  #store = inject(AppComponentStore);
  fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    country: [''],
    town: [''],
    village: [''],
  });
  countryDropdown: WritableSignal<Dropdown[] | []> = signal([]);
  townList: WritableSignal<Dropdown[] | []> = signal([]);
  villageList: WritableSignal<Dropdown[] | []> = signal([]);

  townDropdown: WritableSignal<Dropdown[] | []> = signal([]);
  villageDropdown: WritableSignal<Dropdown[] | []> = signal([]);

  vm$ = this.#store.voteData$.pipe(
    tap(({ country, town, village }) => {
      this.countryDropdown.set(this.createCountryList(country));
      this.townList.set(this.createTownList(town));
      this.villageList.set(this.createVillageList(village));
    })
  );

  get countryFormControl() {
    return this.form.get('country');
  }

  get townFormControl() {
    return this.form.get('town');
  }

  get villageFormControl() {
    return this.form.get('village');
  }

  setSelectedOption(key: string, value: string) {
    this.#store.setSelectedOption({ key, value });
  }

  constructor() {
    this.countryFormControl?.valueChanges.subscribe((value) => {
      this.setSelectedOption('country', value);
      if (!value) return;
      const filterArray = this.townList().filter((item) => item.id === value);
      this.townDropdown.set(filterArray);
      this.townFormControl?.setValue(null);
      this.villageFormControl?.setValue(null);
    });
    this.townFormControl?.valueChanges.subscribe((value) => {
      this.setSelectedOption('town', value);
      if (!value) return;
      const filterArray = this.villageList().filter(
        (item) => item.id === value
      );
      this.villageDropdown.set(filterArray);
      this.villageFormControl?.setValue(null);
    });
    this.villageFormControl?.valueChanges.subscribe((value) => {
      this.setSelectedOption('village', value);
    });
  }

  createCountryList(country: CountryProperties[] | null) {
    if (!country) return [];
    return country.map((item) => ({
      id: item.countyId,
      name: item.countryName,
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

  sendSelectedData() {
    this.selectData.emit({
      country: this.countryFormControl?.value,
      town: this.townFormControl?.value,
      village: this.villageFormControl?.value,
    });
  }
}
