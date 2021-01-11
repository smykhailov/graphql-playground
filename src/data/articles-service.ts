import { IArticleNode } from '../components/feeds/articles-list';
import faker from 'faker';
import { sleep } from './utils/sleep';

const ARTICLES_COUNT = 20;
const db = getArticles(ARTICLES_COUNT);

/**
 * CDL service emulation
 */
export class ArticlesService {
  private cache = db.slice(0, 5);
  private _isExhausted = true;

  get isExhausted() {
    return this._isExhausted;
  }

  getCachedData(first?: number) {
    return this.cache.slice(0, first);
  }

  async getNetworkData(first: number = ARTICLES_COUNT) {
    if (first < this.cache.length) {
      return this.getCachedData(first);
    }

    await sleep(1500);
    this.cache = db.slice(0, first);
    if (this.cache.length === db.length) {
      this._isExhausted = true;
    }

    return this.cache.slice(0, first);
  }
}

function getArticles(first: number, after?: string) {
  const articles: IArticleNode[] = [];
  const firstIndex = after ? parseInt(after, 10) + 1 : 0;

  for (let i = 1; i <= first; i++) {
    articles.push({
      id: (firstIndex + i).toString(),
      title: faker.random.words(5),
      author: faker.random.words(2),
    });
  }

  return articles;
}
