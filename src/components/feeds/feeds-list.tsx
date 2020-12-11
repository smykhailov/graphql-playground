import { gql, useQuery } from '@apollo/client';
import { Feed } from './feed-stream-embedded';

const QUERY = gql`
  query feeds {
    feeds {
      id
      title
      description
    }
  }
`;

interface QueryResult {
  feeds: Feed[];
}

const FeedList = () => {
  const { data, loading, error } = useQuery<QueryResult>(QUERY);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div>
      <h3>Feeds List</h3>
      <ul>
        {data?.feeds.map((item) => {
          return <li key={item.id}>{item.title}</li>;
        })}
      </ul>
    </div>
  );
};

export default FeedList;
