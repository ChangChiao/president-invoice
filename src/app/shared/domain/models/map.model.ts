import * as d3Selection from 'd3-selection';
import { Feature, Geometry } from 'geojson';
import { CountyProperties } from './county.model';
import { TownProperties } from './town.model';
import { VillageProperties } from './village.model';

export type MapGeometryData = Feature<
  Geometry,
  CountyProperties | TownProperties | VillageProperties
>;

export interface MapGeometry {
  type: string;
  coordinates: number[][];
}

export interface MapAreaData {
  type: string;
  geometry: MapGeometry;
  id: string;
  properties: CountyProperties | TownProperties | VillageProperties;
}

export type MapBounds = [[number, number], [number, number]];
export type AreaType = 'county' | 'town' | 'village';

export type D3Selection = d3Selection.Selection<
  d3Selection.BaseType,
  unknown,
  HTMLElement,
  unknown
>;

export type D3DivSelection = d3Selection.Selection<
  HTMLDivElement,
  unknown,
  HTMLElement,
  unknown
>;

export type D3GSelection = d3Selection.Selection<
  SVGGElement,
  unknown,
  HTMLElement,
  unknown
>;

export type D3SVGSelection = d3Selection.Selection<
  SVGPathElement,
  unknown,
  null,
  undefined
>;

export interface TranslateObj {
  x: number;
  y: number;
  scale: number;
}

export type TranslateRecordList = Record<AreaType, TranslateObj | null>;
