import { Article } from 'components/feeds/articles-list';
import {
  Feed,
  FeedStreamEmbedded,
} from 'components/feeds/feed-stream-embedded';
import * as faker from 'faker';
import { sleep } from './utils/sleep';

export interface IGraphQLContext {
  articles: () => AsyncGenerator<Article>;
  feeds: () => Promise<Feed[]>;
  feedsStream: () => AsyncGenerator<Feed>;
  feedStreamEmbedded: () => Partial<FeedStreamEmbedded>;
}

const createGraphQLContext: () => IGraphQLContext = () => {
  return new GraphQLContext();
};

const SLEEP_TIME_IN_MS = 1000;

export default createGraphQLContext;

class GraphQLContext implements IGraphQLContext {
  async *articles() {
    for (let i = 1; i <= 8; i++) {
      yield {
        id: i.toString(),
        title: faker.random.words(5),
        author: faker.random.words(2),
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

  async *feedsStream() {
    if (feedsCache.length < 1) {
      this.generateFeedData();
    }

    for (let i = 0; i < feedsCache.length; i++) {
      yield feedsCache[i];
      await sleep(SLEEP_TIME_IN_MS);
    }
  }

  feedStreamEmbedded() {
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
