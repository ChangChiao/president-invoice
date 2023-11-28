export interface CountyData {
  type: string;
  objects: CountyObjects;
  arcs: number[][][];
  bbox: number[];
}

export interface CountyObjects {
  county: CountyCounties;
}

export interface CountyCounties {
  type: string;
  geometries: CountyGeometry[];
}

export interface CountyGeometry {
  type: string;
  arcs: number[][][];
  id: string;
  properties: CountyProperties;
}

export interface CountyProperties {
  countyId: string;
  countyName: string;
  kmt: number;
  ddp: number;
  pfp: number;
  winner: string;
  winnerRate: number;
}
