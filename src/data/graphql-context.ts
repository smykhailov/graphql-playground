import { Feed } from './generated/graphql';
import * as faker from 'faker';
import { sleep } from './utils/sleep';

export interface IGraphQLContext {
  scalars: () => number[];
  feeds: () => Promise<Feed[]>;
  feedsStream: () => AsyncGenerator<Feed>;
}

const createGraphQLContext: () => IGraphQLContext = () => {
  return new GraphQLContext();
};

export default createGraphQLContext;

class GraphQLContext implements IGraphQLContext {
  scalars() {
    const scalars: number[] = [];
    for (let i = 1; i <= 100; i++) {
      scalars.push(i);
    }
    return scalars;
  }

  feeds: () => Promise<Feed[]> = async () => {
    if (feedsCache.length > 0) {
      return feedsCache;
    }

    this.generateFeedData();

    return feedsCache;
  };

  async *feedsStream() {
    if (feedsCache.length < 1) {
      this.generateFeedData();
    }

    for (let i = 0; i < feedsCache.length; i++) {
      yield feedsCache[i];
      await sleep(1000);
    }
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
