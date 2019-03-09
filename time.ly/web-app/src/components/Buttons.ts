import styled from 'styled-components';

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: fit-content;

  margin: 0;
  padding: 5px;

  color: white;
  font-size: 1rem;
  background: ${props => props.theme.palette.primary};
  border: none;

  cursor: pointer;

  &:hover {
    background: ${props => props.theme.palette.highlight};
  }
`;

export const IconButton = styled(Button)`
  background: none;
  outline: none;

  & > svg {
    fill: ${props => props.theme.palette.white};
    height: 30px;
    width: 30px;
  }
`;
