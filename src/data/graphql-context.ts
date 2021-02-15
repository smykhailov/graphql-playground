import { IArticleNode } from 'components/feeds/articles-list';
import { IFeedNode } from 'components/feeds/feeds-stream-list';
import { ARTICLES_COUNT, getArticles } from './data-sources/articles';
import { DataService } from './data-service';
import { FEEDS_COUNT, getFeeds } from './data-sources/feeds';

export interface IGraphQLContext {
  feeds: DataService<IFeedNode>;
  articles: DataService<IArticleNode>;
  streamedFieldsPackageSize: Record<string, number>;
}

const createGraphQLContext: () => IGraphQLContext = () => {
  return {
    articles: new DataService<IArticleNode>(getArticles(ARTICLES_COUNT)),
    feeds: new DataService<IFeedNode>(getFeeds(FEEDS_COUNT)),
    streamedFieldsPackageSize: {},
  };
};

export default createGraphQLContext;
