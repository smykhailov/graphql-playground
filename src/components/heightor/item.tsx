import { forwardRef } from 'react';
import { IItem } from './utils';
import * as S from './styles';

const Item = forwardRef<HTMLLIElement, { item: IItem }>(({ item }, ref) => {
  return (
    <S.Item ref={ref} className="item-test" key={item.id}>
      <S.Title className="title">{item.title}</S.Title>
      <S.Subtitle className="subTitle">{item.subTitle}</S.Subtitle>
      <S.Description>{item.description}</S.Description>
    </S.Item>
  );
});

export default Item;
