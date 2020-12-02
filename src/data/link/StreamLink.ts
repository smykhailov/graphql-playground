import { FetchResult, Observable, Operation } from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';
import { AsyncExecutionResult, execute, ExecutionPatchResult } from 'graphql';
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
        .then((context) =>
          execute(
            this.schema,
            operation.query,
            this.rootValue,
            context,
            operation.variables,
            operation.operationName
          )
        )
        .then(async (result) => {
          if (!observer.closed) {
            if (isAsyncIterable(result)) {
              while (true) {
                const data = await result.next();
                if (data.done) {
                  break;
                }

                if (isExecutionPatchResult(data.value) && data.value.path) {
                  const value = {
                    data: {},
                    hasNext: data.value.hasNext,
                  };

                  set(
                    value.data,
                    data.value.path.filter(
                      (_) => typeof _ === 'string' // could include last item as an index
                    ),
                    [data.value.data]
                  );

                  observer.next(value);
                } else {
                  observer.next({ ...data.value });
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
