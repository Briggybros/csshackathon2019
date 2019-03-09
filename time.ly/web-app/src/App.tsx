import * as React from 'react';
import { Link as RawLink } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { MdAdd } from 'react-icons/md';
import styled from 'styled-components';

import { useUser } from './providers/Firebase';

import { TodoList } from './views/TodoList';
import { ScheduleList } from './views/ScheduleList';
import { AddSchedule } from './views/AddSchedule';

import { Header } from './components/Header';
import { Logo } from './components/Logo';
import { Title } from './components/Title';
import { IconButton } from './components/Buttons';
import Login from './components/Login';

const Link = styled(RawLink)`
  text-decoration: none;
`;

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
      <Link to="/">
        <Brand>
          <Logo />
          <Title>Tiemly</Title>
        </Brand>
      </Link>
      <Link to="/add">
        <IconButton>
          <MdAdd />
        </IconButton>
      </Link>
    </Header>
    {user === null ? (
      <Login />
    ) : (
      <Switch>
        <Route exact path="/" component={TodoList} />
        <Route path="/schedule" component={ScheduleList} />
        <Route path="/add" component={AddSchedule} />
      </Switch>
    )}
  </>
);

export const App = useUser(Renderer);
