import { Feed, QueryFeedStreamArgs, ResolverFn } from 'data/generated/graphql';
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

export async function* feedStreamResolver(
  _: object,
  args: QueryFeedStreamArgs,
  context: IGraphQLContext
) {
  for (let i = 0; i < 10; i++) {
    return yield i.toString();
  }

  //  context.feedsStream(args.initialCount);
}
