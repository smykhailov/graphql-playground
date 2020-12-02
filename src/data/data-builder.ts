import {
  from,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  Resolvers as ApolloResolvers,
  ApolloLink,
} from '@apollo/client';

import { makeExecutableSchema } from '@graphql-tools/schema';

import { QueryResolvers, Resolvers } from './generated/graphql';
import { feedResolver, feedStreamResolver } from './resolver/feed-resolvers';

import typeDefs from './generated/schema';

import createGraphQLContext, { IGraphQLContext } from './graphql-context';
import { StreamLink } from './link/StreamLink';

const logger = new ApolloLink((operation, forward) => {
  return forward(operation).map((data) => {
    return data;
  });
});

export const buildClient: () => ApolloClient<NormalizedCacheObject> = () => {
  const schema = makeExecutableSchema<IGraphQLContext>({
    typeDefs: typeDefs,
    resolvers: buildResolvers(),
  });

  const link = from([
    logger,
    new StreamLink(
      {
        schema: schema,
        context: createGraphQLContext(),
      },
      buildResolvers()
    ),
  ]);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });
};

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
