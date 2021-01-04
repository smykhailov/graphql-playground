import { IGraphQLContext } from 'data/graphql-context';

// TODO: is there simplified way to declare resolver type?
export const feedResolver = async (
  _: object,
  __: object,
  context: IGraphQLContext
) => {
  return await context.feeds();
};

export const articlesResolver = async (
  _: object,
  __: object,
  context: IGraphQLContext
) => {
  return await context.articles();
};

export const feedsStreamResolver = async (
  _: object,
  { after, first }: { after: string; first: number },
  context: IGraphQLContext
) => {
  return context.feedsStream(after, first);
};

export const feedsStreamEdgesResolver = async (
  _: object,
  { after, first }: { after: string; first: number },
  context: IGraphQLContext
) => {
  return context.feedsStreamEdges();
};
