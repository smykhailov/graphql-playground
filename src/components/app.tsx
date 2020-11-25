import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import Feed from './feed';

const resolvers = {
  Query: {
    feed: () => {
      return [
        {
          id: '1',
          title: 'First Feed',
          description: 'some feed',
        },
      ];
    },
  },
};

const client = new ApolloClient({
  cache: new InMemoryCache(),
  resolvers: resolvers,
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div>Ostapoff Basic CRA Template</div>
      <Feed />
    </ApolloProvider>
  );
};

export default App;
