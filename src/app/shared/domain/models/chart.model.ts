import { CountryProperties } from './country.model';
import { TownProperties } from './town.model';
import { VillageProperties } from './village.model';

export type ChartData =
  | CountryProperties[]
  | TownProperties[]
  | VillageProperties[];

export type ChartDataItem =
  | CountryProperties
  | TownProperties
  | VillageProperties;

export type OverviewType = 'taiwan' | 'country' | 'town' | 'village';
