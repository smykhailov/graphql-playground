import FeedList from './feeds-list';
import FeedStream from './feed-stream';
import ArticlesList from './articles-list';
import FeedStreamEmbedded from './feed-stream-embedded';

const FeedsContainer = () => {
  return (
    <div>
      <h2>Feed goes here</h2>

      <div style={{ display: 'flex' }}>
        {/* <FeedStream /> */}
        {/* <FeedList /> */}
        <FeedStreamEmbedded />
        {/* <ArticlesList /> */}
      </div>
    </div>
  );
};

export default FeedsContainer;
