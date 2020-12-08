import {
  Feed,
  FeedStreamPagination,
  ResolverFn,
  Scalar,
} from 'data/generated/graphql';
import { IGraphQLContext } from 'data/graphql-context';

// TODO: is there simplified way to declare resolver type?
export const feedResolver: ResolverFn<
  Feed[],
  object,
  IGraphQLContext,
  object
> = async (_: object, __: object, context: IGraphQLContext) => {
  return await context.feeds();
};

export const feedStreamResolver: ResolverFn<
  AsyncGenerator<Feed>,
  object,
  IGraphQLContext,
  object
> = async (_: object, __: object, context: IGraphQLContext) => {
  return await context.feedsStream();
};

export const scalarsResolver: ResolverFn<
  AsyncGenerator<Scalar>,
  object,
  IGraphQLContext,
  object
> = async (_: object, __: object, context: IGraphQLContext) => {
  return await context.scalars();
};

export const feedStreamPaginationResolver: ResolverFn<
  FeedStreamPagination,
  object,
  IGraphQLContext,
  object
> = async (_: object, __: object, context: IGraphQLContext) => {
  return context.feedStreamPagination();
};

export const feedStreamPaginationFeedsResolver: ResolverFn<
  AsyncGenerator<Feed>,
  object,
  IGraphQLContext,
  object
> = async (_: object, __: object, context: IGraphQLContext) => {
  return await context.feedsStreamPaginationFeeds();
};
