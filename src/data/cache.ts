import { InMemoryCache } from '@apollo/client';
import { Feed, Scalar } from './generated/graphql';

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        scalars: {
          keyArgs: false,
          merge(existing = [], incomingItems: Array<Scalar>) {
            console.log('existing', existing);
            console.log('incomingItems', incomingItems);
            return [...existing, ...incomingItems];
          },
        },
      },
    },
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
