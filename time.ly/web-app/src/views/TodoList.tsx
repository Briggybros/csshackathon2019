import * as React from 'react';
import { functions } from 'firebase';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';
import styled from 'styled-components';

import { Todo } from '../types';

const Entry = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;

  border-top: 1px solid ${props => props.theme.palette.secondary};
  border-bottom: 1px solid ${props => props.theme.palette.secondary};
  padding: 0.5rem 1rem;
`;

const Item = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

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

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-size: 1.125rem;
`;

const Description = styled.span`
  font-size: 0.75rem;
`;

interface Props {
  user: firebase.User | null;
}

export const TodoList = ({ user }: Props) => {
  const [todoList, setTodoList] = React.useState<Todo[]>([
    {
      name: 'Go to the gym',
      datetime: 1552099479834,
      duration: 1,
      done: false,
    },
  ]);

  React.useEffect(() => {
    if (user) {
      functions()
        .httpsCallable('getTodaysTodosForUser')()
        .then(response => {
          // return setTodoList(response.data.todolist);
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
    </>
  );
};
