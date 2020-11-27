import { ApolloProvider } from '@apollo/client';

import { buildClient } from 'data/data-builder';

import FeedsContainer from './feeds/feeds-container';

const App = () => {
  const client = buildClient();

  return (
    <ApolloProvider client={client}>
      <FeedsContainer />
    </ApolloProvider>
  );
};

export default App;
