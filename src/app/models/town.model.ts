export interface TownData {
  type: string;
  objects: TownObjects;
  arcs: number[][][];
  bbox: number[];
}

export interface TownObjects {
  town: Town;
}

export interface Town {
  type: string;
  geometries: TownGeometry[];
}

export interface TownGeometry {
  type: string;
  arcs: number[][][];
  id: string;
  properties: TownProperties;
}

export interface TownProperties {
  countyId: string;
  countryName: string;
  kmt: number;
  ddp: number;
  pfp: number;
  winner: string;
  winnerRate: number;
  townName: string;
  townId: string;
}
