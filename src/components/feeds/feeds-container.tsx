import FeedList from './feeds-list';
import FeedStream from './feed-stream';
import ArticlesList from './articles-list';
import FeedStreamEmbedded from './feed-stream-embedded';

const FeedsContainer = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* 👎 Try to render more than one component and you will see that the rest do not work */}

      {/* 👍 Works alone */}
      {/* <FeedStream /> */}

      {/* 👍 Works alone */}
      <FeedList />

      {/* 👎 Does not work alone */}
      {/* <FeedStreamEmbedded /> */}

      {/* 👍 Works alone */}
      {/* <ArticlesList /> */}
    </div>
  );
};

export default FeedsContainer;
