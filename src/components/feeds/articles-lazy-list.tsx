import { gql, useLazyQuery } from '@apollo/client';
import { INode } from './feeds-stream-list';
import { useEffect } from 'react';

const QUERY = gql`
  query articles {
    articlesLazy {
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
  articlesLazy: IArticleNode[];
}

const ArticlesLazyList = () => {
  const [load, { called, loading, error, data }] = useLazyQuery<QueryResult>(
    QUERY,
    {
      fetchPolicy: 'cache-and-network',
      returnPartialData: true,
    }
  );

  useEffect(() => {
    console.log('trigger load');
    load();
  }, []);

  const items = data?.articlesLazy ?? [];
  console.log(`render`, { items });
  const content =
    !called && loading ? (
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
      <h3>Articles List (Lazy Query)</h3>
      {content}
    </div>
  );
};
export default ArticlesLazyList;
