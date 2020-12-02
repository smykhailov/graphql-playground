import { Feed, ResolverFn } from 'data/generated/graphql';
import { IGraphQLContext } from 'data/graphql-context';
import { sleep } from 'data/utils/sleep';
import faker from 'faker';

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
  args: any,
  context: IGraphQLContext
) {
  yield {
    id: 134,
    title: faker.random.words(5),
    description: faker.random.words(25),
  };
}

export async function* feedStreamResolver1(
  _: object,
  args: any,
  context: IGraphQLContext
) {
  console.log('feed stream resolver NEW');
  for (let i = 0; i < 10; i++) {
    yield {
      id: i.toString(),
      title: faker.random.words(5),
      description: faker.random.words(25),
    };
    await sleep(1000);
  }
}
