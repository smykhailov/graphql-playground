import { useFeedStreamQuery } from 'data/generated/graphql';

const FeedStream = () => {
  const { data, loading, error } = useFeedStreamQuery({
    variables: { initialCount: 10 },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  console.error(data);

  return (
    <div>
      <h3>Feeds Stream</h3>
      <ul>
        {data?.feedStream?.map((item) => {
          return <li key={item?.id}>{item?.title}</li>;
        })}
      </ul>
    </div>
  );
};

export default FeedStream;
