import { gql, useQuery } from '@apollo/client';
import { useCallback } from 'react';

const QUERY = gql`
  query feedsStream($first: Int, $after: String) {
    feedsStream(first: $first, after: $after) {
      edges @stream(initialCount: 1) {
        node {
          id
          title
          description
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`;

export interface INode {
  id: string;
}

export interface IFeedNode extends INode {
  title: string;
  description: string;
}

export interface IEdge<TNode> {
  node: TNode;
  cursor: string;
}

export interface IConnection<TEdge> {
  edges: TEdge[];
  pageInfo: PageInfo;
}

export type IFeedEdge = IEdge<IFeedNode>;

export type IFeeds = IConnection<IFeedEdge>;

export interface PageInfo {
  startCursor?: string;
  endCursor?: string;
  hasNextPage: boolean;
}

interface QueryResult {
  feedsStream: IFeeds;
}

const FeedsStreamList = () => {
  const { data, error, refetch } = useQuery<QueryResult>(QUERY, {
    variables: {
      first: 3,
    },
    partialRefetch: true,
    notifyOnNetworkStatusChange: true,
  });

  const handleLoadMore = useCallback(() => {
    refetch({
      first: 5,
      after: data?.feedsStream.pageInfo.endCursor,
    });
  }, [refetch, data?.feedsStream.pageInfo.endCursor]);

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div>
      <h3>Feeds Stream List</h3>
      <ol>
        {data?.feedsStream?.edges?.map((edge) => {
          return <li key={edge.node.id}>{edge.node.title}</li>;
        })}
      </ol>
      <button onClick={handleLoadMore}>Loadmore</button>
    </div>
  );
};

export default FeedsStreamList;
