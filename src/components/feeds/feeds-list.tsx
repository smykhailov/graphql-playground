import { useFeedsQuery } from 'data/generated/graphql';

const FeedList = () => {
  const { data, loading, error } = useFeedsQuery();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <>
      <div>Feed goes here</div>
      <ul>
        {data?.feeds?.map((item) => {
          return <li key={item?.id}>{item?.title}</li>;
        })}
      </ul>
    </>
  );
};

export default FeedList;
