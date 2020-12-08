import { InMemoryCache } from '@apollo/client';
import { Feed } from './generated/graphql';

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    FeedStreamPagination: {
      fields: {
        feeds: {
          keyArgs: false,
          merge(existing = [], incomingItems: Array<Feed>) {
            return [...existing, ...incomingItems];
          },
        },
      },
    },
  },
});
