import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import Feed from './feed';

const client = new ApolloClient({
  cache: new InMemoryCache(),
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
