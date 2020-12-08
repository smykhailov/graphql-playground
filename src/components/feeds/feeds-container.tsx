import FeedList from './feeds-list';
import FeedStream from './feeds-stream';
import ScalarsList from './scalars-list';
import FeedPagination from './feed-pagination';

const FeedsContainer = () => {
  return (
    <div>
      <h2>Feed goes here</h2>

      <div style={{ display: 'flex' }}>
        <FeedStream />
        <FeedList />
        <FeedPagination />
        <ScalarsList />
      </div>
    </div>
  );
};

export default FeedsContainer;
