import { sleep } from './utils/sleep';

/**
 * CDL Service Emulation
 */
export class DataService<TNode extends { id: string }> {
  private cache = this.db.slice(0, this.db.length / 2); // cache has half of all available items by default

  constructor(private db: TNode[]) {
    if (this.db.length < 2) {
      throw new Error(
        `db has to have at least 2 items, but has ${this.db.length}`
      );
    }
  }

  get isExhausted() {
    return this.cache.length === this.db.length;
  }

  getCachedData(first?: number) {
    return this.cache.slice(0, first);
  }

  async getNetworkData(first: number) {
    if (first < this.cache.length) {
      return this.getCachedData(first);
    }

    await sleep(1500);

    this.cache = this.db.slice(0, first);

    return this.cache.slice(0, first);
  }
}
