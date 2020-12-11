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
      <h3>Feeds List (6 items in total)</h3>
      <ol>
        {data?.feeds.map((item) => {
          return <li key={item.id}>{item.title}</li>;
        })}
      </ol>
    </div>
  );
};

export default FeedList;
