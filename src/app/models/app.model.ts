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
  country: CountryProperties[];
  town: TownProperties[];
  village: VillageProperties[];
}

export interface SelectedOptionState {
  country: string | null;
  town: string | null;
  village: string | null;
}

export interface Vote {
  userId: number;
  id: number;
  title: string;
  body: string;
}
