import { CountyGeometry } from './county.model';
import { TownGeometry } from './town.model';
import { VillageGeometry } from './village.model';
import * as d3Selection from 'd3-selection';

export type MapGeometryData = CountyGeometry | TownGeometry | VillageGeometry;

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
