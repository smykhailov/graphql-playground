import {
  FetchResult,
  InMemoryCache,
  Observable,
  Operation,
} from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';

import { AsyncExecutionResult, execute, ExecutionPatchResult } from 'graphql';

export class StreamLink extends SchemaLink {
  public request(operation: Operation): Observable<FetchResult> {
    return new Observable<FetchResult>((observer) => {
      new Promise<SchemaLink.ResolverContext>((resolve) =>
        resolve(
          typeof this.context === 'function'
            ? this.context(operation)
            : this.context
        )
      )
        .then(async (context) => {
          const result = await execute(
            this.schema,
            operation.query,
            this.rootValue,
            context,
            operation.variables,
            operation.operationName
          );
          return result;
        })
        .then(async (result) => {
          const cache = operation.getContext().cache as InMemoryCache;
          if (!observer.closed) {
            if (isAsyncIterable(result)) {
              for await (const payload of result) {
                if (isExecutionPatchResult(payload) && payload.path) {
                  const path = [...payload.path!];
                  cache.modify({
                    fields: generateCacheModifyStrategy(path, {
                      ...payload.data,
                    }),
                  });
                } else if (payload.data) {
                  observer.next(payload);
                }
              }
            } else {
              observer.next(result);
            }
            observer.complete();
          }
        })
        .catch((error) => {
          console.error('error', error);
          if (!observer.closed) {
            observer.error(error);
          }
        });
    });
  }
}

const generateCacheModifyStrategy = (
  path: Array<string | number>,
  data: any
) => {
  const rootFieldName = path[0];
  const pathWithoutIndex = path.slice(1, -1) as string[]; // remove first and the last item (bcz it is an index)
  return {
    [rootFieldName](existing: any) {
      return pathWithoutIndex.length === 0
        ? [...existing, data]
        : generateEmbeddedPatchByPath(existing, data, pathWithoutIndex);
    },
  };
};

interface EmbeddedPatch {
  [key: string]: EmbeddedPatch | EmbeddedArrayPatch;
}

type EmbeddedArrayPatch = any[];

const generateEmbeddedPatchByPath = (
  existing: any,
  data: any,
  path: string[]
): EmbeddedPatch => {
  return path.length === 1
    ? {
        ...existing,
        [path[0]]: [...existing[path[0]], data],
      }
    : {
        ...existing,
        [path[0]]: generateEmbeddedPatchByPath(
          existing[path[0]],
          data,
          path.slice(1)
        ),
      };
};

const isAsyncIterable = (input: unknown): input is AsyncIterable<unknown> => {
  return (
    typeof input === 'object' && input != null && Symbol.asyncIterator in input
  );
};

const isExecutionPatchResult = (
  asyncExecutionResulst: AsyncExecutionResult
): asyncExecutionResulst is ExecutionPatchResult => {
  return !!(asyncExecutionResulst as ExecutionPatchResult).path;
};
