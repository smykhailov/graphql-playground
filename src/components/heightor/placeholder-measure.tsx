import { useMemo, useRef, useCallback, useEffect } from 'react';
import { ICache, generateEmptyCache, IItem } from './utils';
import * as S from './styles';
import Item from './item';

const PlaceholderMeasure = ({
  onDone,
  data,
}: {
  onDone: (cache: ICache) => void;
  data: IItem[];
}) => {
  const char = useMemo(() => data[0].title.charAt(0).toUpperCase(), []);
  const refsNoSubtitles = useRef<HTMLLIElement[]>([]);
  const refsWithSubtitles = useRef<HTMLLIElement[]>([]);
  const cache = useRef<ICache>(generateEmptyCache());

  const maxChars = useMemo(
    () =>
      data.reduce((maxValue, item) => {
        const value = item.title.split('').length;
        if (value > maxValue) {
          maxValue = value;
        }
        return maxValue;
      }, 0),
    []
  );

  const assignItemRef1 = useCallback((element: HTMLLIElement | null) => {
    if (element) {
      refsWithSubtitles.current.push(element);
    }
  }, []);

  const assignItemRef2 = useCallback((element: HTMLLIElement | null) => {
    if (element) {
      refsNoSubtitles.current.push(element);
    }
  }, []);

  useEffect(() => {
    refsWithSubtitles.current.forEach((element, index) => {
      const height = Math.floor(element.getBoundingClientRect().height);
      if (index === 0) {
        cache.current.L.height = height;
        cache.current.L.min = 0;
      }

      if (height !== cache.current.L.height && !cache.current.XL.height) {
        element.style.background = 'red';
        cache.current.L.max = (index + 1) * 2 - 1;
        cache.current.XL.height = height;
        cache.current.XL.min = (index + 1) * 2;
      }
    });

    refsNoSubtitles.current.forEach((element, index) => {
      const height = Math.floor(element.getBoundingClientRect().height);
      if (index === 0) {
        cache.current.S.height = height;
        cache.current.S.min = 0;
      }

      if (height !== cache.current.S.height && !cache.current.M.height) {
        element.style.background = 'blue';
        cache.current.S.max = (index + 1) * 2 - 1;
        cache.current.M.height = height;
        cache.current.M.min = (index + 1) * 2;
      }
    });
    onDone(cache.current);
  }, [onDone]);

  return (
    <S.Placeholder>
      {new Array(Math.ceil(maxChars / 2)).fill(null).map((_, index) => {
        const title = new Array(index + 1).fill(char).join(' ');
        return (
          <Item
            ref={assignItemRef1}
            key={index}
            item={{
              ...data[0],
              title,
              subTitle: 'hi',
            }}
          />
        );
      })}
      {new Array(Math.ceil(maxChars / 2)).fill(null).map((_, index) => {
        const title = new Array(index + 1).fill(char).join(' ');
        return (
          <Item
            ref={assignItemRef2}
            key={index}
            item={{
              ...data[0],
              title,
              subTitle: undefined,
            }}
          />
        );
      })}
    </S.Placeholder>
  );
};

export default PlaceholderMeasure;
