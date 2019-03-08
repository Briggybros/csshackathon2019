import styled from 'styled-components';

export const IconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: fit-content;
  padding: 5px;
  border: none;
  margin: 0;
  background: none;
  outline: none;

  cursor: pointer;

  & > svg {
    fill: ${props => props.theme.palette.white};
    height: 30px;
    width: 30px;
  }
`;
