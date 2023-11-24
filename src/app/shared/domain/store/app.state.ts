import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { AppState, AreaType, MapState, VoteState } from '../models';

const initState = {
  mapData: {
    county: null,
    town: null,
    village: null,
  },
  voteData: {
    county: null,
    town: null,
    village: null,
  },
  selectedOption: {
    county: null,
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
    const { county, town } = selectedOption;
    if (town) return 'town';
    if (county) return 'county';
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
    const { county, town, village } = payload;
    const countyData = county?.objects.counties.geometries.map(
      (item) => item.properties
    );
    const townData = town?.objects.town.geometries.map(
      (item) => item.properties
    );
    const villageData = village?.objects.village.geometries.map(
      (item) => item.properties
    );
    const voteData = {
      county: countyData,
      town: townData,
      village: villageData,
    } as VoteState;

    return {
      ...state,
      voteData,
    };
  });

  readonly setSelectedOption = this.updater(
    (state, payload: { key: AreaType; value: string | null }) => ({
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
