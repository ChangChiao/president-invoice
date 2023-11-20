import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { AppState, MapState, VoteState } from '../models';

const initState = {
  mapData: {
    country: null,
    town: null,
    village: null,
  },
  voteData: {
    country: null,
    town: null,
    village: null,
  },
  selectedOption: {
    country: null,
    town: null,
    village: null,
  },
  isLoading: false,
  test: null,
};

@Injectable({ providedIn: 'root' })
export class AppComponentStore extends ComponentStore<AppState> {
  readonly mapData$ = this.select(({ mapData }) => mapData);
  readonly voteData$ = this.select(({ voteData }) => voteData);
  readonly selectedOption$ = this.select(
    ({ selectedOption }) => selectedOption
  );

  readonly overViewType$ = this.select(({ selectedOption }) => {
    const { country, town, village } = selectedOption;
    if (village) return 'village';
    if (town) return 'town';
    if (country) return 'country';
    return 'taiwan';
  });

  readonly vm$ = this.select(
    this.mapData$,
    this.voteData$,
    this.selectedOption$,
    this.overViewType$,
    (mapData, voteData, selectedOption, overViewType) => ({
      mapData,
      voteData,
      selectedOption,
      overViewType,
    }),
    {
      debounce: true,
    }
  );

  readonly loading$ = this.select(({ isLoading }) => isLoading);

  readonly setMapData = this.updater((state, payload: MapState) => ({
    ...state,
    mapData: payload,
  }));

  readonly setVoteData = this.updater((state, payload: MapState) => {
    const { country, town, village } = payload;
    const countryData = country?.objects.counties.geometries.map(
      (item) => item.properties
    );
    const townData = town?.objects.town.geometries.map(
      (item) => item.properties
    );
    const villageData = village?.objects.village.geometries.map(
      (item) => item.properties
    );
    const voteData = {
      country: countryData,
      town: townData,
      village: villageData,
    } as VoteState;

    return {
      ...state,
      voteData,
    };
  });

  readonly setSelectedOption = this.updater(
    (state, payload: { key: string; value: string | null }) => ({
      ...state,
      selectedOption: {
        ...state.selectedOption,
        [payload.key]: payload.value,
      },
    })
  );

  readonly setLoading = this.updater((state, payload: boolean) => ({
    ...state,
    isLoading: payload,
  }));

  constructor() {
    super(initState);
  }
}
