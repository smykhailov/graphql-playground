import { gql, useQuery } from '@apollo/client';

const QUERY = gql`
  query feedStreamEmbedded {
    feedStreamEmbedded {
      feedStream @stream(initialCount: 1) {
        id
        title
        description
      }
      hasNextPage
    }
  }
`;

export interface Feed {
  id: string;
  title: string;
  description: string;
}

export interface FeedStreamEmbedded {
  feedStream: Feed[];
  hasNextPage: boolean;
}

interface QueryResult {
  feedStreamEmbedded: FeedStreamEmbedded;
}

const FeedStreamEmbeddedComponent = () => {
  const { data, loading, error } = useQuery<QueryResult>(QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div>
      <h3>Feed Stream Embedded</h3>
      <ul>
        {data?.feedStreamEmbedded?.feedStream?.map((item) => {
          return <li key={item?.id}>{item?.title}</li>;
        })}
      </ul>
    </div>
  );
};

export default FeedStreamEmbeddedComponent;
