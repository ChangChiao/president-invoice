export interface CountryData {
  type: string;
  objects: CountryObjects;
  arcs: number[][][];
  bbox: number[];
}

export interface CountryObjects {
  counties: CountryCounties;
}

export interface CountryCounties {
  type: string;
  geometries: CountryGeometry[];
}

export interface CountryGeometry {
  type: string;
  arcs: number[][][];
  id: string;
  properties: CountryProperties;
}

export interface CountryProperties {
  countyId: string;
  countryName: string;
  kmt: number;
  ddp: number;
  pfp: number;
  winner: string;
  winnerRate: number;
}
