import { IGraphQLContext } from 'data/graphql-context';

// TODO: is there simplified way to declare resolver type?
export const feedResolver = async (
  _: object,
  __: object,
  context: IGraphQLContext
) => {
  return await context.feeds();
};

export const feedStreamResolver = async (
  _: object,
  __: object,
  context: IGraphQLContext
) => {
  return await context.feedsStream();
};

export const articlesResolver = async (
  _: object,
  __: object,
  context: IGraphQLContext
) => {
  return await context.articles();
};

export const feedStreamEmbeddedResolver = async (
  _: object,
  __: object,
  context: IGraphQLContext
) => {
  return context.feedStreamEmbedded();
};
