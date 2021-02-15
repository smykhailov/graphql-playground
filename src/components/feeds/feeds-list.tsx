import { gql, useQuery } from '@apollo/client';
import { FEEDS_COUNT } from 'data/data-sources/feeds';
import { IFeeds } from './feeds-stream-list';

const QUERY = gql`
  query feeds {
    feeds {
      edges {
        node {
          id
          title
          description
        }
      }
    }
  }
`;

interface QueryResult {
  feeds: IFeeds;
}

const FeedList = () => {
  const { data, loading, error } = useQuery<QueryResult>(QUERY, {
    variables: {
      first: FEEDS_COUNT,
    },
  });
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error.message}</div>;
  }

  return (
    <div>
      <h3>Feeds List</h3>
      <ol>
        {data?.feeds?.edges?.map((edge) => {
          return <li key={edge.node.id}>{edge.node.title}</li>;
        })}
      </ol>
    </div>
  );
};

export default FeedList;
