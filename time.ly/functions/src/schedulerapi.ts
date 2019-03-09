import { Firestore } from '@google-cloud/firestore';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as functions from 'firebase-functions';
import { SchedulesApi, getUserSchedulesCollection, Schedule } from './schedule_apis';
import { TodoListsApi, TodoList } from './todo_apis';
import { CalendarApis } from './calendarapis'
import * as gaxios from 'gaxios';
import { yyyy_mm_dd } from './dateutils';

interface GeneratedTodo {
  name: string
  datetime: number,
  duration: number,
  done: boolean,
}

export function makeTodoLists(userId: string, gentodos: GeneratedTodo[]): TodoList[] {
  let lists: {[date: string]:TodoList} = {}
  for(let i = 0; i < gentodos.length; i++) {
    const gentodo = gentodos[i]
    const dateStr = yyyy_mm_dd(new Date(gentodo.datetime))
    if(lists[dateStr]) {
      lists[dateStr].todos.push({
        name: gentodo.name,
        scheduledDateTime: gentodo.datetime,
        scheduledDurationMins: gentodo.duration,
        done: gentodo.done,
      })
    } else {
      lists[dateStr] = {
        date: dateStr,
        userId: userId,
        todos: []
      }
    }
  }
  return Object.keys(lists).map(function(key){return lists[key]})
}

export class SchedularApis {
  constructor(private db: Firestore) {}
    generateTodoList = async (userId: string, schedules: Schedule[]): Promise<TodoList[]> => {
      const url = "https://us-central1-boeing2019hackathon.cloudfunctions.net/scheduleMachineLearn/"
      return await gaxios.instance.request({
        method: "POST",
        data: schedules,
      }).then(res => {
        return makeTodoLists(userId, <GeneratedTodo[]>res.data)
      })
    }
    weeklyTodoListsHandler = async (
      data: any,
      context: CallableContext
    ): Promise<any> => {
      if (context.auth == null) {
        return Promise.reject(
          new functions.https.HttpsError('unauthenticated', 'not logged in')
        );
      }

      const userId = context.auth.uid;
      const ref = await getUserSchedulesCollection(this.db, context.auth.uid);
      console.log('userid', context.auth.uid);
      console.log('users ref', ref);
      const schedulesApi = new SchedulesApi(this.db, ref);
      const calendarApis = new CalendarApis(this.db)
      const schedules = await schedulesApi.schedules();
      const calendar = await calendarApis.getPrimaryCalendar(userId)
      // TODO: Call python script and AWAIT
      
      const returnedTodos: TodoList[] = await this.generateTodoList(userId, calendar)

      const todoAPI = new TodoListsApi(this.db);
      for (var i = 0; i < returnedTodos.length; i++) {
        await todoAPI.createTodoListWithTodos(
          userId,
          new Date(Date.parse(returnedTodos[i].date)),
          returnedTodos[i].todos
        );
      }
      return {success: true}
    };
  }
