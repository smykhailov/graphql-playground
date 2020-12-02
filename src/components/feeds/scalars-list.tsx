import { useScalarsQuery } from 'data/generated/graphql';

const ScalarsList = () => {
  const { data, loading, error } = useScalarsQuery();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div>
      <h3>Scalars List</h3>
      <ul>
        {data?.scalars?.map((item) => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    </div>
  );
};

export default ScalarsList;
