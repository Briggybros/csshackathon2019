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
  const [todoList, setTodoList] = React.useState<TodoList[]>([]);

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

  console.log(todoList);

  return (
    <>
      {todoList &&
        todoList.length > 0 &&
        todoList[0].todos.map(todo => (
          <Entry key={todo.name}>
            <Item
              onClick={() => {
                if (!todo.done) {
                  functions()
                    .httpsCallable('markTodoAsDone')({
                      todoListId: todoList[0].id,
                      todoId: todo.todoId,
                    })
                    .then(() =>
                      setTodoList([
                        {
                          ...todoList[0],
                          todos: todoList[0].todos.map(mtodo => {
                            if (mtodo.todoId === todo.todoId) {
                              return { ...mtodo, done: !mtodo.done };
                            } else {
                              return mtodo;
                            }
                          }),
                        },
                      ])
                    )
                    .catch(console.error);
                }
              }}
            >
              {todo.done ? <DoneIcon /> : <UndoneIcon />}
              <Info>
                <Name>{todo.name}</Name>
                <Description>
                  At {new Date(todo.scheduledDateTime).getHours()}:00 for{' '}
                  {todo.scheduledDurationMins / 60} hour
                  {todo.scheduledDurationMins / 60 !== 1 && 's'}
                </Description>
              </Info>
            </Item>
          </Entry>
        ))}
      <Footer />
    </>
  );
};
