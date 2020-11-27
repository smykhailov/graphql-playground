import { Feed } from './generated/graphql';
import * as faker from 'faker';

export interface IGraphQLContext {
  feeds: () => Promise<Feed[]>;
  feedsStream: (initialCount: number) => AsyncGenerator<Feed>;
}

const createGraphQLContext: () => IGraphQLContext = () => {
  return new GraphQLContext();
};

export default createGraphQLContext;

class GraphQLContext implements IGraphQLContext {
  feeds: () => Promise<Feed[]> = async () => {
    if (feedsCache.length > 0) {
      return feedsCache;
    }

    this.generateFeedData();

    return feedsCache;
  };

  async *feedsStream(initialCount: number) {
    this.generateFeedData();

    for (const item of feedsCache) {
      yield item;
      await this.sleep(10000);
    }
  }
  // feedsStream: (initialCount: number) => Promise<Feed[]> = async (
  //   initialCount: number
  // ) => {
  //   if (feedsCache.length > 0) {
  //     return feedsCache.slice(0, initialCount);
  //   }

  //   this.generateFeedData();

  //   return feedsCache.slice(0, initialCount);
  // };

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateFeedData() {
    for (let i = 1; i <= 100; i++) {
      const feedItem: Feed = {
        id: i.toString(),
        title: faker.random.words(5),
        description: faker.random.words(25),
      };

      feedsCache.push(feedItem);
    }
  }
}

const feedsCache: Feed[] = [];
