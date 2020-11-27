import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  Resolvers as ApolloResolvers,
} from '@apollo/client';

import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { QueryResolvers, Resolvers } from './generated/graphql';
import { feedResolver, feedStreamResolver } from './resolver/feed-resolvers';

import typeDefs from './generated/schema';

import createGraphQLContext, { IGraphQLContext } from './graphql-context';

export const buildClient: () => ApolloClient<NormalizedCacheObject> = () => {
  const schema = makeExecutableSchema<IGraphQLContext>({
    typeDefs: typeDefs,
    resolvers: buildResolvers(),
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new SchemaLink({
      schema: schema,
      context: createGraphQLContext(),
    }),
  });
};

const queryResolvers: QueryResolvers = {
  feeds: feedResolver,
  feedStream: feedStreamResolver,
};

const buildResolvers: () => ApolloResolvers = () => {
  const resolvers: Resolvers = {
    Query: queryResolvers,
  };

  // TODO: is it possible to make resolvers compatible with ApolloClient resolvers?
  return resolvers as ApolloResolvers;
};
