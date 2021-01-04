import { FetchResult, Observable, Operation } from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';

import { AsyncExecutionResult, execute, ExecutionPatchResult } from 'graphql';
import { cloneDeep, first } from 'lodash';

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
          if (!observer.closed) {
            if (isAsyncIterable(result)) {
              let initialResult: Record<string, any> = {};
              let rootName: string | null = null;

              for await (const payload of result) {
                if (isExecutionPatchResult(payload) && payload.path) {
                  const data = cloneDeep(payload.data);
                  initialResult = cloneDeep(initialResult);
                  const path = [...payload.path];

                  initialResult = {
                    data: generateEmbeddedPatchByPath(
                      initialResult.data,
                      data,
                      path.slice(0, -1) as string[],
                      {}
                    ),
                  };

                  if (!rootName) {
                    rootName = first(path) as string;
                  }

                  observer.next(initialResult);
                } else if (payload.data) {
                  initialResult = payload;

                  observer.next(initialResult);
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

interface IEmbeddedPatch {
  [key: string]: IEmbeddedPatch | EmbeddedArrayPatch;
}

type EmbeddedArrayPatch = any[];

const generateEmbeddedPatchByPath = (
  existing: Record<string, any>,
  data: any,
  path: string[],
  rootTypenameCache: Record<string, string>
): IEmbeddedPatch => {
  const firstElement = first(path);
  if (firstElement === undefined) {
    return {};
  }
  return path.length === 1
    ? {
        ...existing,
        [firstElement]: [data],
      }
    : {
        ...existing,
        [firstElement]: {
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
