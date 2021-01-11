import { gql, useQuery } from '@apollo/client';
import { FEEDS_COUNT } from 'data/data-sources/feeds';

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
  const { data, error } = useQuery<QueryResult>(QUERY, {
    variables: {
      first: FEEDS_COUNT,
    },
    partialRefetch: true,
    notifyOnNetworkStatusChange: true,
  });

  if (error) {
    return <div>Error {error.message}</div>;
  }

  return (
    <div>
      <h3>Feeds Stream List</h3>
      <ol>
        {data?.feedsStream?.edges?.map((edge) => {
          return <li key={edge.node.id}>{edge.node.title}</li>;
        })}
      </ol>
    </div>
  );
};

export default FeedsStreamList;
