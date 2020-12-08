import { Feed, FeedStreamPagination, Scalar } from './generated/graphql';
import * as faker from 'faker';
import { sleep } from './utils/sleep';

export interface IGraphQLContext {
  scalars: () => AsyncGenerator<Scalar>;
  feeds: () => Promise<Feed[]>;
  feedsStream: () => AsyncGenerator<Feed>;
  feedsStreamPaginationFeeds: () => AsyncGenerator<Feed>;
  feedStreamPagination: () => FeedStreamPagination;
}

const createGraphQLContext: () => IGraphQLContext = () => {
  return new GraphQLContext();
};

const SLEEP_TIME_IN_MS = 1000;

export default createGraphQLContext;

class GraphQLContext implements IGraphQLContext {
  async *scalars() {
    for (let i = 1; i <= 3; i++) {
      yield {
        id: `scalar_${i}`,
        value: i,
      };
      await sleep(SLEEP_TIME_IN_MS);
    }
  }

  feeds: () => Promise<Feed[]> = async () => {
    if (feedsCache.length > 0) {
      return feedsCache;
    }

    this.generateFeedData();

    return feedsCache;
  };

  async *feedsStreamPaginationFeeds() {
    if (feedsCache.length < 1) {
      this.generateFeedData();
    }

    for (let i = 0; i < feedsCache.length / 2; i++) {
      yield feedsCache[i];
      await sleep(SLEEP_TIME_IN_MS);
    }

    await sleep(SLEEP_TIME_IN_MS);

    for (let i = feedsCache.length / 2; i < feedsCache.length; i++) {
      yield feedsCache[i];
      await sleep(SLEEP_TIME_IN_MS);
    }
  }

  async *feedsStream() {
    if (feedsCache.length < 1) {
      this.generateFeedData();
    }

    for (let i = 0; i < feedsCache.length / 2; i++) {
      yield feedsCache[i];
      await sleep(SLEEP_TIME_IN_MS);
    }

    await sleep(SLEEP_TIME_IN_MS);

    for (let i = feedsCache.length / 2; i < feedsCache.length; i++) {
      yield feedsCache[i];
      await sleep(SLEEP_TIME_IN_MS);
    }
  }

  feedStreamPagination() {
    return { hasNextPage: Math.random() < 0.5 };
  }

  private generateFeedData() {
    for (let i = 1; i <= 6; i++) {
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
