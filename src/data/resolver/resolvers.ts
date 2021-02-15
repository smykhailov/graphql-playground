import { INode } from 'components/feeds/feeds-stream-list';
import { IGraphQLContext } from 'data/graphql-context';
import { set } from 'lodash';

// TODO: is there simplified way to declare resolver type?
export const feedResolver = async (
  _: object,
  { first }: { first: number },
  context: IGraphQLContext
) => {
  const result = await context.feeds.getCachedData(first);
  return {
    edges: result.map(wrapToEdge),
  };
};

export const articlesResolver = async (
  _: object,
  { first }: { first: number },
  context: IGraphQLContext
) => {
  const result = await context.articles.getCachedData(first);
  return {
    edges: result.map(wrapToEdge),
  };
};

function wrapToEdge<TNode extends { id: string }>(node: TNode) {
  return { node, cursor: node.id };
}

export const feedsStreamResolver = async () => ({});

export async function* feedsStreamEdgesResolver(
  _: object,
  { first }: { first: number },
  context: IGraphQLContext,
  info: any
) {
  const result = await context.feeds.getCachedData(first);

  if (!result.length) {
    await context.feeds.getNetworkData(first);
    const result = await context.feeds.getCachedData(first);
    setPackageSize(context, info, result.length);
    yield* yieldResult(result);
  } else {
    setPackageSize(context, info, result.length);
    yield* yieldResult(result);

    if (!context.feeds.isExhausted) {
      await context.feeds.getNetworkData(first);
      const result = await context.feeds.getCachedData(first);
      setPackageSize(context, info, result.length);
      yield* yieldResult(result);
    }
  }
}

interface IPath {
  key: string;
  prev?: IPath;
}

function getStringifyPath(path: IPath, stringifyPath: string = ''): string {
  stringifyPath = `${path.key}${stringifyPath ? `/${stringifyPath}` : ''}`;
  if (path.prev) {
    stringifyPath = getStringifyPath(path.prev, stringifyPath);
  }

  return stringifyPath;
}

function setPackageSize(
  context: IGraphQLContext,
  info: any,
  packageSize: number
): void {
  set(
    context.streamedFieldsPackageSize,
    getStringifyPath(info.path),
    packageSize
  );
}

function* yieldResult(result: INode[]) {
  const edges = result.map(wrapToEdge);
  for (const edge of edges) {
    yield edge;
  }
}
