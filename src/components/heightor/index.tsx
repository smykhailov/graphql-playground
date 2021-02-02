import { useCallback, useRef, useState } from 'react';
import { generateData, ICache } from './utils';
import * as S from './styles';
import Item from './item';
import PlaceholderMeasure from './placeholder-measure';

const data = generateData(30);

const HeightorContainer = () => {
  const [cache, setCache] = useState<ICache | null>(null);
  const refs = useRef<HTMLLIElement[]>([]);
  const predictedNumber = useRef<number>(0);

  const assignItemRef = useCallback((element: HTMLLIElement | null) => {
    if (element) {
      refs.current.push(element);
    }
  }, []);

  return (
    <S.Container className="container-test">
      <table
        style={{
          fontSize: 10,
          border: '1px solid',
          position: 'fixed',
          right: 200,
          top: 0,
          padding: 0,
        }}
      >
        <thead>
          <tr>
            <th>Real Heigh</th>
            <th>Predicted Heigh</th>
            <th>is Predicted correctly?</th>
            <th>Title Length</th>
          </tr>
        </thead>
        <tbody>
          {refs.current.map((element, i) => {
            if (i === 0) {
              predictedNumber.current = 0;
            }
            const realHeigh = Math.floor(
              element.getBoundingClientRect().height
            );
            const itemData = data[i];
            let size;
            if (itemData.subTitle) {
              if (itemData.title.length <= (cache?.L?.max ?? 0)) {
                size = 'L';
              } else {
                size = 'XL';
              }
            } else {
              if (itemData.title.length <= (cache?.S?.max ?? 0)) {
                size = 'S';
              } else {
                size = 'M';
              }
            }

            const predictedHeigh = cache?.[size].height;

            const isPredictedProperly = predictedHeigh === realHeigh;
            if (isPredictedProperly) {
              predictedNumber.current++;
            }

            return (
              <tr key={i}>
                <td>{realHeigh}</td>
                <td>{predictedHeigh}</td>
                <td>
                  <button
                    onClick={() => {
                      element.scrollIntoView();
                      element.style.background = 'yellow';
                      setTimeout(() => {
                        element.style.background = 'white';
                      }, 3000);
                    }}
                  >
                    {isPredictedProperly ? 'YES' : 'Nooo'}
                  </button>
                </td>
                <td>{itemData.title.length}</td>
              </tr>
            );
          })}
          <tr>
            <td style={{ background: 'green' }}>
              {(predictedNumber.current * 100) / data.length}%
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ background: 'grey', position: 'fixed', right: 0 }}>
        <pre>{JSON.stringify(cache, undefined, 2)}</pre>
      </div>

      {data.map((item) => (
        <Item ref={assignItemRef} key={item.id} item={item} />
      ))}

      <PlaceholderMeasure data={data} onDone={(cache) => setCache(cache)} />
    </S.Container>
  );
};

export default HeightorContainer;
