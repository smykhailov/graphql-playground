import { Feed, ResolverFn } from 'data/generated/graphql';
import { IGraphQLContext } from 'data/graphql-context';

// TODO: is there simplified way to declare resolver type?
export const feedResolver: ResolverFn<
  Feed[],
  object,
  IGraphQLContext,
  object
> = async (_: object, __: object, context: IGraphQLContext) => {
  // return [
  //   {
  //     id: '1',
  //     title: 'asdfasf',
  //     description: 'asdf',
  //   },
  // ];

  return await context.feeds();
};
