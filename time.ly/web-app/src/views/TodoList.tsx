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

interface TodoList {
  date: string;
  id: string;
  userId: string;
  todos: Todo[];
}

interface Props {
  user: firebase.User | null;
}

export const TodoList = ({ user }: Props) => {
  const [todoList, setTodoList] = React.useState<TodoList | null>(null);

  React.useEffect(() => {
    if (user) {
      functions()
        .httpsCallable('getTodaysTodosForUser')()
        .then(response => {
          if (!response.data) {
            console.error('No data');
            return;
          }
          return setTodoList(response.data);
        })
        .catch(console.error);
    }
  }, [user]);

  return (
    <>
      {todoList &&
        todoList.todos.map(todo => (
          <Entry key={todo.name}>
            <Item
              onClick={() => {
                setTodoList({
                  ...todoList,
                  todos: todoList.todos.map(mtodo => {
                    if (mtodo.todoId === todo.todoId) {
                      return { ...mtodo, done: !mtodo.done };
                    } else {
                      return mtodo;
                    }
                  }),
                });
              }}
            >
              {todo.done ? <DoneIcon /> : <UndoneIcon />}
              <Info>
                <Name>{todo.name}</Name>
                <Description>
                  At {new Date(todo.scheduledDateTime).getHours()}:00 for{' '}
                  {todo.scheduledDuration / 60} hour
                  {todo.scheduledDuration / 60 !== 1 && 's'}
                </Description>
              </Info>
            </Item>
          </Entry>
        ))}
      <Footer />
    </>
  );
};
