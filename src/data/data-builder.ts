import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  Resolvers as ApolloResolvers,
} from '@apollo/client';

import { SchemaLink } from '@apollo/client/link/schema';

// import { loadSchema } from '@graphql-tools/load';
// import { JsonFileLoader } from '@graphql-tools/json-file-loader';

import { QueryResolvers, Resolvers } from './generated/graphql';
import { feedResolver } from './resolver/feed-resolvers';

import schema from './generated/schema';
import createGraphQLContext from './graphql-context';

//// eslint-disable-next-line import/no-webpack-loader-syntax
//const schema = require('raw-loader!./schema.graphql');

const queryResolvers: QueryResolvers = { feeds: feedResolver };

const buildResolvers: () => ApolloResolvers = () => {
  const resolvers: Resolvers = {
    Query: queryResolvers,
  };

  // TODO: is it possible to make resolvers compatible with ApolloClient resolvers?
  return resolvers as ApolloResolvers;
};

export const buildClient: () => ApolloClient<NormalizedCacheObject> = () => {
  // const schema = await loadSchema('./generated/introspection.json', {
  //   // load from local json file
  //   loaders: [new JsonFileLoader()],
  // });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new SchemaLink({
      schema: schema as any,
      context: createGraphQLContext(),
    }),
    resolvers: buildResolvers(),
  });
};
