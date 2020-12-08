import { useFeedStreamPaginationQuery } from 'data/generated/graphql';

const FeedPagination = () => {
  const { data, loading, error } = useFeedStreamPaginationQuery();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div>
      <h3>Feed Pagination</h3>
      <ul>
        {data?.feedStreamPagination?.feeds?.map((item) => {
          return <li key={item?.id}>{item?.title}</li>;
        })}
      </ul>
    </div>
  );
};

export default FeedPagination;
