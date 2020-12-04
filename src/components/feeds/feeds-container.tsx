import FeedList from './feeds-list';
import FeedStream from './feeds-stream';
import ScalarsList from './scalars-list';

const FeedsContainer = () => {
  return (
    <div>
      <h2>Feed goes here</h2>

      <div style={{ display: 'flex' }}>
        <FeedStream />
        <FeedList />
        <ScalarsList />
      </div>
    </div>
  );
};

export default FeedsContainer;
