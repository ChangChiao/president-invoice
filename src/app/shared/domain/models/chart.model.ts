import { CountyProperties } from './county.model';
import { TownProperties } from './town.model';
import { VillageProperties } from './village.model';

export type ChartData =
  | CountyProperties[]
  | TownProperties[]
  | VillageProperties[];

export type ChartDataItem =
  | CountyProperties
  | TownProperties
  | VillageProperties;

export type OverviewType = 'taiwan' | 'county' | 'town' | 'village';
