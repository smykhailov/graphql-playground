import React from 'react';
import { useFeedQuery } from 'data/generated/graphql';

const Feed = () => {
  const { data, loading, error } = useFeedQuery();

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
        {data?.feed?.map((item) => {
          return <li></li>;
        })}
      </ul>
    </>
  );
};

export default Feed;
