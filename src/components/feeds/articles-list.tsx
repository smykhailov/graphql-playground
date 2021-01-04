import { gql, useQuery } from '@apollo/client';
import { ARTICLES_NUMBER } from 'data/graphql-context';
import { useCallback } from 'react';
import { IConnection, IEdge, INode } from './feeds-stream-list';

const QUERY = gql`
  query articles($first: Int, $after: String) {
    articles(first: $first, after: $after) {
      edges {
        node {
          id
          title
          author
        }
      }
    }
  }
`;
export interface IArticleNode extends INode {
  title: string;
  author: string;
}

export type IArticleEdge = IEdge<IArticleNode>;

export type IArticles = IConnection<IArticleEdge>;

interface QueryResult {
  articles: IArticles;
}

const ArticlesList = () => {
  const { data, loading, error, refetch } = useQuery<QueryResult>(QUERY, {
    variables: {
      first: ARTICLES_NUMBER,
    },
    partialRefetch: true,
    notifyOnNetworkStatusChange: true,
  });

  const handleLoadMore = useCallback(() => {
    refetch({
      first: ARTICLES_NUMBER,
    });
  }, [refetch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div>
      <h3>Articles List (CDL Implementation)</h3>
      <button onClick={handleLoadMore}>Loadmore</button>
      <ol>
        {data?.articles?.edges?.map(({ node }) => {
          return (
            <li key={node.id}>
              {node.title} by {node.author}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ArticlesList;
