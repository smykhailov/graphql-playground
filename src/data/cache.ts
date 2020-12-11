import { InMemoryCache } from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feedStream: {
          keyArgs: false,
          merge(e = [], i: Array<any>) {
            return [...e, ...i];
          },
        },
        articles: {
          keyArgs: false,
          merge(e = [], i: Array<any>) {
            return [...e, ...i];
          },
        },
        feedStreamEmbedded: {
          keyArgs: false,
          merge: true,
        },
      },
    },
    FeedStreamEmbedded: {
      fields: {
        feedStream: {
          keyArgs: false,
          merge(e = [], i: Array<any>) {
            return [...e, ...i];
          },
        },
      },
    },
  },
});
