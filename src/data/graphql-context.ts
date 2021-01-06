import { IFeedEdge, IFeeds } from 'components/feeds/feeds-stream-list';
import * as faker from 'faker';
import { sleep } from './utils/sleep';

export interface IGraphQLContext {
  filteredFeedNodes: IFeedEdge[];
  feeds: () => Promise<IFeeds>;
  feedsStream: (after: string, first: number) => Partial<IFeeds>;
  feedsStreamEdges: () => AsyncGenerator<IFeedEdge>;
}

const createGraphQLContext: () => IGraphQLContext = () => {
  return new GraphQLContext();
};

const SLEEP_TIME_IN_MS = 1000;
let morePages = 0;

export default createGraphQLContext;

interface ICache {
  feeds: IFeedEdge[];
}

class GraphQLContext implements IGraphQLContext {
  cache: ICache = {
    feeds: this.getFeeds(),
  };

  filteredFeedNodes: IFeedEdge[] = [];

  async feeds() {
    return {
      edges: this.cache.feeds,
      pageInfo: {
        startCursor: this.cache.feeds[0].cursor,
        endCursor: this.cache.feeds[this.cache.feeds.length - 1].cursor,
        hasNextPage: false,
      },
    };
  }

  feedsStream(after: string, first: number) {
    const cursorIndex = after
      ? this.cache.feeds.findIndex((i) => i.cursor === after)
      : 0;

    const firstSlice =
      cursorIndex > 0
        ? this.cache.feeds.slice(cursorIndex + 1)
        : this.cache.feeds;

    this.filteredFeedNodes = first ? firstSlice.slice(0, first) : firstSlice;

    const pageInfo = {
      startCursor: this.filteredFeedNodes[0].node.id,
      endCursor: this.filteredFeedNodes[this.filteredFeedNodes.length - 1].node
        .id,
      hasNextPage: morePages++ < 3,
    };

    return {
      pageInfo,
    };
  }

  async *feedsStreamEdges() {
    for (const edge of this.filteredFeedNodes) {
      yield edge;
      await sleep(SLEEP_TIME_IN_MS);
    }
  }

  private getFeeds() {
    const feeds: IFeedEdge[] = [];
    for (let i = 1; i <= 20; i++) {
      const id = i.toString();
      const node = {
        id,
        title: faker.random.words(5),
        description: faker.random.words(25),
      };

      feeds.push({ node, cursor: id });
    }
    return feeds;
  }
}
