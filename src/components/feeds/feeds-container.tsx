import FeedsList from './feeds-list';
import ArticlesList from './articles-list';
import FeedsStreamList from './feeds-stream-list';
import ArticlesLazyList from './articles-lazy-list';

const FeedsContainer = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/*<FeedsList />*/}
      {/*<FeedsStreamList />*/}
      {/*<ArticlesList />*/}
      <ArticlesLazyList />
    </div>
  );
};

export default FeedsContainer;
