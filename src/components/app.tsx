import { ApolloProvider } from '@apollo/client';

import { buildClient } from 'data/data-builder';

// import FeedsContainer from './feeds/feeds-container';
import HeightorContainer from './heightor';

const App = () => {
  const client = buildClient();

  return (
    <ApolloProvider client={client}>
      {/* <FeedsContainer /> */}
      <HeightorContainer />
    </ApolloProvider>
  );
};

export default App;
