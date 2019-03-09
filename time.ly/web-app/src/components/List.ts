import styled from 'styled-components';

export const Entry = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;

  border-top: 1px solid ${props => props.theme.palette.secondary};
  border-bottom: 1px solid ${props => props.theme.palette.secondary};
  padding: 0.5rem 1rem;
`;

export const Item = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Name = styled.span`
  font-size: 1.125rem;
`;

export const Description = styled.span`
  font-size: 0.75rem;
`;
