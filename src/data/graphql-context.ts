import { Feed } from './generated/graphql';
import * as faker from 'faker';

export interface IGraphQLContext {
  feeds: () => Promise<Feed[]>;
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

    for (let i = 1; i <= 100; i++) {
      const feedItem: Feed = {
        id: i.toString(),
        title: faker.random.words(5),
        description: faker.random.words(25),
      };

      feedsCache.push(feedItem);
    }

    return feedsCache;
  };
}

const feedsCache: Feed[] = [];
