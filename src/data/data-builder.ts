import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  Resolvers as ApolloResolvers,
} from '@apollo/client';
// import { SchemaLink } from '@apollo/client/link/schema';

import { QueryResolvers, Resolvers } from './generated/graphql';
import { feedResolver } from './resolver/feed-resolvers';

// import schema from './schema.graphql';

const queryResolvers: QueryResolvers = { feeds: feedResolver };

const buildResolvers: () => ApolloResolvers = () => {
  const resolvers: Resolvers = {
    Query: queryResolvers,
  };

  // TODO: is it possible to make resolvers compatible with ApolloClient resolvers?
  return resolvers as ApolloResolvers;
};

export const buildClient: () => ApolloClient<NormalizedCacheObject> = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    // link: new SchemaLink({ schema }),
    resolvers: buildResolvers(),
  });
};
