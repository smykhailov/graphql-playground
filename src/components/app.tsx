import { ApolloProvider } from '@apollo/client';

import { buildClient } from 'data/data-builder';

import FeedsContainer from './feeds/feeds-container';

const App = () => {
  const client = buildClient();

  return (
    <ApolloProvider client={client}>
      <h1>Adapting Apollo Schema Link for @stream GraphQL directive</h1>
      <p>There are 4 components</p>
      <ol>
        <li>
          FeedsList: list of feeds without <code>@stream</code>
        </li>
        <li>
          FeedStream: list of feeds with <code>@stream</code>, where after each
          yeild is delay
        </li>
        <li>
          FeedStreamEmbedded: the same as <code>FeedStream</code> but{' '}
          <code>@stream</code> is embedded
        </li>
        <li>
          ArticlesStream: the same as <code>FeedStream</code> but it is a list
          of articles{' '}
        </li>
      </ol>
      <h2>Known Issues:</h2>
      <ol>
        <li>
          All components work except the embedded one (yeilding is happenning,
          but Apolo cache ignores it)
        </li>
        <li>
          If more than 1 component is rendered, data from the rest components is
          ignored by Apollo cache
        </li>
      </ol>
      <h2>Demo</h2>
      <p>
        Go to <code>feeds-container.tsx</code> and render components differently
        to reproduce the issues
      </p>
      <FeedsContainer />
    </ApolloProvider>
  );
};

export default App;
