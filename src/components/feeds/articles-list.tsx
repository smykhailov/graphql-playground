import { gql, useQuery } from '@apollo/client';
import { IConnection, IEdge, INode } from './feeds-stream-list';

const QUERY = gql`
  query articles {
    articles {
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
  const { data, loading, error } = useQuery<QueryResult>(QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div>
      <h3>Articles List (CDL Implementation)</h3>
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
