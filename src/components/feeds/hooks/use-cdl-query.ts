import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useQuery,
} from '@apollo/client';
import { useEffect, useMemo } from 'react';

const useCDLQuery = <TData, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  predicateToRefetch: (data: QueryResult<TData, TVariables>['data']) => boolean,
  options?: QueryHookOptions<TData, TVariables>
) => {
  const {
    data,
    loading,
    error,
    refetch,
    networkStatus,
    client,
    previousData,
  } = useQuery<TData, TVariables>(query, options);

  const variables = useMemo(() => options?.variables ?? {}, [
    options?.variables,
  ]);

  useEffect(() => {
    if (!loading && predicateToRefetch(data)) {
      refetch(variables);
    }
  }, [loading, refetch, variables, data, predicateToRefetch]);

  return {
    data,
    error,
    refetch,
    networkStatus,
    client,
    previousData,
    loading,
  };
};

export default useCDLQuery;
