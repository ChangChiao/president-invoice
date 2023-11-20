import { population } from '../configs';
import { DataKeys } from '../models';

export const generateRandomPopulation = (type: DataKeys) => {
  const value = population[type];
  const range = value * 0.1;

  const randomValue = Math.round(Math.random() * range * 2 - range + value);
  return randomValue;
};
