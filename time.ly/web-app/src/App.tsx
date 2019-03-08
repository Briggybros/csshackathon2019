import * as React from 'react';
import { MdAdd } from 'react-icons/md';
import styled from 'styled-components';

import { useUser } from './providers/Firebase';

import { ScheduleList } from './views/ScheduleList';

import { Header } from './components/Header';
import { Logo } from './components/Logo';
import { Title } from './components/Title';
import { IconButton } from './components/Buttons';
import Login from './components/Login';

const Brand = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface Props {
  user: firebase.User | null;
}

const Renderer = ({ user }: Props) => (
  <>
    <Header>
      <Brand>
        <Logo />
        <Title>Tiemly</Title>
      </Brand>
      <IconButton>
        <MdAdd />
      </IconButton>
    </Header>
    {user === null ? <Login /> : <ScheduleList />}
  </>
);
export const App = useUser(Renderer);
