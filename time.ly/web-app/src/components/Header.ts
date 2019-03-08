import styled from 'styled-components';

export const Header = styled.header`
  display: flex;
  flex-direction: row;

  justify-content: space-between;
  align-items: center;

  padding: 1rem;

  background: ${props => props.theme.palette.dark};
`;
