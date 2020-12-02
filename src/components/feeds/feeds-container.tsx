import FeedList from './feeds-list';
import FeedStream from './feeds-stream';

const FeedsContainer = () => {
  return (
    <div>
      <h2>Feed goes here</h2>

      <div style={{ display: 'flex' }}>
        {/* <FeedList /> */}
        <FeedStream />
      </div>
    </div>
  );
};

export default FeedsContainer;
