import { IArticleEdge, IArticles } from 'components/feeds/articles-list';
import { IFeedEdge, IFeeds } from 'components/feeds/feeds-stream-list';
import * as faker from 'faker';
import { sleep } from './utils/sleep';

export interface IGraphQLContext {
  filteredFeedNodes: IFeedEdge[];
  articles: (after: string, first: number) => Promise<IArticles>;
  feeds: () => Promise<IFeeds>;
  feedsStream: (after: string, first: number) => Partial<IFeeds>;
  feedsStreamEdges: () => AsyncGenerator<IFeedEdge>;
}

const createGraphQLContext: () => IGraphQLContext = () => {
  return new GraphQLContext();
};

const SLEEP_TIME_IN_MS = 1000;
const FEEDS_NUMBER = 20;
export const ARTICLES_NUMBER = 20;
let morePages = 0;

export default createGraphQLContext;

interface ICache {
  feeds: IFeedEdge[];
  articles: IArticleEdge[];
}

class GraphQLContext implements IGraphQLContext {
  cache: ICache = {
    feeds: this.getFeeds(),
    articles: this.getPartialArticles(5),
  };

  filteredFeedNodes: IFeedEdge[] = [];

  async articles(after: string, first: number): Promise<IArticles> {
    const cursorIndex = after
      ? this.cache.articles.findIndex((i) => i.cursor === after)
      : 0;

    const firstSlice =
      cursorIndex > 0
        ? this.cache.articles.slice(cursorIndex + 1)
        : this.cache.articles;

    const edges = first ? firstSlice.slice(0, first) : firstSlice;

    if (edges.length === 0) {
      await this.fetchArticles();
      return this.articles(after, first);
    }

    if (edges.length !== first) {
      this.syncArticles();
    }
    return {
      edges,
      pageInfo: {
        startCursor: edges[0].node.id,
        endCursor: edges[edges.length - 1].node.id,
        hasNextPage: morePages++ < 3,
      },
    };
  }

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
      hasNextPage: this.filteredFeedNodes.length < FEEDS_NUMBER,
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
    for (let i = 1; i <= FEEDS_NUMBER; i++) {
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

  private getPartialArticles(length: number = ARTICLES_NUMBER) {
    const articles: IArticleEdge[] = [];
    for (let i = 1; i <= length; i++) {
      const id = i.toString();
      const node = {
        id,
        title: faker.random.words(5),
        author: faker.random.words(2),
      };

      articles.push({ node, cursor: id });
    }
    return articles;
  }

  private async fetchArticles() {
    await sleep(SLEEP_TIME_IN_MS);
    return this.getPartialArticles();
  }

  private async syncArticles() {
    this.cache.articles = await this.fetchArticles();
  }
}
