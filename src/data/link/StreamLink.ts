import { FetchResult, Observable, Operation } from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';
import { sleep } from 'data/utils/sleep';
import { AsyncExecutionResult, execute, ExecutionPatchResult } from 'graphql';
import { cloneDeep } from 'lodash';
import set from 'lodash/set';

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
              await sleep(0);
              for await (const payload of result) {
                if (isExecutionPatchResult(payload) && payload.path) {
                  const value = {
                    data: {},
                    hasNext: payload.hasNext,
                  };

                  set(
                    value.data,
                    payload.path.filter(
                      (_) => typeof _ === 'string' // could include last item as an index
                    ),
                    [payload.data]
                  );

                  observer.next(value);
                } else {
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
          if (!observer.closed) {
            observer.error(error);
          }
        });
    });
  }
}

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
