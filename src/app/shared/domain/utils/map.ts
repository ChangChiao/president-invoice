import { AreaPropertiesItem } from '../models';

export const getAreaIds = (element: AreaPropertiesItem) => {
  let id = '';
  if ('villageId' in element) {
    id = 'villageId';
  }
  if ('townId' in element) {
    id = 'townId';
  }
  id = 'countyId';
  return element[id as keyof AreaPropertiesItem];
};
