import { FieldPolicy, makeVar } from '@apollo/client';

interface Params<T> {
  getInitialValue(): T;

  hasMore(): boolean;

  load(first: number): Promise<T>;
}

export function createReactiveField<T extends Array<any>>(
  params: Params<T>
): FieldPolicy<T, T, T> {
  const { getInitialValue, hasMore, load } = params;
  // TODO: figure out how to set initial value inside read function
  const valueVar = makeVar(getInitialValue());
  let loadingData = false;

  return {
    read: (_, options) => {
      const { first } = options?.args ?? {};
      const value = valueVar();
      // TODO: it reads first 5 items twice, figure out the reason
      console.log(`read ${first} items (${value.length} available)`);
      if (value.length < first && hasMore() && !loadingData) {
        loadingData = true;
        console.log('trigger data update');
        load(first).then((data) => {
          console.log('data updated', data.length);
          valueVar(data);
          loadingData = false;
        });
      }

      return valueVar();
    },
  };
}
