import { blueList, greenList, orangeList } from '../configs';
import { AreaPropertiesItem, AreaType } from '../models';

export const getAreaIds = (element: AreaPropertiesItem) => {
  let id = '';

  switch (true) {
    case 'villageId' in element:
      id = 'villageId';
      break;
    case 'townId' in element:
      id = 'townId';
      break;
    default:
      id = 'countyId';
      break;
  }
  return element[id as keyof AreaPropertiesItem] as string;
};

export const getAreaName = (element: AreaPropertiesItem) => {
  let key = '';

  switch (true) {
    case 'villageName' in element:
      key = 'villageName';
      break;
    case 'townName' in element:
      key = 'townName';
      break;
    default:
      key = 'countyName';
      break;
  }
  return element[key as keyof AreaPropertiesItem];
};

export const getChildType = (type: AreaType | null) => {
  if (type === 'county') return 'town';
  if (type === 'town') return 'village';
  return null;
};

export const getParentType = (type: AreaType | null) => {
  if (type === 'town') return 'county';
  if (type === 'village') return 'town';
  return null;
};

export const genColor = (value: number, winner: string) => {
  const index = Math.floor(value / 20);
  if (winner === 'ddp') {
    return greenList[index];
  }
  if (winner === 'kmt') {
    return blueList[index];
  }

  return orangeList[index];
};

export const setLineWidth = (type?: string, isActive = false) => {
  let lineWidth = 0.1;
  if (type === 'county') lineWidth = 0.1;
  if (type === 'town') lineWidth = 0.1;
  if (type === 'village') lineWidth = 0.05;
  return isActive ? lineWidth * 5 : lineWidth;
};

export const handleInfoName = (data: AreaPropertiesItem) => {
  let str = data.countyName;
  if ('townName' in data) {
    str += data.townName;
  }
  if ('villageName' in data) {
    str += data.villageName;
  }
  return str;
};
