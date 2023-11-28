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
  selectedAreaObj: {
    county: undefined,
    town: undefined,
    village: undefined,
  },
  isLoading: false,
  initialLoad: false,
};

@Injectable({ providedIn: 'root' })
export class AppComponentStore extends ComponentStore<AppState> {
  readonly mapData$ = this.select(({ mapData }) => mapData);
  readonly voteData$ = this.select(({ voteData }) => voteData);
  readonly loading$ = this.select(({ isLoading }) => isLoading);
  readonly initialLoad$ = this.select(({ initialLoad }) => initialLoad);
  readonly selectedAreaObj$ = this.select(
    ({ selectedAreaObj }) => selectedAreaObj
  );

  readonly overViewType$ = this.select(({ selectedAreaObj }) => {
    const { county, town } = selectedAreaObj;
    if (town) return 'town';
    if (county) return 'county';
    return 'taiwan';
  });

  readonly vm$ = this.select(
    this.mapData$,
    this.voteData$,
    this.selectedAreaObj$,
    this.overViewType$,
    (mapData, voteData, selectedAreaObj, overViewType) => ({
      mapData,
      voteData,
      selectedAreaObj,
      overViewType,
    }),
    {
      debounce: true,
    }
  );

  readonly setMapData = this.updater((state, payload: MapState) => ({
    ...state,
    mapData: payload,
  }));

  readonly setVoteData = this.updater((state, payload: MapState) => {
    const { county, town, village } = payload;
    const countyData = county?.objects.county.geometries.map(
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
      selectedAreaObj: {
        ...state.selectedAreaObj,
        [payload.key]: payload.value,
      },
    })
  );

  readonly setLoading = this.updater((state, payload: boolean) => ({
    ...state,
    isLoading: payload,
  }));

  readonly setInitialLoad = this.updater((state, payload: boolean) => ({
    ...state,
    initialLoad: payload,
  }));

  constructor() {
    super(initState);
  }
}
