import * as faker from 'faker';

export interface IItem {
  id: number;
  title: string;
  subTitle?: string;
  description: string;
}

interface ICachePiece {
  height: number | null;
  min: number | null;
  max: number | null;
}

export interface ICache {
  [key: string]: ICachePiece;
}

export function generateData(number: number): IItem[] {
  return new Array(number).fill(30).map((_, index) => ({
    id: index,
    title: faker.random.words(Math.floor(Math.random() * 8) + 1),
    subTitle: Math.random() > 0.5 ? faker.random.words(3) : undefined,
    description: faker.random.words(3),
  }));
}

export const generateEmptyCache = (): ICache => {
  return ['S', 'M', 'L', 'XL'].reduce((cache, key) => {
    cache[key] = {
      min: null,
      max: null,
      height: null,
    };
    return cache;
  }, {} as ICache);
};
