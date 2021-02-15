import { FetchResult, Observable, Operation } from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';

import { AsyncExecutionResult, execute, ExecutionPatchResult } from 'graphql';
import { cloneDeep, first, get } from 'lodash';

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
          return { result, context };
        })
        .then(async ({ result, context }) => {
          if (!observer.closed) {
            if (isAsyncIterable(result)) {
              let initialResult: Record<string, any> = {};

              for await (const payload of result) {
                if (isExecutionPatchResult(payload) && payload.path) {
                  const data = cloneDeep(payload.data);
                  initialResult = cloneDeep(initialResult);
                  const path = [...payload.path];
                  const slicedPath = path.slice(0, -1) as string[];

                  initialResult = getHydratedInitialResult(
                    initialResult.data,
                    data,
                    slicedPath
                  );

                  if (
                    initialResult.data.feedsStream.edges.length ===
                    get(context.streamedFieldsPackageSize, slicedPath.join('/'))
                  ) {
                    observer.next(initialResult);
                    initialResult = getEmptyInitialResult(
                      initialResult.data,
                      slicedPath
                    );
                  }
                } else if (payload.data) {
                  initialResult = payload;
                  // TODO: cover when on
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

const getHydratedInitialResult = (
  existing: Record<string, any>,
  data: any,
  path: string[]
) => ({
  data: generateEmbeddedPatchByPath(existing, data, path),
});

const generateEmbeddedPatchByPath = (
  existing: Record<string, any>,
  data: any,
  path: string[]
): IEmbeddedPatch => {
  const firstElement = first(path);
  if (firstElement === undefined) {
    return {};
  }
  return path.length === 1
    ? {
        ...existing,
        [firstElement]: [...existing[firstElement], data],
      }
    : {
        ...existing,
        [firstElement]: {
          ...generateEmbeddedPatchByPath(
            existing[firstElement] ?? {},
            data,
            path.slice(1)
          ),
        },
      };
};

const getEmptyInitialResult = (data: Record<string, any>, path: string[]) => ({
  data: cleanEmbeddedPatchByPath(data, path),
});

const cleanEmbeddedPatchByPath = (
  existing: Record<string, any>,
  path: string[]
): IEmbeddedPatch => {
  const firstElement = first(path);
  if (firstElement === undefined) {
    return {};
  }
  return path.length === 1
    ? {
        ...existing,
        [firstElement]: [],
      }
    : {
        ...existing,
        [firstElement]: {
          ...cleanEmbeddedPatchByPath(
            existing[firstElement] ?? {},
            path.slice(1)
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
