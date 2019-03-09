import {
  Firestore,
  QueryDocumentSnapshot,
  DocumentReference
} from "@google-cloud/firestore";
import { CallableContext } from "firebase-functions/lib/providers/https";

import * as dateutils from "./dateutils.js";
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";
import { UserDimensions } from "firebase-functions/lib/providers/analytics";
import { user } from "firebase-functions/lib/providers/auth";

export interface Todo {
  scheduledDateTime: number;
  scheduledDurationMins: number;
  done: boolean;
  todoId?: string;
  name: string;
  scheduleId?: string;
  doneAt?: Date;
}

export interface TodoList {
  id?: string;
  userId: string;
  date: string;
  todos: Todo[];
}

export const TODOLIST_COLLECTION_NAME = "todolists";
export const TODOS_COLLECTION_NAME = "todos";

function mapToTodoItem(doc: DocumentSnapshot): Todo {
  return {
    scheduledDateTime: doc.get("scheduledDateTime"),
    scheduledDurationMins: doc.get("scheduledDurationMins"),
    done: doc.get("done"),
    todoId: doc.id,
    name: doc.get("name"),
    scheduleId: doc.get("scheduleId"),
    doneAt: doc.get("doneAt")
  };
}

function mapDocToTodoList(doc: DocumentSnapshot): TodoList {
  return {
    id: doc.id,
    userId: doc.get("userId"),
    date: doc.get("date"),
    todos: doc.get("todos").map(mapToTodoItem)
  };
}

export class DailyTodoListApi {
  constructor(
    private db: Firestore,
    private userId: string,
    private todoListRef: DocumentReference,
    private dateStart: Date,
    private dateEnd: Date
  ) {
    this.db = db;
    this.todoListRef = todoListRef;
    this.userId = userId;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
  }

  async getTodos(): Promise<any[]> {
    return await this.db
      .collection(TODOLIST_COLLECTION_NAME)
      .where("userId", "==", this.userId)
      .get()
      .then(data => {
        return data.docs.map(s => s.data);
      });
  }

  async addTodos(todos: Todo[]): Promise<any> {
    const todosRef = this.todoListRef.collection(TODOS_COLLECTION_NAME);
    const batch = this.db.batch();
    for (let i = 0; i < todos.length; i++) {
      const singleTodoRef = todosRef.doc();
      batch.set(singleTodoRef, todos[i]);
    }
    return batch.commit();
  }

  async tickTodo(todoId: string): Promise<any> {
    return await this.todoListRef
      .collection(TODOS_COLLECTION_NAME)
      .doc(todoId)
      .update({ done: true, doneAt: new Date() });
  }
}

export class TodoListsApi {
  constructor(private db: Firestore) {}

  async createTodoListWithTodos(userId: string, date: Date, todos: Todo[]) {
    const newTodoList: TodoList = {
      id: "",
      userId: userId,
      date: dateutils.yyyy_mm_dd(date),
      todos: todos
    };

    var dateRange = dateutils.todaysDateRange();
    return await this.db
      .collection(TODOLIST_COLLECTION_NAME)
      .add(newTodoList)
      .then(docRef => {
        console.log("created new empty todolist for today for user", userId);
        const todoListApi = new DailyTodoListApi(
          this.db,
          userId,
          docRef,
          dateRange.startDate,
          dateRange.endDate
        );
        return todoListApi.addTodos(todos);
      })
      .catch(err => {
        console.log("error creating new todolist", err);
      });
  }

  async createTodoList(userId: string, date: Date) {
    return this.createTodoListWithTodos(userId, date, []);
  }

  async getTodayTodos(userId: string): Promise<TodoList> {
    const query = this.db
      .collection(TODOLIST_COLLECTION_NAME)
      .where("userId", "==", userId)
      .where("date", "==", dateutils.yyyy_mm_dd(new Date()))
      .orderBy("datetime")
      .limit(1);
    return query.get().then(result => {
      console.log("finished querying data", result.docs[0]);
      return mapDocToTodoList(result.docs[0]);
    });
  }

  async getWeeklyTodos(userId: string): Promise<any[]> {
    const dateRange = dateutils.thisWeeksDateRange();
    const query = this.db
      .collection(TODOLIST_COLLECTION_NAME)
      .where("userId", "==", userId)
      .where("date", ">=", dateutils.yyyy_mm_dd(dateRange.startDate))
      .where("date", "<=", dateutils.yyyy_mm_dd(dateRange.endDate))
      .limit(7);
    return await query.get().then(result => {
      console.log("get weekly todos data", result.docs);
      return result.docs.map(mapDocToTodoList);
    });
  }
}

/**
 *    data
 *        {
 *        name,
 *        datetime,
 *        duration,
 *        done
 *        }
 *
 */
export class TodosApiHandler {
  constructor(private db: Firestore) {}

  async getTodaysTodosHandler(
    data: any,
    context: CallableContext
  ): Promise<any> {
    const listsApi = new TodoListsApi(this.db);
    if (!context.auth) {
      return {
        status: "forbidden",
        code: 403,
        message: "You're not authorised"
      };
    }
    const userId = context.auth.uid;
    return listsApi.getTodayTodos(userId);
  }

  async getThisWeekTodosHandler(
    data: any,
    context: CallableContext
  ): Promise<any> {
    const listsApi = new TodoListsApi(this.db);
    if (!context.auth) {
      return {
        status: "forbidden",
        code: 403,
        message: "You're not authorised"
      };
    }
    const userId = context.auth.uid;
    return listsApi.getWeeklyTodos(userId);
  }

  addTodosHandler(data: any, context: CallableContext): any {
    const listsApi = new TodoListsApi(this.db);
    if (!context.auth) {
      return {
        status: "forbidden",
        code: 403,
        message: "You're not authorised"
      };
    }
    const userId = context.auth.uid;
    const { name, datetime, duration, scheduleId } = data;
    const thisToDo: Todo = {
      scheduledDateTime: datetime,
      scheduledDurationMins: duration,
      done: false,
      name: name,
      scheduleId: scheduleId
    };

    const todoListApiDB = listsApi.createTodoListWithTodos(userId, datetime, [
      thisToDo
    ]);

    return todoListApiDB;
  }
}

/** TODO:
 * 2. Front end handlers
 *    - Get TODOLISTS
 *          - Get ToDoLIST
 *              - Get ToDo
 * 3. Fix createTodoListWithTodos
 */
