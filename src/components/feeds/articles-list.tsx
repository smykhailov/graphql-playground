import { gql, useQuery } from '@apollo/client';

const QUERY = gql`
  query articles {
    articles @stream(initialCount: 1) {
      id
      title
      author
    }
  }
`;

export interface Article {
  id: string;
  title: string;
  author: string;
}

interface QueryResult {
  articles: Article[];
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
      <h3>Articles List</h3>
      <ul>
        {data?.articles.map((item) => {
          return (
            <li key={item.id}>
              {item.title} by {item.author}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ArticlesList;
