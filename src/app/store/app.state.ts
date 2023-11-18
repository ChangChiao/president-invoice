import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { AppState, MapState, VoteState } from '../models/app.model';

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
