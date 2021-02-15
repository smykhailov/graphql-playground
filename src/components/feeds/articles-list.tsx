import { gql, useQuery } from '@apollo/client';
import { INode } from './feeds-stream-list';

const QUERY = gql`
  query articles($first: Int!) {
    articles(first: $first) @client {
      id
      title
      author
    }
  }
`;

export interface IArticleNode extends INode {
  title: string;
  author: string;
}

interface QueryResult {
  articles: IArticleNode[];
}

const ArticlesList = () => {
  const { data, loading, error } = useQuery<QueryResult>(QUERY, {
    variables: {
      first: 20,
    },
  });

  const items = data?.articles ?? [];
  console.log(`render ${items.length} items!`);
  const content = loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>Error {error}</div>
  ) : (
    <ol>
      {items.map((item) => {
        return (
          <li key={item.id}>
            {item.title} by {item.author}
          </li>
        );
      })}
    </ol>
  );

  return (
    <div>
      <h3>Articles List (CDL Implementation)</h3>
      {content}
    </div>
  );
};
export default ArticlesList;
