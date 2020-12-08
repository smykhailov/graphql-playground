import {
  ApolloClient,
  from,
  NormalizedCacheObject,
  Resolvers as ApolloResolvers,
} from '@apollo/client';

import { makeExecutableSchema } from '@graphql-tools/schema';

import { QueryResolvers, Resolvers } from './generated/graphql';
import {
  feedResolver,
  feedStreamPaginationResolver,
  feedStreamResolver,
  scalarsResolver,
  feedStreamPaginationFeedsResolver,
} from './resolver/feed-resolvers';

import typeDefs from './generated/schema';

import createGraphQLContext, { IGraphQLContext } from './graphql-context';
import { StreamLink } from './link/StreamLink';
import { cache } from './cache';

export const buildClient: () => ApolloClient<NormalizedCacheObject> = () => {
  const schema = makeExecutableSchema<IGraphQLContext>({
    typeDefs: typeDefs,
    resolvers: buildResolvers(),
  });

  return new ApolloClient({
    cache,
    link: from([
      new StreamLink({
        schema: schema,
        context: createGraphQLContext(),
      }),
    ]),
  });
};

const queryResolvers: QueryResolvers = {
  feeds: feedResolver,
  feedStream: feedStreamResolver as any, // FIXME: type properly AsyncGeneratorResolver
  scalars: scalarsResolver as any, // FIXME: type properly AsyncGeneratorResolver
  feedStreamPagination: feedStreamPaginationResolver,
};

const buildResolvers: () => ApolloResolvers = () => {
  const resolvers: Resolvers = {
    Query: queryResolvers,
    FeedStreamPagination: {
      feeds: feedStreamPaginationFeedsResolver as any, // FIXME: type properly AsyncGeneratorResolver
    },
  };

  // TODO: is it possible to make resolvers compatible with ApolloClient resolvers?
  return resolvers as ApolloResolvers;
};
