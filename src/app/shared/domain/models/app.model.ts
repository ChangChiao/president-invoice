import { CountryData, CountryProperties } from './country.model';
import { TownData, TownProperties } from './town.model';
import { VillageData, VillageProperties } from './village.model';

export interface AppState {
  mapData: MapState;
  selectedOption: SelectedOptionState;
  isLoading: boolean;
  voteData: VoteState;
}

export interface MapState {
  country: CountryData | null;
  town: TownData | null;
  village: VillageData | null;
}

export interface VoteState {
  country: CountryProperties[] | null;
  town: TownProperties[] | null;
  village: VillageProperties[] | null;
}

export interface SelectedOptionState {
  country: null | string;
  town: null | string;
  village: null | string;
}

export type DataKeys = 'country' | 'town' | 'village';
