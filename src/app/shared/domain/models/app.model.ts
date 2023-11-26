import { CountyData, CountyProperties } from './county.model';
import { TownData, TownProperties } from './town.model';
import { VillageData, VillageProperties } from './village.model';

export interface AppState {
  mapData: MapState;
  selectedAreaObj: SelectedOptionState;
  isLoading: boolean;
  voteData: VoteState;
}

export interface MapState {
  county: CountyData | null;
  town: TownData | null;
  village: VillageData | null;
}

export interface VoteState {
  county: CountyProperties[] | null;
  town: TownProperties[] | null;
  village: VillageProperties[] | null;
}

export interface SelectedOptionState {
  county: string | null | undefined;
  town: string | null | undefined;
}
