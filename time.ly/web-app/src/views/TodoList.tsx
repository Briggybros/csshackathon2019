import * as React from 'react';
import { functions } from 'firebase';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';
import styled from 'styled-components';

import { Entry, Item, Info, Name, Description } from '../components/List';
import { Footer } from '../components/Footer';

import { Todo } from '../types';

const DoneIcon = styled(MdRadioButtonChecked)`
  font-size: 1.5rem;
  color: ${props => props.theme.palette.dark};
  margin-right: 0.75rem;
`;

const UndoneIcon = styled(MdRadioButtonUnchecked)`
  font-size: 1.5rem;
  color: ${props => props.theme.palette.dark};
  margin-right: 0.75rem;
`;

interface Props {
  user: firebase.User | null;
}

export const TodoList = ({ user }: Props) => {
  const [todoList, setTodoList] = React.useState<Todo[]>([]);

  React.useEffect(() => {
    if (user) {
      functions()
        .httpsCallable('getTodaysTodosForUser')()
        .then(response => {
          return setTodoList(response.data.todolist);
        })
        .catch(console.error);
    }
  }, [user]);

  return (
    <>
      {todoList.map(todo => (
        <Entry key={todo.name}>
          <Item
            onClick={() => {
              setTodoList([
                {
                  ...todo,
                  done: !todo.done,
                },
              ]);
            }}
          >
            {todo.done ? <DoneIcon /> : <UndoneIcon />}
            <Info>
              <Name>{todo.name}</Name>
              <Description>
                At {new Date(todo.datetime).getHours()}:00 for {todo.duration}{' '}
                hour
                {todo.duration !== 1 && 's'}
              </Description>
            </Info>
          </Item>
        </Entry>
      ))}
      <Footer />
    </>
  );
};
