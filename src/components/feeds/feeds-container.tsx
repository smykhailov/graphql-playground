import FeedsList from './feeds-list';
import ArticlesList from './articles-list';
import FeedsStreamList from './feeds-stream-list';

const FeedsContainer = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* <FeedsList /> */}
      <FeedsStreamList />
      {/* <ArticlesList /> */}
    </div>
  );
};

export default FeedsContainer;
