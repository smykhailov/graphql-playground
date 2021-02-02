import styled from 'styled-components';

export const Container = styled.ul`
  list-style: none;
  margin-left: 0;
  padding-left: 0;
  width: 350px;
`;

export const Item = styled.li`
  border: 1px solid;
`;
export const Title = styled.p``;
export const Subtitle = styled.p`
  &:empty {
    display: none;
  }
`;
export const Description = styled.p``;

export const Placeholder = styled.div``;
