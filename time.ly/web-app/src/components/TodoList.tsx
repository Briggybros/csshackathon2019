import styled from 'styled-components';

interface TodoListProps {

}

interface TodoProps {
    name: string,
    done: boolean,
    scheduledDateTime: Date,
    scheduledDuration: number,
}

const TodoText = styled.p`

`
const TodoDateTime = styled.p`

`

const TodoItem = (props: TodoProps) => (
    <li>
        <TodoText>{props.name}</TodoText>
    </li>
)

const StyledTodoItem = styled(TodoItem)`

` 
const TodoList = (props: TodoListProps) => (
    <ul>
        
    </ul>
)