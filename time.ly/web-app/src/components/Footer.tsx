import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDone, MdToday } from 'react-icons/md';
import styled from 'styled-components';

const Foot = styled.footer`
  position: absolute;
  bottom: 0;

  display: flex;
  flex-direction: row;

  width: 100%;
  height: 48px;

  background: ${props => props.theme.palette.dark};
`;

const Link = styled(NavLink)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  flex-grow: 1;
  flex-shrink: 0;
  background: none;

  font-size: 1.5rem;
  text-decoration: none;
  color: white;

  &.active {
    background: ${props => props.theme.palette.primary};
  }

  & > span {
    font-size: 0.6rem;
  }
`;

export const Footer = () => (
  <Foot>
    <Link exact to="/">
      <MdDone />
      <span>Today</span>
    </Link>
    <Link to="/schedule">
      <MdToday />
      <span>Schedule</span>
    </Link>
  </Foot>
);
