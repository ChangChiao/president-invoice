import { CountyProperties } from './county.model';
import { TownProperties } from './town.model';
import { VillageProperties } from './village.model';

export type AreaProperties =
  | CountyProperties[]
  | TownProperties[]
  | VillageProperties[];

export type AreaPropertiesItem =
  | CountyProperties
  | TownProperties
  | VillageProperties;

export enum ColorLevel {
  'light',
  'normal',
  'dark',
}

export type OverviewType = 'taiwan' | 'county' | 'town' | 'village';
