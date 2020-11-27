import {
  from,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  Resolvers as ApolloResolvers,
  ApolloLink,
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

  const link = from([
    streamLink,
    new SchemaLink({
      schema: schema,
      context: createGraphQLContext(),
    }),
  ]);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
  });
};

const streamLink = new ApolloLink((operation, forward) => {
  operation.setContext({ start: new Date() });

  console.log(`starting request for ${operation.operationName}`);
  return forward(operation).map((data) => {
    console.log(`ending request for ${operation.operationName}`);
    return data;
  });
});

const queryResolvers: QueryResolvers = {
  feeds: feedResolver,
  feedStream: feedStreamResolver as any,
};

const buildResolvers: () => ApolloResolvers = () => {
  const resolvers: Resolvers = {
    Query: queryResolvers,
  };

  // TODO: is it possible to make resolvers compatible with ApolloClient resolvers?
  return resolvers as ApolloResolvers;
};
