import { Feature, Geometry } from 'geojson';
import { CountyGeometry, CountyProperties } from './county.model';
import { TownGeometry, TownProperties } from './town.model';
import { VillageGeometry, VillageProperties } from './village.model';
import * as d3Selection from 'd3-selection';

export type MapGeometryData = Feature<
  Geometry,
  CountyProperties | TownProperties | VillageProperties
>;

export type MapBounds = [[number, number], [number, number]];

export type D3Selection = d3Selection.Selection<
  d3Selection.BaseType,
  any,
  HTMLElement,
  any
>;

export type D3GSelection = d3Selection.Selection<
  SVGGElement,
  any,
  HTMLElement,
  any
>;

export type D3SVGSelection = d3Selection.Selection<
  SVGPathElement,
  any,
  null,
  undefined
>;

// export interface FeatureCollection {
//   type: string;
//   features: any[];
// }

// export interface Feature {
//   type: 'Feature';
//   geometry: 'Polygon';
//   properties?: Record<string, any>;
// }
