import { FetchResult, Observable, Operation } from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';

import { AsyncExecutionResult, execute, ExecutionPatchResult } from 'graphql';
import { cloneDeep, first } from 'lodash';
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
              for await (const payload of result) {
                // console.log('payload', cloneDeep(Object.freeze(payload)));
                if (isExecutionPatchResult(payload) && payload.path) {
                  const path = [...payload.path!];

                  const data = generateEmbeddedPatchByPath(
                    {
                      feedStreamEmbedded: { __typename: 'FeedStreamEmbedded' },
                    },
                    cloneDeep(payload.data),
                    path.slice(0, -1) as string[]
                  );

                  const patch = { data };
                  console.log('payload', payload);
                  // debugger;
                  observer.next(patch);
                } else if (payload.data) {
                  console.log('payload', payload);
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
  [key: string]: EmbeddedPatch | EmbeddedArrayPatch;
}

type EmbeddedArrayPatch = any[];

const generateEmbeddedPatchByPath = (
  existing: Record<string, any>,
  data: any,
  path: string[]
): EmbeddedPatch => {
  return path.length === 1
    ? {
        ...existing,
        [first(path)!]: [...(existing[first(path)!] ?? []), data],
      }
    : {
        ...existing,
        [first(path)!]: generateEmbeddedPatchByPath(
          existing[first(path)!] ?? {},
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
