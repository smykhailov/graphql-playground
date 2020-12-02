import { FetchResult, Observable, Operation } from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';
import { defaultFieldResolver, execute } from 'graphql';

export class StreamLink extends SchemaLink {
  constructor(options: SchemaLink.Options, private resolvers: any) {
    super(options);
  }

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
        .then((data) => {
          if (!observer.closed) {
            if (!isAsyncIterable(data)) {
              observer.next(data);
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
