import {
  ApolloClient,
  from,
  NormalizedCacheObject,
  Resolvers as ApolloResolvers,
} from '@apollo/client';

import { makeExecutableSchema } from '@graphql-tools/schema';

import {
  feedResolver,
  articlesResolver,
  feedsStreamResolver,
  feedsStreamEdgesResolver,
} from './resolver/resolvers';

import createGraphQLContext, { IGraphQLContext } from './graphql-context';
import { StreamLink } from './link/StreamLink';
import { cache } from './cache';
import typeDefs from './typeDefs';

export const buildClient: () => ApolloClient<NormalizedCacheObject> = () => {
  const schema = makeExecutableSchema<IGraphQLContext>({
    typeDefs,
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

const queryResolvers = {
  feeds: feedResolver,
  articles: articlesResolver,
  feedsStream: feedsStreamResolver,
};

const buildResolvers: () => ApolloResolvers = () => {
  const resolvers = {
    Query: queryResolvers,
    FeedsStream: {
      edges: feedsStreamEdgesResolver,
    },
  };

  return resolvers as ApolloResolvers;
};
