import { useQuery } from '@apollo/client';
import { useFeedQuery } from 'data/generated/graphql';
import React from 'react';

const Feed = () => {
  const { data, loading, error } = useFeedQuery();

  return <div>Feed goes here</div>;
};

export default Feed;
