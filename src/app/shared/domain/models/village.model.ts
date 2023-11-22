export interface VillageData {
  type: string;
  bbox: number[];
  transform: VillageTransform;
  objects: VillageObjects;
  arcs: number[][][];
}

export interface VillageTransform {
  scale: number[];
  translate: number[];
}

export interface VillageObjects {
  village: VillageTracts;
}

export interface VillageTracts {
  type: string;
  geometries: VillageGeometry[];
}

export interface VillageGeometry {
  type: string;
  arcs: any[][];
  id: string;
  properties: VillageProperties;
}

export interface VillageProperties {
  countyId: string;
  countyName: string;
  kmt: number;
  ddp: number;
  pfp: number;
  winner: string;
  winnerRate: number;
  townName: string;
  villageName: string;
  townId: string;
  villageId: string;
}
