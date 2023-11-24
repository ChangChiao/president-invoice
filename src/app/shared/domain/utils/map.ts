import { AreaPropertiesItem } from '../models';

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
