import { FetchResult, Observable, Operation } from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';

import { AsyncExecutionResult, execute, ExecutionPatchResult } from 'graphql';
import { cloneDeep, first, get } from 'lodash';
import deepFreeze from 'deep-freeze';

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
          // const cache = operation.getContext().cache as InMemoryCache;
          if (!observer.closed) {
            if (isAsyncIterable(result)) {
              let rootTypenameCache: any = {};
              for await (const payload of result) {
                // console.log('payload', cloneDeep(Object.freeze(payload)));
                if (isExecutionPatchResult(payload) && payload.path) {
                  const data = cloneDeep(payload.data);
                  const path = [...payload.path!];

                  const patch = {
                    data: generateEmbeddedPatchByPath(
                      {},
                      data,
                      path.slice(0, -1) as string[],
                      rootTypenameCache
                    ),
                  };

                  observer.next(patch);
                } else if (payload.data) {
                  rootTypenameCache = normalizeObjectIntoCacheBy(
                    payload.data,
                    '__typename'
                  );
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

interface EmbeddedPatch {
  [key: string]: EmbeddedPatch | EmbeddedArrayPatch | string;
}

type EmbeddedArrayPatch = any[];

const generateEmbeddedPatchByPath = (
  existing: Record<string, any>,
  data: any,
  path: string[],
  rootTypenameCache: Record<string, string>
): EmbeddedPatch => {
  const firstElement = first(path)!;
  return path.length === 1
    ? {
        ...existing,
        [firstElement]: [...(existing[firstElement] ?? []), data],
      }
    : {
        ...existing,
        [firstElement]: {
          __typename: rootTypenameCache[firstElement],
          ...generateEmbeddedPatchByPath(
            existing[firstElement] ?? {},
            data,
            path.slice(1),
            rootTypenameCache
          ),
        },
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

const normalizeObjectIntoCacheBy = (
  data: Record<string, any>,
  propName: string
): Record<string, string> => {
  let cache: Record<string, string> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (value[propName]) {
        cache[key] = value[propName];
      }
      const embeddedCache = normalizeObjectIntoCacheBy(value, propName);
      cache = { ...embeddedCache, ...cache };
    }
  });

  return cache;
};
